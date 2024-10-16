import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import ModalWrapper from '../ModalWrapper';
import SelectableMemberBox from './SelectableMemberBox';
import { usePaginatedMembers } from '../../hooks/institutionHooks/usePaginatedMembers.ts';
import { MembershipData } from '../../data/MembershipData';
import { useAddMembersToGroup } from '../../hooks/institutionHooks/useAddMemberToGroup.tsx'; // Hook modificado
import SectionContainer from "../../components/ui/containers/SectionContainer.tsx";
import SearchBar from "../../components/ui/inputs/SearchBar.tsx";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import ShowSelectionToggle from "../../components/ui/toggles/ShowSelectionToggle.tsx";
import PaginatedContainer from "../../components/ui/containers/PaginatedContainer";

interface BindMembersModalProps {
    onClose: () => void;
    institutionId: string;
    studyGroupId: string;
    selectedMembers?: MembershipData[];
    onSaveSuccess?: (selectedMembers: MembershipData[]) => void;
}

const BindMembersModal: React.FC<BindMembersModalProps> = ({ onClose, institutionId, studyGroupId, onSaveSuccess }) => {
    const [selectedMembers, setSelectedMembers] = useState<MembershipData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);
    const [page, setPage] = useState(1);

    const { data: membersData, isLoading, fetchMemberships } = usePaginatedMembers(page, 10, institutionId, searchTerm);

    const addMembersToGroup = useAddMembersToGroup(studyGroupId); // Usamos el hook modificado

    useEffect(() => {
        fetchMemberships();
    }, [page, searchTerm, institutionId]);

    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    const filteredMembers = showSelectedOnly ? selectedMembers : (membersData?.documents ?? []);

    const handleSelectMember = (member: MembershipData) => {
        setSelectedMembers(prevSelected => [...prevSelected, member]);
    };

    const handleDeselectMember = (member: MembershipData) => {
        setSelectedMembers(prevSelected => prevSelected.filter(selected => selected._id !== member._id));
    };

    const handleAddMembers = async () => {
        try {
            await addMembersToGroup(selectedMembers.map(member => member._id)); // Se llama directamente a la función
            if (onSaveSuccess) {
                onSaveSuccess(selectedMembers);
            }
            onClose?.();
        } catch (error) {
            console.error("Error adding members to group:", error);
        }
    };

    return (
        <ModalWrapper onClose={onClose}>
            <SectionContainer title={"Bind Members to Study Group"} className={"h-[80vh]"} isLoading={isLoading}>
                <div className="p-6 max-w-5xl w-full flex flex-col h-[80vh]">
                    <div className="flex gap-2 mb-4 w-full max-w-4xl justify-between items-center">

                        <SearchBar onSearch={setSearchTerm} placeholder={"Search Members..."} />
                        <div className="flex gap-2">
                            <PrimaryButton iconComponent={<FaPlus />} label={isLoading ? 'Adding...' : 'Add Members'} onClick={handleAddMembers} disabled={selectedMembers.length === 0 || isLoading} className={"text-sm"} />
                            <ShowSelectionToggle isSelected={showSelectedOnly} onToggle={() => setShowSelectedOnly(!showSelectedOnly)} />
                        </div>
                    </div>

                    {!isLoading && membersData && (
                        <PaginatedContainer
                            documents={filteredMembers}
                            currentPage={page}
                            totalPages={membersData.totalPages}
                            onPageChange={setPage}
                            RenderComponent={({ document }) => (
                                <SelectableMemberBox
                                    member={document}
                                    isSelected={selectedMembers.some(selected => selected._id === document._id)}
                                    onSelectMember={handleSelectMember}
                                    onDeselectMember={handleDeselectMember}
                                />
                            )}
                        />
                    )}
                </div>
            </SectionContainer>
        </ModalWrapper>
    );
};

export default BindMembersModal;