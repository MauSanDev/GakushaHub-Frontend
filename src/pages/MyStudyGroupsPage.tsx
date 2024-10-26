import React, { useState, useEffect } from 'react';
import StudyGroupDataElement from './Institutions/Components/StudyGroupDataElement.tsx';
import { useMyStudyGroups } from '../hooks/institutionHooks/useMyStudyGroups';
import SectionContainer from "../components/ui/containers/SectionContainer.tsx";
import SearchBar from "../components/ui/inputs/SearchBar.tsx";
import PaginatedContainer from '../components/ui/containers/PaginatedContainer.tsx';

const MyStudyGroupsPage: React.FC = () => {
    const [page, setPage] = useState<number>(1);  
    const [limit] = useState<number>(10);  
    const [searchQuery, setSearchQuery] = useState<string>('');  

    const { data: studyGroupsData, isLoading, fetchStudyGroups } = useMyStudyGroups(
        page,
        limit,
        searchQuery
    );

    useEffect(() => {
        fetchStudyGroups();  
    }, [page, searchQuery]);

    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    return (
        <SectionContainer title={"私の勉強グループ"} isLoading={isLoading}>
            <div className="w-full max-w-4xl flex flex-col text-left mt-12">
                <div className="flex items-center justify-between mb-4">
                    <SearchBar
                        onSearch={handleSearch}
                        placeholder="searchPlaceholder"
                    />
                </div>

                <PaginatedContainer
                    documents={studyGroupsData?.documents || []}  
                    currentPage={page}  
                    totalPages={studyGroupsData?.totalPages || 0}  
                    onPageChange={setPage}  
                    RenderComponent={({ document }) => (
                        <StudyGroupDataElement
                            key={document._id}
                            studyGroup={document}
                        />
                    )}
                />
            </div>
        </SectionContainer>
    );
};

export default MyStudyGroupsPage;