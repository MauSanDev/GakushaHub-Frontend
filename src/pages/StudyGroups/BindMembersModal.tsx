import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import ModalWrapper from '../ModalWrapper';
import SelectableMemberBox from './SelectableMemberBox';
import LoadingScreen from '../../components/LoadingScreen';
import { usePaginatedMembers } from '../../hooks/institutionHooks/usePaginatedMembers.ts';
import { MembershipData } from '../../data/Institutions/MembershipData';
import { useAddMembersToGroup } from '../../hooks/institutionHooks/useAddMemberToGroup.tsx';

interface BindMembersModalProps {
    onClose?: () => void;
    institutionId: string;
    studyGroupId: string;
    selectedMembers?: MembershipData[];
    onSaveSuccess?: (selectedMembers: MembershipData[]) => void;
}

const BindMembersModal: React.FC<BindMembersModalProps> = ({ onClose, institutionId, studyGroupId, onSaveSuccess }) => {
    const [members, setMembers] = useState<MembershipData[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<MembershipData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMembers, setFilteredMembers] = useState<MembershipData[]>([]);
    const [page, setPage] = useState(1);
    const [showSelectedOnly, setShowSelectedOnly] = useState(false); 
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { data: membersData, isLoading, error } = usePaginatedMembers(page, 10, institutionId);

    const { mutate: addMembersToGroup, isLoading: isAdding } = useAddMembersToGroup(); 

    const data = membersData;
    const hasMore = data ? page < (data.totalPages ?? 1) : false;

    
    useEffect(() => {
        if (data) {
            setMembers(prevMembers => {
                const newMembers = data.documents.filter(newMember =>
                    !prevMembers.some(member => member._id === newMember._id)
                );
                return [...prevMembers, ...newMembers];
            });
        }
    }, [data]);

    
    useEffect(() => {
        const filtered = members.filter(member =>
            member.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMembers(showSelectedOnly ? selectedMembers : filtered);
    }, [searchTerm, members, showSelectedOnly, selectedMembers]);

    
    useEffect(() => {
        const handleScroll = () => {
            const scrollContainer = scrollContainerRef.current;
            if (scrollContainer) {
                const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
                if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore) {
                    setPage(prevPage => prevPage + 1);
                }
            }
        };

        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, [hasMore]);

    const handleSelectMember = (member: MembershipData) => {
        setSelectedMembers(prevSelected => [...prevSelected, member]);
    };

    const handleDeselectMember = (member: MembershipData) => {
        setSelectedMembers(prevSelected => prevSelected.filter(selected => selected._id !== member._id));
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleAddMembers = () => {
        addMembersToGroup(
            { studyGroupId, memberIds: selectedMembers.map(member => member._id) },
            {
                onSuccess: () => {
                    if (onSaveSuccess) {
                        onSaveSuccess(selectedMembers);
                    }
                    onClose?.(); 
                },
                onError: (error) => {
                    console.error("Error adding members to group:", error);
                }
            }
        );
    };

    return (
        <ModalWrapper onClose={onClose}>
            <div className="p-6 max-w-5xl w-full flex flex-col h-[80vh]">
                <h2 className="text-2xl font-bold mb-4">Bind Members to Study Group</h2>

                <div className="flex gap-2 mb-4 w-full max-w-4xl justify-between items-center">
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="flex-grow px-4 py-2 rounded lg:text-sm text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    />
                    <div className="flex gap-2">
                        <button
                            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2 text-xs ${selectedMembers.length === 0 || isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={selectedMembers.length === 0 || isAdding}
                            onClick={handleAddMembers}
                        >
                            <FaPlus />
                            {isAdding ? 'Adding...' : 'Add Members'}
                        </button>
                        <button
                            onClick={() => setShowSelectedOnly(!showSelectedOnly)}
                            className={`whitespace-nowrap text-xs border dark:border-gray-700 rounded-full px-3 py-2 transition-all duration-300 transform lg:hover:scale-105 hover:shadow-md flex items-center gap-2 ${
                                showSelectedOnly
                                    ? 'bg-blue-500 dark:bg-green-900 text-white'
                                    : 'bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-blue-300 hover:text-white'
                            }`}
                        >
                            {showSelectedOnly ? <FaEyeSlash /> : <FaEye />}
                            {showSelectedOnly ? 'Show All' : 'Show Selected'}
                        </button>
                    </div>
                </div>

                {/* Contenedor scrolleable para la lista de miembros */}
                <div
                    ref={scrollContainerRef}
                    className="w-full max-w-4xl flex-grow overflow-y-auto flex flex-col gap-2 pb-4"
                >
                    {isLoading && <LoadingScreen isLoading={isLoading} />}

                    {error && <p className="text-red-500">{String(error)}</p>}

                    {filteredMembers.length > 0 ? (
                        filteredMembers.map((member, index) => (
                            <SelectableMemberBox
                                key={index}
                                member={member}
                                isSelected={selectedMembers.some(selected => selected._id === member._id)}
                                onSelectMember={handleSelectMember}
                                onDeselectMember={handleDeselectMember}
                            />
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No members found</p>
                    )}
                </div>
            </div>
        </ModalWrapper>
    );
};

export default BindMembersModal;