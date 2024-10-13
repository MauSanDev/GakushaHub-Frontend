import React, { useState, useEffect } from 'react';
import CourseDataElement from '../components/CourseDataElement.tsx';
import { Link } from "react-router-dom";
import AddCourseButton from "../components/AddCourseButton.tsx";
import SectionContainer from "../components/ui/containers/SectionContainer.tsx";
import Tabs from "../components/ui/toggles/Tabs.tsx";
import { FaBook, FaBookmark, FaSearch } from "react-icons/fa";
import PaginatedContainer from "../components/ui/containers/PaginatedContainer.tsx";
import { useMyCourses } from "../hooks/newHooks/Courses/useMyCourses.ts"; // Importamos el nuevo hook

const CourseListPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [currentView, setCurrentView] = useState<string>('owner');

    const { data, isLoading, mutate: fetchCourses } = useMyCourses(page, 20, );

    useEffect(() => {
        fetchCourses();
    }, [page]);

    const handleViewChange = (view: string) => {
        setPage(1);
        setCurrentView(view);
    };

    const tabs = [
        { label: "coursesListPage.myCourses", view: 'owner', icon: <FaBook /> },
        { label: "coursesListPage.searchCourses", view: 'public', icon: <FaSearch /> },
        { label: "coursesListPage.followingCourses", view: 'followed', icon: <FaBookmark /> }
    ];

    return (
        <SectionContainer title={"勉強しましょう"} isLoading={isLoading}>
            <div className="flex flex-wrap gap-2 mb-2">
                <Tabs tabs={tabs} onTabChange={handleViewChange} currentTab={currentView} />
                <AddCourseButton />
            </div>

            {!isLoading && data && (
                <PaginatedContainer
                    documents={data.documents}
                    currentPage={page}
                    totalPages={data.totalPages}
                    onPageChange={setPage}
                    RenderComponent={({ document }) => (
                        <Link to={`${document._id}`} className="page-fade-enter page-fade-enter-active">
                            <CourseDataElement course={document} />
                        </Link>
                    )}
                />
            )}
        </SectionContainer>
    );
};

export default CourseListPage;