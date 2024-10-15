import React, { useEffect, useRef, useState } from 'react';
import LessonDataElement from '../components/LessonDataElement.tsx';
import { FaBook, FaBookOpen, FaCog, FaEye, FaFileAlt, FaLink, FaToggleOff, FaToggleOn } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import DeleteButton from '../components/DeleteButton';
import { useAuth } from "../context/AuthContext.tsx";
import TooltipButton from "../components/TooltipButton.tsx";
import FollowButton from '../components/FollowButton';
import AddLessonButton from "../components/AddLessonButton.tsx";
import LocSpan from "../components/LocSpan.tsx";
import { useTranslation } from "react-i18next";
import CreatorLabel from "../components/ui/text/CreatorLabel.tsx";
import BackButton from "../components/ui/buttons/BackButton.tsx";
import { CollectionTypes } from "../data/CollectionTypes.tsx";
import Editable from "../components/ui/text/Editable.tsx";
import { MembershipRole } from '../data/MembershipData.ts';
import { useCourses } from '../hooks/newHooks/Courses/useCourses';
import { useLessons } from '../hooks/newHooks/Courses/useLessons';
import DeckToggle from "../components/ui/toggles/DeckToggle.tsx";
import { useUpdateData } from "../hooks/updateHooks/useUpdateData.ts";

enum DeckType {
    Kanji = 'kanji',
    Word = 'word',
    Grammar = 'grammar',
    Readings = 'readings'
}

