import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import ModalWrapper from '../ModalWrapper';
import Container from "../../components/ui/containers/Container.tsx";
import SectionTitle from "../../components/ui/text/SectionTitle.tsx";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import SearchBar from '../../components/ui/inputs/SearchBar';
import PaginatedContainer from "../../components/ui/containers/PaginatedContainer";
import { CollectionTypes } from "../../data/CollectionTypes.tsx";
import { useUpdateList } from "../../hooks/updateHooks/useUpdateList.ts";
import { BaseDeckData } from '../../data/DeckData.ts';
import { useResourceGroups } from "../../hooks/newHooks/Resources/useResourceGroups.ts";
import SelectableResourceGroupComponent from "./Components/SelectableResourceGroupComponent.tsx";

interface AddResourcesGroupToStudyGroupModalProps {
    onClose: () => void;
    onAddGroupsSuccess?: () => void;
    studyGroupId: string;
}

const AddResourcesGroupToStudyGroupModal: React.FC<AddResourcesGroupToStudyGroupModalProps> = ({ onClose, onAddGroupsSuccess, studyGroupId }) => {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

    const { data, isLoading, fetchResourceGroups } = useResourceGroups(page, 10, searchQuery);
    const { mutateAsync: updateList } = useUpdateList();

    useEffect(() => {
        fetchResourceGroups();
    }, [page, searchQuery]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setPage(1);
    };

    const handleGroupSelect = (groupId: string) => {
        setSelectedGroups((prev) =>
            prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
        );
    };

    const handleAddGroups = async () => {
        try {
            await updateList({
                collection: CollectionTypes.StudyGroup,
                documentId: studyGroupId,
                field: "resourcesIds",
                value: selectedGroups,
                action: "add",
            });

            if (onAddGroupsSuccess) {
                onAddGroupsSuccess();
            }
            onClose();
        } catch (error) {
            console.error("Error adding resource groups to study group:", error);
        }
    };

    const filteredGroups = data?.documents.filter((group: BaseDeckData) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <ModalWrapper onClose={onClose}>
            <Container className="w-full">
                <SectionTitle title="Add Resource Groups to Study Group" className="text-center pb-4" />

                <div className="flex justify-between items-center mb-4">
                    <SearchBar
                        placeholder="Search resource groups..."
                        onSearch={handleSearch}
                    />
                    <PrimaryButton
                        label="Add Groups"
                        iconComponent={<FaPlus />}
                        className="ml-4"
                        onClick={handleAddGroups}
                        disabled={selectedGroups.length === 0}
                    />
                </div>

                <PaginatedContainer
                    documents={filteredGroups}
                    currentPage={page}
                    totalPages={data?.totalPages || 1}
                    onPageChange={setPage}
                    RenderComponent={({ document }) => (
                        <SelectableResourceGroupComponent
                            key={document._id}
                            resourceGroup={document}
                            isSelected={selectedGroups.includes(document._id)}
                            onSelected={handleGroupSelect}
                        />
                    )}
                />

                {isLoading && <p>Loading resource groups...</p>}
            </Container>
        </ModalWrapper>
    );
};

export default AddResourcesGroupToStudyGroupModal;