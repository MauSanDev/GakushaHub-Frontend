import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import PrimaryButton from "../../../components/ui/buttons/PrimaryButton";
import PaginatedContainer from "../../../components/ui/containers/PaginatedContainer";
import SearchBar from '../../../components/ui/inputs/SearchBar';
import CreateResourceModal from "./../CreateResourceModal";
import ResourceDataElement from "./../Components/ResourceDataElement";
import { useResources } from '../../../hooks/newHooks/useResources';

const InstitutionResourcesTab: React.FC<{ onOpenModal: () => void, isModalOpen: boolean, handleCloseModal: () => void, institutionId: string }> = ({ onOpenModal, isModalOpen, handleCloseModal, institutionId }) => {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, isLoading, fetchResources, resetQueries } = useResources(institutionId, page, 10, searchQuery);

    useEffect(() => {
        fetchResources();
    }, [page, institutionId, searchQuery]);

    const handleSearch = (query: string) => {
        setPage(1);
        setSearchQuery(query);
    };

    const filteredResources = data?.documents.filter((resource) =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (resource.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <SearchBar
                    placeholder="Search resources..."
                    onSearch={handleSearch}
                />
                <PrimaryButton
                    label="Add Resource"
                    iconComponent={<FaPlus />}
                    className="ml-4"
                    onClick={onOpenModal}
                />
            </div>

            <PaginatedContainer
                documents={filteredResources}
                currentPage={page}
                totalPages={data?.totalPages || 1}
                onPageChange={setPage}
                RenderComponent={({ document }) => (
                    <ResourceDataElement key={document._id} resourceData={document} canDelete={true} />
                )}
            />

            {isModalOpen && (
                <CreateResourceModal
                    onClose={() => {
                        handleCloseModal();
                        resetQueries();  // Reseteamos la cache para mostrar el nuevo recurso
                    }}
                    institutionId={institutionId}
                />
            )}

            {isLoading && <p>Loading resources...</p>}
        </>
    );
};

export default InstitutionResourcesTab;