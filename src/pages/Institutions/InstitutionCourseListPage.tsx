import React, { useState, useEffect } from 'react';
import CourseDataElement from '../../components/CourseDataElement.tsx';
import { Link, useParams } from "react-router-dom";
import AddCourseButton from "../../components/AddCourseButton.tsx";
import SectionContainer from "../../components/ui/containers/SectionContainer.tsx";
import PaginatedContainer from '../../components/ui/containers/PaginatedContainer.tsx';
import SearchBar from "../../components/ui/inputs/SearchBar.tsx";
import { useInstitutionCourses } from "../../hooks/newHooks/Courses/useInstitutionCourses.ts";

const InstitutionCourseListPage: React.FC = () => {
    const { institutionId } = useParams<{ institutionId: string }>();
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    const { data: coursesData, isLoading: coursesLoading, fetchCourses } = useInstitutionCourses(page, 20, searchTerm, institutionId || '');

    useEffect(() => {
        fetchCourses();
    }, [page, searchTerm, institutionId]);

    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    const handleSearch = (query: string) => {
        setSearchTerm(query);
    };

    const filteredCourses = coursesData?.documents || [];

    return (
        <SectionContainer title={"コース"} isLoading={coursesLoading}>
            <div className="flex gap-2 mb-4 w-full max-w-4xl justify-between items-center">
                <SearchBar
                    onSearch={handleSearch}
                    placeholder="searchPlaceholder"
                />
                <div className="ml-4 text-center">
                    <AddCourseButton institutionId={institutionId}/>
                </div>
            </div>

            {!coursesLoading && coursesData && (
                <PaginatedContainer
                    documents={filteredCourses}
                    currentPage={page}
                    totalPages={coursesData.totalPages}
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