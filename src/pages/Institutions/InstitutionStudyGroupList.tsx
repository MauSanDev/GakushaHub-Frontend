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

const InstitutionStudyGroupPage: React.FC = () => {
    const { institutionId } = useParams<{ institutionId: string }>();
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState<boolean>(false);

    const { data: studyGroupsData, isLoading, fetchStudyGroups } = usePaginatedStudyGroups(page, 10, institutionId || "", searchQuery);

    useEffect(() => {
        fetchStudyGroups();
    }, [page, searchQuery, fetchStudyGroups]);

    const handleAddGroupSuccess = () => {
        setIsAddGroupModalOpen(false);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    return (
        <SectionContainer title={"勉強のグループ"} isLoading={isLoading}>
            <div className="w-full max-w-4xl flex flex-col text-left mt-12">
                <div className="flex items-center justify-between mb-4">
                    {/* Reemplazo del input anterior con SearchBar */}
                    <SearchBar
                        onSearch={handleSearch}
                        placeholder="Search study groups..."
                    />
                    <PrimaryButton onClick={() => setIsAddGroupModalOpen(true)} label={"addStudyGroup"} iconComponent={<FaPlus />} className={"text-xs"} />
                </div>

                {!isLoading && studyGroupsData && (
                    <PaginatedContainer
                        documents={studyGroupsData.documents}
                        currentPage={page}
                        totalPages={studyGroupsData.totalPages}
                        onPageChange={setPage}
                        RenderComponent={({ document }) => (
                            <StudyGroupDataElement
                                studyGroup={document}
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