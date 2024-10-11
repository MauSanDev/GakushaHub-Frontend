import React, { useState, useEffect } from 'react';
import CourseDataElement from '../../components/CourseDataElement.tsx';
import { Link, useParams } from "react-router-dom";
import AddCourseButton from "../../components/AddCourseButton.tsx";
import { usePaginatedCourse } from "../../hooks/usePaginatedCourse.ts";
import SectionContainer from "../../components/ui/containers/SectionContainer.tsx";
import PaginatedContainer from '../../components/ui/containers/PaginatedContainer.tsx';
import SearchBar from "../../components/ui/inputs/SearchBar.tsx";

const InstitutionCourseListPage: React.FC = () => {
    const { institutionId } = useParams<{ institutionId: string }>();
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    const { data: ownerData, isLoading: ownerLoading, error: ownerError, triggerFetch: fetchCourses } = usePaginatedCourse(
        page,
        10,
        searchTerm,
        institutionId
    );

    useEffect(() => {
        fetchCourses(); // Fetch data when the page or search term changes
    }, [page, searchTerm]);

    const handleSearch = (query: string) => {
        setSearchTerm(query);
    };

    const filteredCourses = ownerData?.documents || [];

    return (
        <SectionContainer title={"コース"} isLoading={ownerLoading} error={ownerError && String(ownerError) || ""}>
            <div className="flex gap-2 mb-4 w-full max-w-4xl justify-between items-center">
                <SearchBar
                    onSearch={handleSearch}
                    placeholder="Search courses..."
                />
                <div className="ml-4 text-center">
                    <AddCourseButton institutionId={institutionId}/>
                </div>
            </div>

            {!ownerLoading && ownerData && (
                <PaginatedContainer
                    documents={filteredCourses}
                    currentPage={page}
                    totalPages={ownerData.totalPages}
                    onPageChange={setPage}
                    RenderComponent={({ document }) => (
                        <Link key={document._id} to={`${document._id}`} className="page-fade-enter page-fade-enter-active">
                            <CourseDataElement course={document}/>
                        </Link>
                    )}
                />
            )}
        </SectionContainer>
    );
};

export default InstitutionCourseListPage;