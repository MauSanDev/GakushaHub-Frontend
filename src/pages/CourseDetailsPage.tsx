import { useState, useEffect } from 'react';
import LessonBox from '../components/LessonBox';
import loadingIcon from '../assets/loading-icon.svg';
import { CourseData, LessonData } from "../data/data-structures.tsx";

interface CourseDetailPageProps {
    courseId: string;
    onBack: () => void; // Recibe la función para volver a la lista de cursos
}

const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ courseId, onBack }) => {
    const [course, setCourse] = useState<CourseData | null>(null);
    const [lessons, setLessons] = useState<LessonData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchCourseDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/courses/${courseId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch course details.');
            }
            const data = await response.json();
            setCourse(data.course);
            setLessons(data.lessons);
            setError('');
        } catch (err) {
            setError(`Error fetching data: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseDetails();
    }, [courseId]);

    return (
        <div className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80 z-10 transition-opacity duration-500">
                    <img src={loadingIcon} alt="Loading..." className="w-16 h-16" />
                </div>
            )}

            {error && <p className="text-red-500">{error}</p>}

            {course && (
                <div className="mt-8 w-full max-w-4xl flex flex-col gap-6 text-left">
                    <h2 className="text-2xl font-bold mb-4 text-blue-500">{course.name}</h2>
                    <p className="text-gray-700 mb-4">{course.description}</p>

                    {lessons.length > 0 ?

                        (
                            lessons.map((lesson, index) => (
                                <LessonBox key={index} lesson={lesson} />
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No hay lecciones disponibles para este curso</p>
                        )}

                    <button
                        className="mt-4 text-blue-500 hover:underline"
                        onClick={onBack}
                    >
                        Volver a la lista de cursos
                    </button>
                </div>
            )}
        </div>
    );
};

export default CourseDetailPage;