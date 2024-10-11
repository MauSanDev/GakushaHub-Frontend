import React, { useState, useEffect, useRef } from 'react';
import CourseDataElement from '../components/CourseDataElement.tsx';
import { CourseData } from "../data/CourseData.ts";
import { Link } from "react-router-dom";
import { useOwnerCourses } from "../hooks/coursesHooks/useOwnerCourses.ts";
import { usePublicCourses } from "../hooks/coursesHooks/usePublicCourses.ts";
import { useFollowedCourses } from "../hooks/coursesHooks/useFollowedCourses.ts";
import AddCourseButton from "../components/AddCourseButton.tsx";
import SectionContainer from "../components/ui/containers/SectionContainer.tsx";
import Tabs from "../components/ui/toggles/Tabs.tsx";

const CourseListPage: React.FC = () => {
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [page, setPage] = useState(1);
    const [currentView, setCurrentView] = useState<string>('owner');
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { data: ownerData, isLoading: ownerLoading, error: ownerError } = useOwnerCourses(page, 99);
    const { data: publicData, isLoading: publicLoading, error: publicError } = usePublicCourses(page, 20);
    const { data: followedData, isLoading: followedLoading, error: followedError } = useFollowedCourses(page, 20);

    const data = currentView === 'owner' ? ownerData : currentView === 'public' ? publicData : followedData;
    const isLoading = currentView === 'owner' ? ownerLoading : currentView === 'public' ? publicLoading : followedLoading;
    const error = currentView === 'owner' ? ownerError : currentView === 'public' ? publicError : followedError;

    const hasMore = data ? page < (data.totalPages ?? 1) : false;

    useEffect(() => {
        if (data) {
            setCourses(prevCourses => {
                const newCourses = data.documents.filter(newCourse =>
                    !prevCourses.some(course => course._id === newCourse._id)
                );
                return [...prevCourses, ...newCourses];
            });
        }
    }, [data]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollContainer = scrollContainerRef.current;
            if (scrollContainer) {
                const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
                if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore) {
                    setPage(prevPage => prevPage + 1);
                }
            }
        };

        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, [hasMore]);

    const handleViewChange = (view: string) => {
        setCourses([]);
        setPage(1);
        setCurrentView(view);
    };

    const tabs = [
        { label: "coursesListPage.myCourses", view: 'owner' },
        { label: "coursesListPage.searchCourses", view: 'public' },
        { label: "coursesListPage.followingCourses", view: 'followed' }
    ];

    return (
        <SectionContainer title={"勉強しましょう"} isLoading={isLoading} error={error?.message}>
            <div className="flex gap-2 mb-4">
                <Tabs tabs={tabs} onTabChange={handleViewChange} currentTab={currentView}/>
                <AddCourseButton/>
            </div>
            
                <div className="w-full max-w-4xl flex flex-col gap-4 text-left pb-24">
                    {courses.length > 0 ? (
                        courses.map((course, index) => (
                            <Link key={index} to={`${course._id}`} className="page-fade-enter page-fade-enter-active">
                                <CourseDataElement course={course}/>
                            </Link>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">何もない</p>
                    )}
                </div>
        </SectionContainer>
);
};

export default CourseListPage;