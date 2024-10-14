import React, { useEffect } from 'react';
import { FaBookOpen, FaBook, FaFileAlt, FaEye } from 'react-icons/fa';
import { CourseData, LessonData } from "../data/CourseData.ts";
import DeleteButton from './DeleteButton';
import FollowButton from "./FollowButton.tsx";
import { useAuth } from "../context/AuthContext.tsx";
import Container from "./ui/containers/Container.tsx";
import CreatorLabel from "./ui/text/CreatorLabel.tsx";
import { CollectionTypes } from "../data/CollectionTypes.tsx";
import { useLessons } from '../hooks/newHooks/Courses/useLessons';

interface CourseDataElementProps {
    course: CourseData;
}

const CourseDataElement: React.FC<CourseDataElementProps> = ({ course }) => {
    const { userData } = useAuth();

    const { fetchLessons, data: lessonsData, isLoading: lessonsLoading } = useLessons(course.lessons);

    useEffect(() => {
        fetchLessons();
    }, [course]);

    return (
        <Container key={course._id}>
            <div className="absolute top-2 right-2">
                <DeleteButton
                    creatorId={course.creatorId}
                    elementId={course._id}
                    elementType={CollectionTypes.Course}
                    deleteRelations={true}
                />
            </div>

            <div className="flex items-center justify-between">
                <h1 className="lg:text-3xl text-2xl font-bold text-blue-400 dark:text-white capitalize">
                    {course.name}
                </h1>

                {userData?._id !== course.creatorId && <FollowButton courseId={course._id} />}
            </div>

            <CreatorLabel creatorId={course.creatorId} createdAt={course.createdAt} />
            {!lessonsLoading && lessonsData && (
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
                            <span>Kanji: {lesson.kanjiDecks.length}</span>
                        </span>
                                )}
                                {lesson.wordDecks.length > 0 && (
                                    <span className="flex items-center gap-1">
                            <FaFileAlt className="text-red-400" />
                            <span>Words: {lesson.wordDecks.length}</span>
                        </span>
                                )}
                                {lesson.grammarDecks.length > 0 && (
                                    <span className="flex items-center gap-1">
                            <FaBook className="text-green-400" />
                            <span>Grammar: {lesson.grammarDecks.length}</span>
                        </span>
                                )}
                                {lesson.readingDecks?.length > 0 && (
                                    <span className="flex items-center gap-1">
                            <FaEye className="text-yellow-400" />
                            <span>Readings: {lesson.readingDecks.length}</span>
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

export default CourseDataElement;