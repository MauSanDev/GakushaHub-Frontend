import { useState, useEffect } from 'react';
import CourseBox from '../components/CourseBox';
import loadingIcon from '../assets/loading-icon.svg';
import { CourseData } from "../data/CourseData.ts";

interface CourseListPageProps {
    onCourseClick: (courseId: string) => void;
}

const CourseListPage: React.FC<CourseListPageProps> = ({ onCourseClick }) => {
    const [courses, setCourses] = useState<CourseData[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasMore, setHasMore] = useState(true);

    const fetchCourses = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/courses/paginated?page=${page}&limit=20`);
            if (!response.ok) {
                throw new Error('Failed to fetch courses.');
            }
            const data = await response.json();

            setCourses(prevCourses => {
                const newCourses = data.courses.filter(
                    (course: CourseData) => !prevCourses.some(prevCourse => prevCourse._id === course._id)
                );
                return [...prevCourses, ...newCourses];
            });
            setHasMore(data.page < data.totalPages);
            setError('');
        } catch (err) {
            setError(`Error fetching data: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [page]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore]);

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80 z-10 transition-opacity duration-500">
                    <img src={loadingIcon} alt="Loading..." className="w-16 h-16" />
                </div>
            )}

            {error && <p className="text-red-500">{error}</p>}

            <div className="mt-8 w-full max-w-4xl flex flex-col gap-6 text-left">
                {courses.length > 0 ? (
                    courses.map((course, index) => (
                        <div key={index} onClick={() => onCourseClick(course._id)}>
                            <CourseBox course={course} />
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">何もない</p>
                )}
            </div>
        </div>
    );
};

export default CourseListPage;