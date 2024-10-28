import React, { useState, useEffect } from 'react';
import StudyGroupDataElement from './Components/StudyGroupDataElement.tsx';
import AddStudyGroupModal from './AddStudyGroupModal.tsx';
import { useParams } from "react-router-dom";
import { usePaginatedStudyGroups } from '../../hooks/institutionHooks/usePaginatedStudyGroups';
import SectionContainer from "../../components/ui/containers/SectionContainer.tsx";
import PaginatedContainer from '../../components/ui/containers/PaginatedContainer.tsx';
import { FaPlus } from "react-icons/fa";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import SearchBar from "../../components/ui/inputs/SearchBar.tsx";
import { MembershipRole } from '../../data/MembershipData.ts';
import { useInstitutionById } from "../../hooks/institutionHooks/useInstitutionById.ts";
import { useAuth } from "../../context/AuthContext.tsx";

const InstitutionStudyGroupPage: React.FC = () => {
    const { institutionId } = useParams<{ institutionId: string }>();
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState<boolean>(false);
    const { data: institutionData, fetchInstitution } = useInstitutionById(institutionId || "");
    const { data: studyGroupsData, isLoading, fetchStudyGroups } = usePaginatedStudyGroups(page, 10, institutionId || "", searchQuery);

    const { getRole } = useAuth();
    const [role, setRole] = useState<MembershipRole>(MembershipRole.None);
    const [isRoleLoading, setIsRoleLoading] = useState(true);

    useEffect(() => {
        fetchInstitution();
    }, [fetchInstitution]);

    useEffect(() => {
        const fetchUserRole = async () => {
            if (institutionId && institutionData?.creatorId) {
                setIsRoleLoading(true);
                const fetchedRole = await getRole(institutionId, institutionData.creatorId);
                setRole(fetchedRole);
                setIsRoleLoading(false);
            }
        };

        fetchUserRole();
    }, [institutionId, institutionData, getRole]);

    useEffect(() => {
        fetchStudyGroups();
    }, [page, searchQuery]);

    const handleDelete = () => {
        fetchStudyGroups();
    }
    
    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    const handleAddGroupSuccess = () => {
        setIsAddGroupModalOpen(false);
        fetchStudyGroups(); // Refetch study groups after successfully adding one
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const canModifyStudyGroups = role === MembershipRole.Owner || role === MembershipRole.Staff;

    return (
        <SectionContainer title={"勉強のグループ"} isLoading={isLoading || isRoleLoading}>
            <div className="w-full max-w-4xl flex flex-col text-left mt-12">
                <div className="flex items-center justify-between mb-4">
                    <SearchBar
                        onSearch={handleSearch}
                        placeholder="searchPlaceholder"
                    />
                    {canModifyStudyGroups && (
                        <PrimaryButton
                            onClick={() => setIsAddGroupModalOpen(true)}
                            label={"institution.addStudyGroup"}
                            iconComponent={<FaPlus />}
                            className={"text-xs"}
                        />
                    )}
                </div>

                {!isLoading && studyGroupsData && (
                    <PaginatedContainer
                        documents={studyGroupsData.documents}
                        currentPage={page}
                        totalPages={studyGroupsData.totalPages}
                        onPageChange={setPage}
                        RenderComponent={({ document }) => (
                            <StudyGroupDataElement
                                key={document._id}
                                studyGroup={document}
                                canDelete={canModifyStudyGroups}
                                onDelete={handleDelete}
                            />
                        )}
                    />
                )}
            </div>

            {isAddGroupModalOpen && (
                <AddStudyGroupModal
                    onClose={() => setIsAddGroupModalOpen(false)}
                    onCreateSuccess={handleAddGroupSuccess}
                    institutionId={institutionId || ""}
                />
            )}
        </SectionContainer>
    );
};

export default InstitutionStudyGroupPage;