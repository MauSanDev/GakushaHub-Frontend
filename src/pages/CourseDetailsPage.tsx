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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourseDetails = async () => {
            setLoading(true);
            setError('');

            try {
                // Define los parámetros de paginación
                const page = 1; // Puedes ajustar esto según sea necesario
                const limit = 10; // Puedes ajustar esto según sea necesario

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
            } catch {
                console.log("nop")
                // setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseId]);

    if (loading) {
        return <img src={loadingIcon} alt="Loading" />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <button onClick={onBack}>Back to Courses</button>
            <h1>{course?.name}</h1>
            {lessons.map((lesson) => (
                <LessonBox key={lesson._id} lesson={lesson} />
            ))}
        </div>
    );
};

export default CourseDetailPage;