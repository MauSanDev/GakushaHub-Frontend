import { useState, useEffect } from 'react';
import LessonBox from '../components/LessonBox';
import loadingIcon from '../assets/loading-icon.svg';
import { CourseData, LessonData } from "../data/data-structures.tsx";
import { FaArrowLeft } from "react-icons/fa";

interface CourseDetailPageProps {
    courseId: string;
    onBack: () => void; // Recibe la función para volver a la lista de cursos
}

const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ courseId, onBack }) => {
    const [course, setCourse] = useState<CourseData | null>(null);
    const [lessons, setLessons] = useState<LessonData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourseDetails = async () => {
            setLoading(true);
            setError('');

            try {
                const page = 1;
                const limit = 10;

                const response = await fetch(`http://localhost:3000/api/courses/${courseId}/lessons/paginated?page=${page}&limit=${limit}`);
                if (!response.ok) {
                    throw new Error('Error al obtener los datos del curso');
                }

                const data = await response.json();

                if (data.error) {
                    setError(data.error);
                } else {
                    setCourse(data.course);
                    setLessons(data.lessons);
                }
            } catch (error) {
                setError('Error al cargar los datos.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseId]);

    const handleUpdateLesson = (updatedLesson: LessonData) => {
        setLessons((prevLessons) =>
            prevLessons.map((lesson) =>
                lesson._id === updatedLesson._id ? updatedLesson : lesson
            )
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full w-full">
                <img src={loadingIcon} alt="Loading" className="w-16 h-16 animate-spin" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">
            <div className="flex items-center w-full max-w-4xl mt-8 mb-2">
                <button onClick={onBack}
                        className="bg-blue-500 text-white p-2 rounded-full shadow hover:bg-blue-600 mr-4">
                    <FaArrowLeft className="w-5 h-5"/>
                </button>
                <h1 className="text-4xl font-bold text-gray-800 capitalize">
                    {course?.name || "Course"}
                </h1>
            </div>

            <h3 className="text-gray-500 text-left w-full max-w-4xl mb-6 ml-10">
                {course?.description}
            </h3>
            
            <div className="w-full max-w-4xl flex flex-col gap-6 text-left">
                {lessons.length > 0 ? (
                    lessons.map((lesson) => (
                        <LessonBox
                            key={lesson._id}
                            lesson={lesson}
                            onUpdateLesson={handleUpdateLesson} // Pasamos la función de actualización
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500">No hay lecciones disponibles.</p>
                )}
            </div>
        </div>
    );
};

export default CourseDetailPage;