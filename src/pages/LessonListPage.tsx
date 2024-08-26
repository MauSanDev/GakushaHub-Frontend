import { useState, useEffect } from 'react';
import LessonBox from '../components/LessonBox';
import loadingIcon from '../assets/loading-icon.svg';
import { LessonData } from "../data/data-structures.tsx";

const LessonListPage: React.FC = () => {
    const [lessons, setLessons] = useState<LessonData[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasMore, setHasMore] = useState(true);

    const fetchLessons = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/lessons/paginated?page=${page}&limit=20`);
            if (!response.ok) {
                throw new Error('Failed to fetch lessons.');
            }
            const data = await response.json();

            setLessons(prevLessons => {
                // Evita agregar lecciones duplicadas
                const newLessons = data.lessons.filter(
                    (lesson: LessonData) => !prevLessons.some(prevLesson => prevLesson._id === lesson._id)
                );
                return [...prevLessons, ...newLessons];
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
        fetchLessons();
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
                {lessons.length > 0 ? (
                    lessons.map((lesson, index) => (
                        <LessonBox key={index} lesson={lesson} />
                    ))
                ) : (
                    <p className="text-center text-gray-500">No hay lecciones disponibles</p>
                )}
            </div>
        </div>
    );
};

export default LessonListPage;