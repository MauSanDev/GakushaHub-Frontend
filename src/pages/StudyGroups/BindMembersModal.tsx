import React, { useState, useEffect } from 'react';
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
import PaginatedContainer from "../../components/ui/containers/PaginatedContainer"; // Importa el componente de paginación

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

    const { data: membersData, isLoading, error, fetchMembers } = usePaginatedMembers(page, 10, institutionId, searchTerm);

    const { mutate: addMembersToGroup, isLoading: isAdding } = useAddMembersToGroup();

    // Ejecuta fetchMembers cada vez que cambian la página, el término de búsqueda o el institutionId
    useEffect(() => {
        fetchMembers();
    }, [page, searchTerm, institutionId, fetchMembers]);

    // Filtra los miembros según el término de búsqueda y si se muestran solo los seleccionados
    const filteredMembers = showSelectedOnly ? selectedMembers : (membersData?.documents ?? []);

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
                            <PrimaryButton iconComponent={<FaPlus />} label={isAdding ? 'Adding...' : 'Add Members'} onClick={handleAddMembers} disabled={selectedMembers.length === 0 || isAdding} className={"text-sm"} />
                            <ShowSelectionToggle isSelected={showSelectedOnly} onToggle={() => setShowSelectedOnly(!showSelectedOnly)} />
                        </div>
                    </div>

                    {/* Uso de PaginatedContainer para manejar la paginación */}
                    {!isLoading && membersData && (
                        <PaginatedContainer
                            documents={filteredMembers} // Miembros filtrados
                            currentPage={page}
                            totalPages={membersData.totalPages}
                            onPageChange={setPage} // Cambia de página
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