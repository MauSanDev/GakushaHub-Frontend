import React, { useState, useEffect, useRef } from 'react';
import LessonBox from '../components/LessonBox';
import { CourseData, LessonData } from "../data/CourseData.ts";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { usePaginatedCourseLessons } from '../hooks/usePaginatedCourseLessons';
import LoadingScreen from "../components/LoadingScreen";

const CourseDetailPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [page, setPage] = useState(1);
    const [allLessons, setAllLessons] = useState<LessonData[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, error } = usePaginatedCourseLessons(courseId || '', page, 10);

    const course = data?.course as CourseData | null;

    useEffect(() => {
        if (data) {
            setAllLessons((prev) => [...prev, ...data.documents]);
        }
    }, [data]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollContainer = scrollContainerRef.current;
            if (scrollContainer) {
                const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
                if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading && page < (data?.totalPages ?? 1)) {
                    setPage((prevPage) => prevPage + 1);
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
    }, [isLoading, page, data]);

    if (isLoading && page === 1) {
        return (<LoadingScreen isLoading={isLoading} />);
    }

    if (error) {
        return <div className="text-red-500 text-center">{String(error)}</div>;
    }

    return (
        <div ref={scrollContainerRef} className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">
            <div className="flex items-center w-full max-w-4xl mt-8 mb-2">
                <Link
                    to="/courses"
                    className="bg-blue-500 text-white p-2 rounded-full shadow hover:bg-blue-600 mr-4"
                >
                    <FaArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-4xl font-bold text-gray-800 capitalize">
                    {course?.name || "Course"}
                </h1>
            </div>

            <h3 className="text-gray-500 text-left w-full max-w-4xl mb-6 ml-10">
                {course?.description}
            </h3>

            <div className="w-full max-w-4xl flex flex-col gap-6 text-left">
                {allLessons.length > 0 ? (
                    allLessons.map((lesson) => (
                        <LessonBox
                            key={lesson._id}
                            lesson={lesson}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500">何もない</p>
                )}
            </div>

            {isLoading && page > 1 && <LoadingScreen isLoading={isLoading} />}  {/* Loading spinner for subsequent pages */}
        </div>
    );
};

export default CourseDetailPage;