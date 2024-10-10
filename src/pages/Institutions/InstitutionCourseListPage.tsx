import React, { useState, useEffect, useRef } from 'react';
import CourseDataElement from '../../components/CourseDataElement.tsx';
import { CourseData } from "../../data/CourseData.ts";
import {Link, useParams} from "react-router-dom";
import AddCourseButton from "../../components/AddCourseButton.tsx";
import { usePaginatedCourse } from "../../hooks/usePaginatedCourse.ts";
import SectionContainer from "../../components/ui/containers/SectionContainer.tsx";

const InstitutionCourseListPage: React.FC = () => {
    const { institutionId } = useParams<{ institutionId: string; }>();
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCourses, setFilteredCourses] = useState<CourseData[]>([]);
    const [page, setPage] = useState(1);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { data: ownerData, isLoading: ownerLoading, error: ownerError } = usePaginatedCourse(page, 99, institutionId);

    const data = ownerData;
    const isLoading = ownerLoading;
    const error = ownerError;

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

    // Filtra los cursos según el término de búsqueda
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredCourses(courses); // Si no hay término de búsqueda, muestra todos los cursos
        } else {
            setFilteredCourses(
                courses.filter(course =>
                    course.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [searchTerm, courses]);

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

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (

        <SectionContainer title={"コース"} isLoading={isLoading} error={error && String(error) || ""}>
            <div className="flex gap-2 mb-4 w-full max-w-4xl justify-between items-center">
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="flex-grow px-4 py-2 rounded lg:text-sm text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                />
                <div className="ml-4 text-center">
                    <AddCourseButton institutionId={institutionId}/>
                </div>
            </div>

            <div className="w-full max-w-4xl flex flex-col gap-6 text-left pb-24">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course, index) => (
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

export default InstitutionCourseListPage;