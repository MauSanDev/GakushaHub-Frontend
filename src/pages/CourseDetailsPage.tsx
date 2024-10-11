import React, { useState, useEffect, useRef } from 'react';
import LessonDataElement from '../components/LessonDataElement.tsx';
import {
    FaBookOpen,
    FaFileAlt,
    FaBook,
    FaCog,
    FaToggleOn,
    FaToggleOff,
    FaLink,
    FaEye,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useCourseById } from '../hooks/coursesHooks/useCourseById';
import { useLessonById } from '../hooks/coursesHooks/useLessonById';
import LoadingScreen from "../components/LoadingScreen";
import DeleteButton from '../components/DeleteButton';
import { useAuth } from "../context/AuthContext.tsx";
import TooltipButton from "../components/TooltipButton.tsx";
import { useUpdateCourse } from '../hooks/updateHooks/useUpdateCourse.ts';
import FollowButton from '../components/FollowButton';
import AddLessonButton from "../components/AddLessonButton.tsx";
import LocSpan from "../components/LocSpan.tsx";
import {useTranslation} from "react-i18next";
import CreatorLabel from "../components/ui/text/CreatorLabel.tsx";
import BackButton from "../components/ui/buttons/BackButton.tsx";
import {CollectionTypes} from "../data/CollectionTypes.tsx";
import Editable from "../components/ui/text/Editable.tsx";

