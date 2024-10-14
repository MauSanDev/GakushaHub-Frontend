import React, { useState, useEffect } from 'react';
import InstitutionMemberElement from './Components/InstitutionMemberElement.tsx';
import AddInstitutionMembersModal from './AddInstitutionMembersModal';
import { useParams } from 'react-router-dom';
import { usePaginatedMembers } from '../../hooks/institutionHooks/usePaginatedMembers.ts';
import SectionContainer from "../../components/ui/containers/SectionContainer.tsx";
import PaginatedContainer from '../../components/ui/containers/PaginatedContainer.tsx';
import { FaPlus } from "react-icons/fa";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import SearchBar from "../../components/ui/inputs/SearchBar.tsx";
import { useDeleteElement } from '../../hooks/useDeleteElement';
import { CollectionTypes } from "../../data/CollectionTypes.tsx";
import { MembershipRole } from '../../data/MembershipData.ts';
import { useAuth } from '../../context/AuthContext'; // Usa el AuthContext

const InstitutionMembersPage: React.FC = () => {
    const { institutionId } = useParams<{ institutionId: string }>();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState<boolean>(false);
    const [page, setPage] = useState(1);

    const { data: membersData, fetchMemberships, isLoading} = usePaginatedMembers(page, 30, institutionId || '', searchQuery);
    const { mutate: deleteMembership } = useDeleteElement();

    const [role, setRole] = useState<MembershipRole>();
    const { getRole } = useAuth();


    useEffect(() => {
        const fetchUserRole = async () => {
            const fetchedRole = await getRole(institutionId || "", "");
            setRole(fetchedRole);
        };

        fetchUserRole();
    }, [getRole]);

    useEffect(() => {
        fetchMemberships();
    }, [page, searchQuery]);

    const handleAddMemberSuccess = () => {
        setIsAddMemberModalOpen(false);
        fetchMemberships();
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };
    
    const handleRemove = (memberId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to remove this member?");
        if (confirmDelete) {
            deleteMembership(
                {
                    elementIds: [memberId],
                    elementType: CollectionTypes.Membership,
                    deleteRelations: true,
                },
                {
                    onSuccess: () => {
                        setPage(1);
                        fetchMemberships();
                    },
                    onError: (error) => {
                        console.error('Error deleting member:', error);
                    },
                }
            );
        }
    };

    const canManageMembers = role === MembershipRole.Owner || role === MembershipRole.Staff;

    return (
        <SectionContainer title={"メンバー"} isLoading={isLoading}>
            <div className="w-full max-w-4xl flex flex-col text-left mt-12">
                <div className="flex items-center justify-between mb-4">
                    <SearchBar
                        onSearch={handleSearch}
                        placeholder="Search members..."
                    />
                    {canManageMembers && (
                        <PrimaryButton
                            onClick={() => setIsAddMemberModalOpen(true)}
                            label={"addMember"}
                            iconComponent={<FaPlus />}
                            className={"text-xs"}
                        />
                    )}
                </div>

                {!isLoading && membersData && (
                    <PaginatedContainer
                        documents={membersData.documents}
                        currentPage={page}
                        totalPages={membersData.totalPages}
                        onPageChange={setPage}
                        RenderComponent={({ document }) => (
                            <InstitutionMemberElement
                                member={document}
                                onRemove={canManageMembers ? () => handleRemove(document._id) : () => {}}
                                onRoleChange={() => { /* Manejar el cambio de rol si es necesario */ }}
                                canEditRole={canManageMembers}
                                enableRemove={true}
                            />
                        )}
                    />
                )}
            </div>

            {isAddMemberModalOpen && (
                <AddInstitutionMembersModal
                    institutionId={institutionId || ""}
                    onClose={() => setIsAddMemberModalOpen(false)}
                    onAddSuccess={handleAddMemberSuccess}
                />
            )}
        </SectionContainer>
    );
};

export default InstitutionMembersPage;