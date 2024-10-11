import React, { useState, useEffect, useRef } from 'react';
import { FaPlus } from 'react-icons/fa';
import ModalWrapper from '../ModalWrapper';
import SelectableMemberBox from './SelectableMemberBox';
import { usePaginatedMembers } from '../../hooks/institutionHooks/usePaginatedMembers.ts';
import { MembershipData } from '../../data/Institutions/MembershipData';
import { useAddMembersToGroup } from '../../hooks/institutionHooks/useAddMemberToGroup.tsx';
import SectionContainer from "../../components/ui/containers/SectionContainer.tsx";
import SearchBar from "../../components/ui/inputs/SearchBar.tsx";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import ShowSelectionToggle from "../../components/ui/toggles/ShowSelectionToggle.tsx";

interface BindMembersModalProps {
    onClose: () => void;
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
            <SectionContainer title={"Bind Members to Study Group"} className={"h-[80vh]"} isLoading={isLoading} error={error?.message}>
            <div className="p-6 max-w-5xl w-full flex flex-col h-[80vh]">
                <div className="flex gap-2 mb-4 w-full max-w-4xl justify-between items-center">
                    
                    <SearchBar onSearch={setSearchTerm} placeholder={"Search Members..."} />
                    <div className="flex gap-2">
                        <PrimaryButton iconComponent={<FaPlus />} label={isAdding ? 'Adding...' : 'Add Members'} onClick={handleAddMembers} disabled={selectedMembers.length === 0 || isAdding} className={"text-sm"}/>
                        <ShowSelectionToggle isSelected={showSelectedOnly} onToggle={() => setShowSelectedOnly(!showSelectedOnly)} />
                    </div>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="w-full max-w-4xl flex-grow overflow-y-auto flex flex-col gap-2 pb-4"
                >

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
            </SectionContainer>
        </ModalWrapper>
    );
};

export default BindMembersModal;