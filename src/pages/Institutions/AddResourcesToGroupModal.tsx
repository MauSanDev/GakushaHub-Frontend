import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import ModalWrapper from '../ModalWrapper';
import Container from "../../components/ui/containers/Container.tsx";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import SearchBar from '../../components/ui/inputs/SearchBar';
import PaginatedContainer from "../../components/ui/containers/PaginatedContainer";
import { useResources } from '../../hooks/newHooks/useResources';
import { ResourceData } from '../../data/Institutions/ResourceData.ts';
import ResourceListElement from "./Components/ResourceListElement.tsx";
import {useUpdateList} from "../../hooks/updateHooks/useUpdateList.ts";
import {CollectionTypes} from "../../data/CollectionTypes.tsx";
import ModalTitle from "../../components/ui/text/ModalTitle.tsx"; // Asume que esta constante define tus colecciones

interface AddResourcesToGroupModalProps {
    onClose: () => void;
    onAddResourcesSuccess?: () => void;
    groupId: string;
    institutionId: string;
}

const AddResourcesToGroupModal: React.FC<AddResourcesToGroupModalProps> = ({ onClose, onAddResourcesSuccess, groupId, institutionId }) => {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedResources, setSelectedResources] = useState<string[]>([]);

    const { data, isLoading, fetchResources } = useResources(institutionId, page, 10, searchQuery);
    const { mutateAsync: updateList } = useUpdateList();

    useEffect(() => {
        fetchResources();
    }, [page, institutionId, searchQuery]);

    const handleSearch = (query: string) => {
        setPage(1);
        setSearchQuery(query);
    };

    const handleResourceSelect = (resourceId: string) => {
        setSelectedResources((prev) => {
            if (prev.includes(resourceId)) {
                return prev.filter((id) => id !== resourceId);
            }
            return [...prev, resourceId];
        });
    };

    const handleAddResources = async () => {
        try {
            await updateList({
                collection: CollectionTypes.ResourcesGroup, // Usa la colección correspondiente
                documentId: groupId,
                field: "elements", // Campo donde se agregarán los IDs de los recursos
                value: selectedResources,
                action: "add",
            });

            if (onAddResourcesSuccess) {
                onAddResourcesSuccess();
            }
            onClose();
        } catch (error) {
            console.error("Error adding resources to group:", error);
        }
    };

    const filteredResources = data?.documents.filter((resource: ResourceData) =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (resource.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <ModalWrapper onClose={onClose}>
            <Container className="w-full">
                <ModalTitle title="Add Resources to Group" className="text-center pb-4" />

                <div className="flex justify-between items-center mb-4">
                    <SearchBar
                        placeholder="Search resources..."
                        onSearch={handleSearch}
                    />
                    <PrimaryButton
                        label="Add Resource"
                        iconComponent={<FaPlus />}
                        className="ml-4"
                        onClick={handleAddResources}
                        disabled={selectedResources.length === 0}
                    />
                </div>

                <PaginatedContainer
                    documents={filteredResources}
                    currentPage={page}
                    totalPages={data?.totalPages || 1}
                    onPageChange={setPage}
                    RenderComponent={({ document }) => (
                        <ResourceListElement
                            key={document._id}
                            resourceData={document}
                            onSelect={() => handleResourceSelect(document._id)}
                            isSelected={selectedResources.includes(document._id)}
                            canOpen={false}
                        />
                    )}
                />

                {isLoading && <p>Loading resources...</p>}
            </Container>
        </ModalWrapper>
    );
};

export default AddResourcesToGroupModal;