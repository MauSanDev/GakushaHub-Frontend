import React, { useState, useEffect, useRef } from 'react';
import CourseBox from '../components/CourseBox';
import { CourseData } from "../data/CourseData.ts";
import { usePaginatedCourse } from "../hooks/usePaginatedCourse.ts";
import LoadingScreen from "../components/LoadingScreen";
import { Link } from "react-router-dom";

const CourseListPage: React.FC = () => {
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [page, setPage] = useState(1);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, error } = usePaginatedCourse(page, 20);

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

    return (
        <div ref={scrollContainerRef}
             className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">

            <LoadingScreen isLoading={isLoading}/>

            {error && <p className="text-red-500">{String(error)}</p>}


            <div
                className="lg:pl-0 pl-16 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-4xl mt-8 lg:mb-2 px-4">
                <div className="flex items-start mb-4 sm:mb-0">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 capitalize">
                        勉強しましょう
                    </h1>
                </div>
            </div>

            <div className="w-full max-w-4xl flex flex-col gap-6 text-left pb-24">
                {courses.length > 0 ? (
                    courses.map((course, index) => (
                        <Link key={index} to={`${course._id}`} className="page-fade-enter page-fade-enter-active">
                            <CourseBox course={course}/>
                        </Link>
                    ))
                ) : (
                    <p className="text-center text-gray-500">何もない</p>
                )}
            </div>
        </div>
    );
};

export default CourseListPage;