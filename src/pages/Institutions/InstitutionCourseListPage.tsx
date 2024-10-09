import React, { useState, useEffect, useRef } from 'react';
import CourseBox from '../../components/CourseBox';
import { CourseData } from "../../data/CourseData.ts";
import LoadingScreen from "../../components/LoadingScreen";
import { Link } from "react-router-dom";
import { useOwnerCourses } from "../../hooks/coursesHooks/useOwnerCourses.ts";
import AddCourseButton from "../../components/AddCourseButton.tsx";

const InstitutionCourseListPage: React.FC = () => {
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCourses, setFilteredCourses] = useState<CourseData[]>([]);
    const [page, setPage] = useState(1);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { data: ownerData, isLoading: ownerLoading, error: ownerError } = useOwnerCourses(page, 99);

    const data = ownerData;
    const isLoading = ownerLoading;
    const error = ownerError;

    const hasMore = data ? page < (data.totalPages ?? 1) : false;

    // Actualiza la lista de cursos cuando se recibe nueva data
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

            <div className="flex gap-2 mb-4 w-full max-w-4xl justify-between items-center">
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="flex-grow px-4 py-2 rounded lg:text-sm text-xs border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                />
                <div className="ml-4 text-center">
                    <AddCourseButton />
                </div>
            </div>

            <div className="w-full max-w-4xl flex flex-col gap-6 text-left pb-24">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course, index) => (
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

export default InstitutionCourseListPage;