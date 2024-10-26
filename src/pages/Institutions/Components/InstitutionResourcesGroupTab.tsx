import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import PrimaryButton from "../../../components/ui/buttons/PrimaryButton";
import PaginatedContainer from "../../../components/ui/containers/PaginatedContainer";
import SearchBar from '../../../components/ui/inputs/SearchBar';
import ResourceGroupComponent from './ResourceGroupComponent';
import { useResourceGroups } from "../../../hooks/newHooks/Resources/useResourceGroups.ts";
import CreateResourceGroupModal from "../CreateResourceGroupModal.tsx";
import { useDeleteElement } from "../../../hooks/useDeleteElement";
import { CollectionTypes } from "../../../data/CollectionTypes";
import {MembershipRole} from "../../../data/MembershipData.ts";
import {useTranslation} from "react-i18next";

const InstitutionResourcesGroupTab: React.FC<{ institutionId: string, role: MembershipRole  }> = ({ institutionId, role }) => {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, fetchResourceGroups, resetQueries } = useResourceGroups(page, 10, searchQuery);
    const { mutate: deleteGroup } = useDeleteElement();
    const { t } = useTranslation();

    useEffect(() => {
        fetchResourceGroups();
    }, [page, searchQuery]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setPage(1);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCreateSuccess = () => {
        handleCloseModal();
        resetQueries();
        fetchResourceGroups();
    };

    const isSensei =  role === MembershipRole.Sensei;
    const isMaster = role === MembershipRole.Owner || role === MembershipRole.Staff;

    const handleDeleteGroup = (groupId: string) => {
        const isConfirmed = window.confirm(t("resourcesKeys.removeGroupConfirm"));
        if (isConfirmed) {
            deleteGroup(
                { elementIds: [groupId], elementType: CollectionTypes.ResourcesGroup },
                {
                    onSuccess: () => {
                        resetQueries();
                        fetchResourceGroups();
                    },
                }
            );
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <SearchBar
                    placeholder="searchPlaceholder"
                    onSearch={handleSearch}
                />
                <PrimaryButton
                    label="resourcesKeys.createGroup"
                    iconComponent={<FaPlus />}
                    className="ml-4"
                    onClick={handleOpenModal}
                />
            </div>

            <PaginatedContainer
                documents={data?.documents || []}
                currentPage={page}
                totalPages={data?.totalPages || 1}
                onPageChange={setPage}
                RenderComponent={({ document }) => (
                    <ResourceGroupComponent
                        key={document._id}
                        resourceGroup={document}
                        institutionId={institutionId}
                        isEditable={isMaster}
                        canDelete={isSensei || isMaster}
                        onAdd={fetchResourceGroups}
                        onDelete={() => handleDeleteGroup(document._id)}
                    />
                )}
            />

            {isModalOpen && (
                <CreateResourceGroupModal
                    onClose={handleCloseModal}
                    onCreateSuccess={handleCreateSuccess}
                    institutionId={institutionId}
                />
            )}
        </>
    );
};

export default InstitutionResourcesGroupTab;