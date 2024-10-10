import React, { useState, useEffect, useRef } from 'react';
import CourseDataElement from '../components/CourseDataElement.tsx';
import { CourseData } from "../data/CourseData.ts";
import { Link } from "react-router-dom";
import { useOwnerCourses } from "../hooks/coursesHooks/useOwnerCourses.ts";
import { usePublicCourses } from "../hooks/coursesHooks/usePublicCourses.ts";
import { useFollowedCourses } from "../hooks/coursesHooks/useFollowedCourses.ts";
import AddCourseButton from "../components/AddCourseButton.tsx";
import LocSpan from "../components/LocSpan.tsx";
import SectionContainer from "../components/ui/containers/SectionContainer.tsx"; 

const CourseListPage: React.FC = () => {
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [page, setPage] = useState(1);
    const [currentView, setCurrentView] = useState<'owner' | 'public' | 'followed'>('owner');
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

    const handleViewChange = (view: 'owner' | 'public' | 'followed') => {
        setCourses([]);
        setPage(1);
        setCurrentView(view);
    };

    return (
        <SectionContainer title={"勉強しましょう"} isLoading={isLoading} error={error?.message}>
            
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => handleViewChange('owner')}
                    className={`px-4 py-2 rounded lg:text-sm text-xs transition-all border ${currentView === 'owner' ? 'bg-blue-500 dark:bg-gray-600 text-white dark:text-white dark:border-gray-800 ' : 'text-gray-500 bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}`}>
                    <LocSpan textKey={"coursesListPage.myCourses"} />
                </button>
                <button
                    onClick={() => handleViewChange('public')}
                    className={`px-4 py-2 rounded lg:text-sm text-xs transition-all border ${currentView === 'public' ? 'bg-blue-500 dark:bg-gray-600 text-white dark:text-white dark:border-gray-800 ' : 'text-gray-500 bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}`}>
                    <LocSpan textKey={"coursesListPage.searchCourses"} />
                </button>
                <button
                    onClick={() => handleViewChange('followed')}
                    className={`px-4 py-2 rounded lg:text-sm text-xs transition-all border ${currentView === 'followed' ? 'bg-blue-500 dark:bg-gray-600 text-white dark:text-white dark:border-gray-800 ' : 'text-gray-500 bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}`}>
                    <LocSpan textKey={"coursesListPage.followingCourses"} />
                </button>
                <AddCourseButton />
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