const CourseDetailPage: React.FC = () => {
    const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>();
    const [selectedLesson, setSelectedLesson] = useState<string | null>(lessonId || null);
    const { data: courseData, isLoading: courseLoading, fetchCourses } = useCourses([courseId || '']);
    const [lessonsIds, setLessonsIds] = useState<string[]>([]);
    const { data: lessonsData, isLoading: lessonsLoading, fetchLessons } = useLessons(lessonsIds);
    const [toggleState, setToggleState] = useState<Record<DeckType, boolean>>({
        [DeckType.Kanji]: true,
        [DeckType.Word]: true,
        [DeckType.Grammar]: true,
        [DeckType.Readings]: true
    });
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isPublic, setIsPublic] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { getRole } = useAuth();
    const { mutate: updateDocument } = useUpdateData<{ isPublic: boolean }>();

    const [role, setRole] = useState<MembershipRole>();


    useEffect(() => {
        fetchCourses();
        fetchLessons();
    }, [courseId, lessonId]);
    
    useEffect(() => {
        const fetchUserRole = async () => {
            const fetchedRole = await getRole(courseData?.[courseId || '']?.institutionId || "", courseData?.[courseId || '']?.creatorId || "");
            setRole(fetchedRole);
        };

        fetchUserRole();
    }, [courseData, getRole, courseId]);

    useEffect(() => {
        const course = courseData?.[courseId || ''];
        if (course && course.lessons) {
            setLessonsIds(course.lessons);
        }
    }, [courseData, courseId]);

    useEffect(() => {
        if (lessonsIds.length > 0) {
            fetchLessons();
        }
    }, [lessonsIds]);

    useEffect(() => {
        if (lessonsData && !selectedLesson) {
            const firstLessonId = Object.keys(lessonsData)[0];
            setSelectedLesson(firstLessonId);
            if (courseData?.[courseId || '']?.institutionId) {
                navigate(`/institution/${courseData?.[courseId || '']?.institutionId}/courses/${courseId}/${firstLessonId}`);
            } else {
                navigate(`/courses/${courseId}/${firstLessonId}`);
            }
        }
    }, [lessonsData, selectedLesson, courseData, courseId, navigate]);

    const handleLessonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lessonId = e.target.value;
        setSelectedLesson(lessonId);
        navigate(`/courses/${courseId}/${lessonId}`);
    };

    const handleToggleChange = () => {
        const newIsPublic = !isPublic;
        setIsPublic(newIsPublic);
        updateDocument({
            collection: 'Course',
            documentId: courseId || '',
            newData: { isPublic: newIsPublic }
        });
    };

    const isOwner = role === MembershipRole.Owner;

    const handleToggle = (deckType: DeckType) => {
        setToggleState((prevState) => {
            const newState = { ...prevState, [deckType]: !prevState[deckType] };
            const allToggledOff = Object.values(newState).every(state => !state);
            return allToggledOff
                ? { [DeckType.Kanji]: true, [DeckType.Word]: true, [DeckType.Grammar]: true, [DeckType.Readings]: true }
                : newState;
        });
    };

    if (courseLoading || lessonsLoading) {
        return <LoadingScreen isLoading={courseLoading || lessonsLoading} />;
    }

    const course = courseData?.[courseId || ''];
    const lesson = lessonsData?.[selectedLesson || ''];

    if (!course) {
        return <div>No course found</div>;
    }

    const dropdownItems = [
        isOwner && (
            <div className="flex items-center justify-between">
                <label className="text-xs text-gray-500 dark:text-gray-300"><LocSpan textKey={"courseDetailsPage.deleteCourse"} /></label>
                <DeleteButton
                    creatorId={course?.creatorId || ''}
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
                            <FaToggleOn className="text-green-500 text-2xl absolute inset-0 m-auto"/>
                        ) : (
                            <FaToggleOff className="text-gray-500 text-2xl absolute inset-0 m-auto"/>
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
                        canEdit={role === MembershipRole.Owner || role === MembershipRole.Sensei || role === MembershipRole.Staff}
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
                    canEdit={role === MembershipRole.Owner || role === MembershipRole.Sensei || role === MembershipRole.Staff}
                    maxChar={400}
                    placeholder={"Add a Description..."}
                />

                <div className="flex items-center gap-4 overflow-x-auto w-full sm:w-auto flex-grow">
                    <CreatorLabel creatorId={course.creatorId} createdAt={course.createdAt} />

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
                            {lessonsData && Object.values(lessonsData).map(lesson => (
                                <option key={lesson._id} value={lesson._id} className="truncate">
                                    {t("lesson")} : {lesson.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <AddLessonButton courseId={course._id} courseName={course.name}/>

                    <div className="relative lg:w-full mb-2">
                        <div className="lg:w-full text-center -mb-2">
        <span className="text-xs text-gray-400 dark:text-gray-500 bg-white dark:bg-black p-1">
            <LocSpan textKey={"toggle"}/>
        </span>
                        </div>

                        <div
                            className="flex items-center gap-1.5 p-1.5 border border-gray-300 dark:border-gray-700 rounded-lg">
                            <DeckToggle
                                isSelected={toggleState[DeckType.Kanji]}
                                onToggle={() => handleToggle(DeckType.Kanji)}
                                icon={<FaBookOpen className={`text-sm ${toggleState[DeckType.Kanji] ? 'text-white' : 'text-blue-400'}`}/>}
                                selectedColor="bg-blue-500 text-white"
                            />

                            <DeckToggle
                                isSelected={toggleState[DeckType.Word]}
                                onToggle={() => handleToggle(DeckType.Word)}
                                icon={<FaFileAlt className={`text-sm ${toggleState[DeckType.Word] ? 'text-white' : 'text-red-500'}`}/>}
                                selectedColor="bg-red-500 text-white"
                            />

                            <DeckToggle
                                isSelected={toggleState[DeckType.Grammar]}
                                onToggle={() => handleToggle(DeckType.Grammar)}
                                icon={<FaBook className={`text-sm ${toggleState[DeckType.Grammar] ? 'text-white' : 'text-green-500'}`}/>}
                                selectedColor="bg-green-500 text-white"
                            />

                            <DeckToggle
                                isSelected={toggleState[DeckType.Readings]}
                                onToggle={() => handleToggle(DeckType.Readings)}
                                icon={<FaEye className={`text-sm ${toggleState[DeckType.Readings] ? 'text-white' : 'text-yellow-400'}`}/>}
                                selectedColor="bg-yellow-500 text-white"
                            />
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
                        key={lessonId}
                        lesson={lesson}
                        showKanji={toggleState[DeckType.Kanji]}
                        showWord={toggleState[DeckType.Word]}
                        showGrammar={toggleState[DeckType.Grammar]}
                        showReadings={toggleState[DeckType.Readings]}
                        owner={course}
                        viewerRole={role || MembershipRole.None}
                    />
                ) : (
                    <p className="text-center text-gray-500">何もない</p>
                )}
            </div>

            {lessonsLoading && <LoadingScreen isLoading={lessonsLoading}/>}
        </div>
    );
};

export default CourseDetailPage;