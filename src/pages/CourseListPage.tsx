import React, { useState, useEffect } from 'react';
import CourseDataElement from '../components/CourseDataElement.tsx';
import { Link } from "react-router-dom";
import AddCourseButton from "../components/AddCourseButton.tsx";
import SectionContainer from "../components/ui/containers/SectionContainer.tsx";
import Tabs from "../components/ui/toggles/Tabs.tsx";
import { FaBook, FaBookmark, FaSearch } from "react-icons/fa";
import PaginatedContainer from "../components/ui/containers/PaginatedContainer.tsx";
import { useMyCourses } from "../hooks/newHooks/Courses/useMyCourses.ts";
import { usePublicCourses } from "../hooks/newHooks/Courses/usePublicCourses.ts";

const CourseListPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [currentView, setCurrentView] = useState<string>('owner');

    const { data: myCoursesData, isLoading: myCoursesLoading, mutate: fetchMyCourses } = useMyCourses(page, 20);
    const { data: publicCoursesData, isLoading: publicCoursesLoading, mutate: fetchPublicCourses } = usePublicCourses(page, 20);

    const data = currentView === 'owner' ? myCoursesData : publicCoursesData;
    const isLoading = currentView === 'owner' ? myCoursesLoading : publicCoursesLoading;
    const fetchCourses = currentView === 'owner' ? fetchMyCourses : fetchPublicCourses;

    useEffect(() => {
        fetchCourses();
    }, [page, currentView]);

    const handleViewChange = (view: string) => {
        setPage(1); // Reseteamos la paginación al cambiar de vista
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