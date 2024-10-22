import React, { useEffect } from 'react';
import { FaBookOpen, FaBook, FaFileAlt, FaEye, FaTrash } from 'react-icons/fa';
import { CourseData, LessonData } from "../data/CourseData.ts";
import TertiaryButton from './ui/buttons/TertiaryButton.tsx';
import { useUpdateList } from '../hooks/updateHooks/useUpdateList.ts'; // Importa el nuevo hook
import { CollectionTypes } from "../data/CollectionTypes.tsx";
import LocSpan from "./LocSpan.tsx";
import Container from "./ui/containers/Container.tsx";
import CreatorLabel from "./ui/text/CreatorLabel.tsx";
import { useLessons } from "../hooks/newHooks/Courses/useLessons.ts";

interface StudyGroupCourseDataElementProps {
    course: CourseData;
    studyGroupId: string;
    canDelete: boolean;
}

const StudyGroupCourseDataElement: React.FC<StudyGroupCourseDataElementProps> = ({ course, studyGroupId, canDelete = false }) => {
    const { mutate: modifyList } = useUpdateList();
    const { fetchLessons, data: lessonsData, isLoading: lessonsLoading } = useLessons(course.lessons);

    useEffect(() => {
        if (course.lessons.length > 0) {
            fetchLessons();
        }
    }, [course.lessons, fetchLessons]);

    const handleRemoveCourse = () => {
        const confirmDelete = window.confirm("Are you sure you want to remove this course from the study group?");
        if (confirmDelete) {
            modifyList({
                collection: CollectionTypes.StudyGroup,
                documentId: studyGroupId,
                field: 'courseIds',
                value: [course._id],
                action: 'remove'
            });
        }
    };

    return (
        <Container>
            {canDelete &&
                <div className="absolute top-2 right-2">
                    <TertiaryButton onClick={handleRemoveCourse} iconComponent={<FaTrash />} label={"Remove"} />
                </div>
            }

            <div className="flex items-center justify-between">
                <h1 className="lg:text-3xl text-2xl font-bold text-blue-400 dark:text-white capitalize">
                    {course.name}
                </h1>
            </div>

            <CreatorLabel creatorId={course.creatorId} createdAt={course.createdAt} />

            {!lessonsLoading && lessonsData  &&(
                Object.values(lessonsData).map((lesson: LessonData) => (
                    <div key={lesson._id} className="mb-1 px-2 py-1 rounded dark:bg-gray-950">
                        <div className="flex items-center justify-between capitalize">
                            <h2 className="text-base font-medium text-gray-800 dark:text-gray-200 flex-grow truncate">
                                {lesson.name}
                            </h2>
                            <div className="flex gap-3 text-gray-600 dark:text-gray-300 text-xs items-center">
                                {lesson.kanjiDecks.length > 0 && (
                                    <span className="flex items-center gap-1">
                                        <FaBookOpen className="text-blue-400" />
                                        <span><LocSpan textKey={"kanji"} />: {lesson.kanjiDecks.length}</span>
                                    </span>
                                )}
                                {lesson.wordDecks.length > 0 && (
                                    <span className="flex items-center gap-1">
                                        <FaFileAlt className="text-red-400" />
                                        <span><LocSpan textKey={"words"} />: {lesson.wordDecks.length}</span>
                                    </span>
                                )}
                                {lesson.grammarDecks.length > 0 && (
                                    <span className="flex items-center gap-1">
                                        <FaBook className="text-green-400" />
                                        <span><LocSpan textKey={"grammar"} />: {lesson.grammarDecks.length}</span>
                                    </span>
                                )}
                                {lesson.readingDecks?.length > 0 && (
                                    <span className="flex items-center gap-1">
                                        <FaEye className="text-yellow-400" />
                                        <span><LocSpan textKey={"readings"} />: {lesson.readingDecks.length}</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </Container>
    );
};

export default StudyGroupCourseDataElement;