const CourseDetailPage: React.FC = () => {
    const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>();
    const [selectedLesson, setSelectedLesson] = useState<string | null>(lessonId || null);
    const { data: course, error: courseError, isLoading: courseLoading } = useCourseById(courseId || '');
    const { data: lesson, isLoading: lessonLoading, refetch: fetchLesson } = useLessonById(selectedLesson || '');
    const [showKanji, setShowKanji] = useState(true);
    const [showWord, setShowWord] = useState(true);
    const [showGrammar, setShowGrammar] = useState(true);
    const [showReadings, setShowReadings] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isPublic, setIsPublic] = useState(false);
    const [isPublicInitial, setIsPublicInitial] = useState(false);
    const { userData } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const updateCourse = useUpdateCourse(courseId || '');

    useEffect(() => {
        if (course && userData) {

            if(userData._id != course.creatorId._id && !course.isPublic && !userData.followedCourses.includes(course._id))
            {
                if (course.institutionId)
                {
                    navigate(`/institution/${course.institutionId}/courses`);
                }
                else
                {
                    navigate(`/courses`);
                }
                return;
            }

            setIsOwner(course.creatorId._id === userData._id);
            setIsPublic(course.isPublic || false);
            setIsPublicInitial(course.isPublic || false);

            if (!lessonId && course.lessons.length > 0) {
                const firstLessonId = course.lessons[0]._id;
                setSelectedLesson(firstLessonId);

                if (course.institutionId)
                {
                    navigate(`/institution/${course.institutionId}/courses/${courseId}/${firstLessonId}`); // TODO: Check for the roles?
                }
                else
                {
                    navigate(`/courses/${courseId}/${firstLessonId}`);
                }
            }
        }
    }, [course, userData, lessonId, courseId, navigate]);

    useEffect(() => {
        if (selectedLesson) {
            fetchLesson();
        }
    }, [selectedLesson, fetchLesson]);

    const handleLessonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lessonId = e.target.value;
        setSelectedLesson(lessonId);
        navigate(`/courses/${courseId}/${lessonId}`);
    };
    const handleToggleChange = () => {
        const newIsPublic = !isPublic;
        setIsPublic(newIsPublic);


        if (newIsPublic !== isPublicInitial) {
            updateCourse({ isPublic: newIsPublic });
        }
    };

    const handleToggle = (toggleType: 'kanji' | 'word' | 'grammar' | 'readings') => {
        const toggles = { kanji: showKanji, word: showWord, grammar: showGrammar, readings: showReadings };

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

    if (courseLoading) {
        return <LoadingScreen isLoading={courseLoading} />;
    }

    if (courseError) {
        return <div className="text-red-500 text-center">{String(courseError)}</div>;
    }

    if (!course) {
        return <div>No course found</div>;
    }

    const dropdownItems = [
        isOwner && (
            <div className="flex items-center justify-between">
                <label className="text-xs text-gray-500 dark:text-gray-300"><LocSpan textKey={"courseDetailsPage.deleteCourse"} /></label>
                <DeleteButton
                    creatorId={course?.creatorId._id || ''}
                    elementId={courseId || ''}
                    elementType={CollectionTypes.Course}
                    deleteRelations={true}
                    redirectTo="/courses"
                />
            </div>
        ),
        isOwner && (
            <div className="flex items-center justify-between mt-2">
                <label className="text-xs text-gray-500 dark:text-gray-300"><LocSpan textKey={"courseDetailsPage.isPublic"} /></label>
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
        ),
        isPublic && (
            <div className="flex items-center justify-between mt-2">
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                    }}
                    className="text-xs text-blue-400 dark:text-white flex items-center transition-transform duration-200 transform active:scale-95"
                >
                    <FaLink className="mr-1"/>
                    <LocSpan textKey={"courseDetailsPage.copyLink"} />
                </button>
            </div>
        )
    ];

    return (
        <div ref={scrollContainerRef}
             className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">
            <div
                className="lg:pl-0 pl-12 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-4xl mt-8 mb-2 px-4">
                <div className="flex items-start mb-4 sm:mb-0 w-full">
                    
                    <BackButton onClick={() => navigate(course.institutionId ? `/institution/${course.institutionId}/courses` : "/courses")}/>
                    
                    <Editable
                        initialValue={course.name}
                        collection={CollectionTypes.Course}
                        documentId={course._id || ''}
                        field="name"
                        className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 capitalize"
                        canEdit={true}
                        maxChar={40}
                    />
                    
                </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between w-full max-w-4xl mb-2 px-4">
                
                <Editable
                    initialValue={course.description}
                    collection={CollectionTypes.Course}
                    documentId={course._id || ''}
                    field="description"
                    className="text-gray-600 dark:text-gray-400 mt-2"
                    canEdit={true}
                    maxChar={400}
                    placeholder={"Add a Description..."}
                />
                
                <div className="flex items-center gap-4 overflow-x-auto w-full sm:w-auto flex-grow">
                    <CreatorLabel name={course.creatorId?.name} createdAt={course.createdAt} />

                    {!isOwner && (
                        <FollowButton courseId={courseId || ''} />
                    )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-auto mt-4 sm:mt-0 lg:pl-3">
                    <div className="relative">
                        <select
                            value={selectedLesson || ''}
                            onChange={handleLessonChange}
                            className="pl-2 pr-2 py-1.5 border rounded text-sm dark:bg-gray-900 dark:text-white dark:border-gray-700 w-[180px] lg:w-[220px] truncate  flex-grow"
                        >
                            {course?.lessons.map(lesson => (
                                <option key={lesson._id} value={lesson._id} className="truncate">
                                    {t("lesson")} : {lesson.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <AddLessonButton courseId={course._id} courseName={course.name}/>

                    <div className="relative lg:w-full mb-2">
                        <div className="lg:w-full text-center -mb-2">
                            <span
                                className="text-xs text-gray-400 dark:text-gray-500 bg-white dark:bg-black p-1"><LocSpan textKey={"toggle"} /></span>
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
                                className={`p-1 rounded transition-colors duration-300 ${showReadings ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-gray-200 dark:bg-gray-800 text-yellow-400 hover:bg-gray-300'}`}
                                title="Reading Decks"
                            >
                                <FaEye className={`text-sm ${showReadings ? 'text-white' : 'text-yellow-400'}`}/>
                            </button>
                        </div>
                    </div>

                    {(isOwner || isPublic) && (<div className="relative">
                        <TooltipButton
                            icon={<FaCog/>}
                            items={dropdownItems}
                        />
                    </div>)}
                </div>
            </div>

            <div className="w-full max-w-4xl flex flex-col gap-6 text-left pb-24">
                {lesson ? (
                    <LessonDataElement
                        key={lesson._id}
                        lesson={lesson}
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

            {lessonLoading && <LoadingScreen isLoading={lessonLoading}/>}
        </div>
    );
};

export default CourseDetailPage;