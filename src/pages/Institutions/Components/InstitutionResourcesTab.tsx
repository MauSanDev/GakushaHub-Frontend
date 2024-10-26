import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import PrimaryButton from "../../../components/ui/buttons/PrimaryButton";
import PaginatedContainer from "../../../components/ui/containers/PaginatedContainer";
import SearchBar from '../../../components/ui/inputs/SearchBar';
import CreateResourceModal from "./../CreateResourceModal";
import ResourceDataElement from "./../Components/ResourceDataElement";
import { useResources } from '../../../hooks/newHooks/useResources';
import {MembershipRole} from "../../../data/MembershipData.ts";

const InstitutionResourcesTab: React.FC<{ institutionId: string, role: MembershipRole }> = ({ institutionId, role }) => {
    const [page, setPage] = useState(1);
    const [isModalOpen, setModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, isLoading, fetchResources } = useResources(institutionId, page, 10, searchQuery);

    useEffect(() => {
        fetchResources();
    }, [page, institutionId, searchQuery]);

    const handleSearch = (query: string) => {
        setPage(1);
        setSearchQuery(query);
    };

    const onItemDeleted = () => {
        fetchResources();
    };
    
    const onModalClose = () =>
    {
        setModalOpen(false);
        fetchResources();
    }
    const canEdit = role === MembershipRole.Owner || role === MembershipRole.Staff || role === MembershipRole.Sensei; 

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
                    onClick={() => setModalOpen(true)}
                />
            </div>

            <PaginatedContainer
                documents={filteredResources}
                currentPage={page}
                totalPages={data?.totalPages || 1}
                onPageChange={setPage}
                RenderComponent={({ document }) => (
                    <ResourceDataElement key={document._id} resourceData={document} canEdit={canEdit} onDelete={onItemDeleted}/>
                )}
            />

            {isModalOpen && (
                <CreateResourceModal
                    onClose={onModalClose}
                    institutionId={institutionId}
                />
            )}

            {isLoading && <p>Loading resources...</p>}
        </>
    );
};

export default InstitutionResourcesTab;