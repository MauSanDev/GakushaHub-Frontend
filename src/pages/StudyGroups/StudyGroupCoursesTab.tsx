import React, { useState, useEffect, useRef } from 'react';
import CourseDataElement from '../../components/CourseDataElement.tsx';
import { CourseData } from "../../data/CourseData.ts";
import LoadingScreen from "../../components/LoadingScreen";
import { Link } from "react-router-dom";
import { StudyGroupData } from '../../data/Institutions/StudyGroupData'; 
import { ApiClient } from '../../services/ApiClient'; 

interface StudyGroupCoursesTabProps {
    studyGroup: StudyGroupData;  
}

const StudyGroupCoursesTab: React.FC<StudyGroupCoursesTabProps> = ({ studyGroup }) => {
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [page, setPage] = useState(1);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(false);
    
    const fetchCourses = async (page: number) => {
        setIsLoading(true);
        try {
            const response = await ApiClient.get(`/api/courses/paginated?page=${page}&ids=${studyGroup.courseIds.join(',')}`);
            setCourses(prevCourses => [...prevCourses, ...response.data.documents]);
            setHasMore(page < response.data.totalPages);
            setIsLoading(false);
        } catch (error) {
            setError('Error fetching courses.');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses(page);
    }, [page, studyGroup.courseIds]);

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
        <div ref={scrollContainerRef} className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">
            <LoadingScreen isLoading={isLoading} />
            {error && <p className="text-red-500">{error}</p>}
            <div className="w-full max-w-4xl flex flex-col gap-6 text-left pb-24">
                {courses.length > 0 ? (
                    courses.map((course, index) => (
                        <Link key={index} to={`/courses/${course._id}`} className="page-fade-enter page-fade-enter-active">
                            <CourseDataElement course={course} />
                        </Link>
                    ))
                ) : (
                    !isLoading && <p className="text-center text-gray-500">No courses available</p>
                )}
            </div>
        </div>
    );
};

export default StudyGroupCoursesTab;