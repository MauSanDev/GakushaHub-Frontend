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
    const { data: institutionData } = useInstitutionById(institutionId || "");
    const { data: studyGroupsData, isLoading, fetchStudyGroups } = usePaginatedStudyGroups(page, 10, institutionId || "", searchQuery);

    const { getRole } = useAuth();  // Usamos getRole desde el contexto de Auth
    const [role, setRole] = useState<MembershipRole>(MembershipRole.None);
    const [isRoleLoading, setIsRoleLoading] = useState(true);  // Manejamos el estado de carga del rol

    useEffect(() => {
        const fetchUserRole = async () => {
            if (institutionId && institutionData?.creatorId) {
                setIsRoleLoading(true);  // Comenzamos la carga del rol
                const fetchedRole = await getRole(institutionId, institutionData.creatorId);
                setRole(fetchedRole);
                setIsRoleLoading(false);  // Terminamos la carga del rol
            }
        };

        fetchUserRole();
    }, [institutionId, institutionData, getRole]);

    useEffect(() => {
        fetchStudyGroups();
    }, [page, searchQuery, fetchStudyGroups]);

    const handleAddGroupSuccess = () => {
        setIsAddGroupModalOpen(false);
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
                        placeholder="Search study groups..."
                    />
                    {canModifyStudyGroups && (
                        <PrimaryButton
                            onClick={() => setIsAddGroupModalOpen(true)}
                            label={"addStudyGroup"}
                            iconComponent={<FaPlus/>}
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
                        RenderComponent={({document}) => (
                            <StudyGroupDataElement
                                studyGroup={document}
                                canDelete={canModifyStudyGroups}
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