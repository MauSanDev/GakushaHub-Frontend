import React, { useState, useEffect, useRef } from 'react';
import LessonBox from '../components/LessonBox';
import { CourseData, LessonData } from "../data/CourseData.ts";
import { FaArrowLeft, FaSearch, FaBookOpen, FaFileAlt, FaBook } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { usePaginatedCourseLessons } from '../hooks/usePaginatedCourseLessons';
import LoadingScreen from "../components/LoadingScreen";
import DeleteButton from '../components/DeleteButton';

const CourseDetailPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [page, setPage] = useState(1);
    const [allLessons, setAllLessons] = useState<LessonData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showKanji, setShowKanji] = useState(true);
    const [showWord, setShowWord] = useState(true);
    const [showGrammar, setShowGrammar] = useState(true);
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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleToggle = (toggleType: 'kanji' | 'word' | 'grammar') => {
        let toggles = { kanji: showKanji, word: showWord, grammar: showGrammar };

        // Actualizar el estado del toggle correspondiente
        if (toggleType === 'kanji') toggles.kanji = !showKanji;
        if (toggleType === 'word') toggles.word = !showWord;
        if (toggleType === 'grammar') toggles.grammar = !showGrammar;

        // Si los tres toggles están desactivados después de este cambio, activar los tres
        if (!toggles.kanji && !toggles.word && !toggles.grammar) {
            setShowKanji(true);
            setShowWord(true);
            setShowGrammar(true);
        } else {
            // Aplicar los cambios normales
            setShowKanji(toggles.kanji);
            setShowWord(toggles.word);
            setShowGrammar(toggles.grammar);
        }
    };

    const filteredLessons = allLessons.filter(lesson =>
        (
            (showKanji && lesson.kanjiDecks.length > 0) ||
            (showWord && lesson.wordDecks.length > 0) ||
            (showGrammar && lesson.grammarDecks.length > 0)
        ) &&
        (
            lesson.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lesson.kanjiDecks.some(deck => deck.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            lesson.wordDecks.some(deck => deck.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            lesson.grammarDecks.some(deck => deck.name.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    );

    if (isLoading && page === 1) {
        return (<LoadingScreen isLoading={isLoading} />);
    }

    if (error) {
        return <div className="text-red-500 text-center">{String(error)}</div>;
    }

    return (
        <div ref={scrollContainerRef} className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">
            <div className="flex items-center justify-between w-full max-w-4xl mt-8 mb-2">
                <div className="flex items-center">
                    <Link
                        to="/courses"
                        className="bg-blue-500 text-white p-2 rounded-full shadow hover:bg-blue-600 mr-4"
                    >
                        <FaArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800 capitalize">
                        {course?.name || "Course"}
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <FaSearch className="absolute left-2 top-2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search Lessons"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="pl-8 pr-2 py-1.5 border rounded text-sm"
                        />
                    </div>
                    <div className="relative flex items-center gap-1.5 p-1.5 border border-gray-300 rounded-lg">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white px-1 text-xs text-gray-600">
                            Toggle
                        </div>
                        <button
                            onClick={() => handleToggle('kanji')}
                            className={`p-1 rounded transition-colors duration-300 ${showKanji ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-blue-500 hover:bg-gray-300'}`}
                            title="Kanji Decks"
                        >
                            <FaBookOpen className={`text-sm ${showKanji ? 'text-white' : 'text-blue-500'}`} />
                        </button>
                        <button
                            onClick={() => handleToggle('word')}
                            className={`p-1 rounded transition-colors duration-300 ${showWord ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-200 text-red-500 hover:bg-gray-300'}`}
                            title="Word Decks"
                        >
                            <FaFileAlt className={`text-sm ${showWord ? 'text-white' : 'text-red-500'}`} />
                        </button>
                        <button
                            onClick={() => handleToggle('grammar')}
                            className={`p-1 rounded transition-colors duration-300 ${showGrammar ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-200 text-green-500 hover:bg-gray-300'}`}
                            title="Grammar Decks"
                        >
                            <FaBook className={`text-sm ${showGrammar ? 'text-white' : 'text-green-500'}`} />
                        </button>
                    </div>

                    <DeleteButton
                        elementId={courseId || ''}
                        elementType="course"
                        deleteRelations={true}
                        redirectTo="/courses"
                    />
                </div>
            </div>

            <h3 className="text-gray-500 text-left w-full max-w-4xl mb-6 ml-10">
                {course?.description}
            </h3>

            <div className="w-full max-w-4xl flex flex-col gap-6 text-left">
                {filteredLessons.length > 0 ? (
                    filteredLessons.map((lesson) => (
                        <LessonBox
                            key={lesson._id}
                            lesson={lesson}
                            showKanji={showKanji}
                            showWord={showWord}
                            showGrammar={showGrammar}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500">何もない</p>
                )}
            </div>

            {isLoading && page > 1 &&
                <LoadingScreen isLoading={isLoading}/>} {/* Loading spinner for subsequent pages */}
        </div>
    );
};

export default CourseDetailPage;