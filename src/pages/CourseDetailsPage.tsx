import React, { useState, useEffect, useRef } from 'react';
import LessonBox from '../components/LessonBox';
import { CourseData, LessonData } from "../data/CourseData.ts";
import {
    FaArrowLeft,
    FaBookOpen,
    FaFileAlt,
    FaBook,
    FaBookReader,
    FaCog,
    FaToggleOn,
    FaToggleOff,
    FaLink,
    FaBookmark,
    FaCrown
} from "react-icons/fa";
import {Link, useNavigate, useParams} from "react-router-dom";
import { usePaginatedCourseLessons } from '../hooks/usePaginatedCourseLessons';
import LoadingScreen from "../components/LoadingScreen";
import DeleteButton from '../components/DeleteButton';
import {useAuth} from "../context/AuthContext.tsx";

const CourseDetailPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [page, setPage] = useState(1);
    const [allLessons, setAllLessons] = useState<LessonData[]>([]);
    const [showKanji, setShowKanji] = useState(true);
    const [showWord, setShowWord] = useState(true);
    const [showGrammar, setShowGrammar] = useState(true);
    const [showReadings, setShowReadings] = useState(true); // Nuevo estado para Readings
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showConfig, setShowConfig] = useState(false);
    const [isPublic, setIsPublic] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const { data, isLoading, error } = usePaginatedCourseLessons(courseId || '', page, 10);
    const { userData } = useAuth();
    const navigate = useNavigate();
    const [selectedLesson, setSelectedLesson] = useState<LessonData>();

    const course = data?.course as CourseData;
    
    
    useEffect(() => {
        // if (!userData || userData._id !== course?.creatorId) {
        //     navigate('/');
        // }
    }, [userData, course, navigate]);


    const handleLessonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLesson(allLessons.find((x) => x._id === e.target.value));
    };
    
    const toggleFollow = () => {
        setIsFollowing(!isFollowing);
    };
    
    useEffect(() => {
        setIsOwner(userData?._id == data?.course.creatorId._id )
    }, [courseId, data]);

    
    useEffect(() => {
        setAllLessons([]);
    }, [courseId]);

    useEffect(() => {
        if (data) {
            const uniqueLessons = data.documents.filter(
                (newLesson) => !allLessons.some((lesson) => lesson._id === newLesson._id)
            );
            const newLessons = [...allLessons, ...uniqueLessons];
            setAllLessons(newLessons);
            setSelectedLesson(newLessons[0])
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
    
    
    const handleToggleChange = () => {
        setIsPublic(!isPublic);
    };

    const handleToggle = (toggleType: 'kanji' | 'word' | 'grammar' | 'readings') => {
        let toggles = { kanji: showKanji, word: showWord, grammar: showGrammar, readings: showReadings };

        if (toggleType === 'kanji') toggles.kanji = !showKanji;
        if (toggleType === 'word') toggles.word = !showWord;
        if (toggleType === 'grammar') toggles.grammar = !showGrammar;
        if (toggleType === 'readings') toggles.readings = !showReadings;

        if (!toggles.kanji && !toggles.word && !toggles.grammar && !toggles.readings) {
            setShowKanji(true);
            setShowWord(true);
            setShowGrammar(true);
            setShowReadings(true);
        } else {
            setShowKanji(toggles.kanji);
            setShowWord(toggles.word);
            setShowGrammar(toggles.grammar);
            setShowReadings(toggles.readings);
        }
    };

    if (isLoading && page === 1) {
        return (<LoadingScreen isLoading={isLoading} />);
    }

    if (error) {
        return <div className="text-red-500 text-center">{String(error)}</div>;
    }

    return (
        <div ref={scrollContainerRef}
             className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">
            <div
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-4xl mt-8 mb-2 px-4">
                <div className="flex items-center mb-4 sm:mb-0">
                    <Link
                        to="/courses"
                        className="bg-blue-500 dark:bg-gray-700 text-white p-2 rounded-full shadow hover:bg-blue-600 dark:hover:bg-gray-600 mr-4"
                    >
                        <FaArrowLeft className="w-5 h-5"/>
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 capitalize">
                        {course?.name || "Course"}
                    </h1>
                </div>
            </div>
            <div
                className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between w-full max-w-4xl mb-2 px-4">
                <div className="flex items-center gap-4 overflow-x-auto w-full sm:w-auto flex-grow"><p
                    className="inline-flex items-center text-left text-xs text-gray-500 w-full sm:w-auto flex-grow">
                    <FaCrown className="mr-1"/>
                    Created by {course.creatorId?.name ?? "???"} - {new Date(course.createdAt).toLocaleDateString()}
                </p>

                    {!isOwner && (
                        <button
                            onClick={toggleFollow}
                            className={`flex text-xs px-3 items-center p-1 rounded-full shadow transition-colors duration-300 ${
                                isFollowing ? 'bg-red-500 text-white font-bold' : 'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                            }`}
                        >
                            <FaBookmark className={`mr-1 ${isFollowing ? 'text-white' : 'text-gray-500'}`}/>
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto mt-4 sm:mt-0 lg:pl-3">
                    <div className="relative">
                        <select
                            value={selectedLesson?._id}
                            onChange={handleLessonChange}
                            className="pl-2 pr-2 py-1.5 border rounded text-sm dark:bg-gray-900 dark:text-white dark:border-gray-700 w-full lg:w-[200px] truncate  flex-grow"
                        >
                            {allLessons.map(lesson => (
                                <option key={lesson._id} value={lesson._id} className="truncate">
                                    {lesson.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="relative lg:w-full mb-2">
                        <div className="lg:w-full text-center -mb-2">
                            <span
                                className="text-xs text-gray-400 dark:text-gray-500 bg-white dark:bg-black p-1">Toggle</span>
                        </div>

                        <div
                            className="flex items-center gap-1.5 p-1.5 border border-gray-300 dark:border-gray-700 rounded-lg">
                            <button
                                onClick={() => handleToggle('kanji')}
                                className={`p-1 rounded transition-colors duration-300 ${showKanji ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 dark:bg-gray-800 text-blue-400 hover:bg-gray-300'}`}
                                title="Kanji Decks"
                            >
                                <FaBookOpen className={`text-sm ${showKanji ? 'text-white' : 'text-blue-400'}`}/>
                            </button>
                            <button
                                onClick={() => handleToggle('word')}
                                className={`p-1 rounded transition-colors duration-300 ${showWord ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-200 dark:bg-gray-800 text-red-500 hover:bg-gray-300'}`}
                                title="Word Decks"
                            >
                                <FaFileAlt className={`text-sm ${showWord ? 'text-white' : 'text-red-500'}`}/>
                            </button>
                            <button
                                onClick={() => handleToggle('grammar')}
                                className={`p-1 rounded transition-colors duration-300 ${showGrammar ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-200 dark:bg-gray-800 text-green-500 hover:bg-gray-300'}`}
                                title="Grammar Decks"
                            >
                                <FaBook className={`text-sm ${showGrammar ? 'text-white' : 'text-green-500'}`}/>
                            </button>
                            <button
                                onClick={() => handleToggle('readings')}
                                className={`p-1 rounded transition-colors duration-300 ${showReadings ? 'bg-purple-500 text-white hover:bg-purple-600' : 'bg-gray-200 dark:bg-gray-800 text-purple-500 hover:bg-gray-300'}`}
                                title="Reading Decks"
                            >
                                <FaBookReader className={`text-sm ${showReadings ? 'text-white' : 'text-purple-500'}`}/>
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            className="text-white bg-blue-500 dark:bg-gray-700 hover:bg-blue-600 dark:hover:bg-gray-600 p-1 rounded gap-6"
                            onClick={() => setShowConfig(!showConfig)}
                        >
                            <FaCog/>
                        </button>
                        {showConfig && (
                            <div
                                className="absolute right-0 w-56 p-4 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-md shadow-lg z-50"
                            >
                                {isOwner ? (
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs text-gray-700">Delete Course</label>
                                            <DeleteButton
                                                creatorId={course?.creatorId._id || ''}
                                                elementId={courseId || ''}
                                                elementType="course"
                                                deleteRelations={true}
                                                redirectTo="/courses"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            <label className="text-xs text-gray-700">Is Public</label>
                                            <div className="relative inline-block w-10 select-none">
                                                <input
                                                    type="checkbox"
                                                    id="toggle"
                                                    checked={isPublic}
                                                    onChange={handleToggleChange}
                                                    className="toggle-checkbox sr-only"
                                                />
                                                <label
                                                    htmlFor="toggle"
                                                    className={`block overflow-hidden h-6 rounded-full cursor-pointer`}
                                                >
                                                    {isPublic ? (
                                                        <FaToggleOn
                                                            className="text-green-500 text-2xl absolute inset-0 m-auto"/>
                                                    ) : (
                                                        <FaToggleOff
                                                            className="text-gray-500 text-2xl absolute inset-0 m-auto"/>
                                                    )}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ) : ("")}

                                {isPublic && (
                                    <div className="flex items-center justify-between mt-2">
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(window.location.href);
                                            }}
                                            className="text-xs text-blue-400 dark:text-white flex items-center transition-transform duration-200 transform active:scale-95"
                                        >
                                            <FaLink className="mr-1"/>
                                            Copy Course Link
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>


            <h3 className="text-gray-500 text-left w-full max-w-4xl ml-10">
                {course?.description}
            </h3>

            <div className="w-full max-w-4xl flex flex-col gap-6 text-left pb-24">

                {selectedLesson ? (
                    <LessonBox
                        key={selectedLesson._id}
                        lesson={selectedLesson}
                        showKanji={showKanji}
                        showWord={showWord}
                        showGrammar={showGrammar}
                        showReadings={showReadings}
                        owner={course}
                    />
                ) : (
                    <p className="text-center text-gray-500">何もない</p>
                )}
            </div>

            {isLoading && page > 1 &&
                <LoadingScreen isLoading={isLoading}/>}
        </div>
    );
};

export default CourseDetailPage;