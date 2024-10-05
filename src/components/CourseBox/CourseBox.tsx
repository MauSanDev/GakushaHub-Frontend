import React from 'react';
import { FaBookOpen, FaBook, FaFileAlt, FaChevronRight, FaCrown, FaEye } from 'react-icons/fa';
import { CourseData } from "../../data/CourseData.ts";
import DeleteButton from '../DeleteButton';
import FollowButton from "../FollowButton.tsx";
import {useAuth} from "../../context/AuthContext.tsx";

interface CourseBoxProps {
    course: CourseData;
}

const CourseBox: React.FC<CourseBoxProps> = ({ course }) => {
    const { userData } = useAuth()
    
    return (
        <div
            className="relative pb-6 bg-white dark:bg-gray-900 px-6 pt-6 rounded-lg shadow-md text-left border-2 border-gray-200 dark:border-gray-800 transform transition-transform duration-300 lg:hover:scale-105 hover:border-blue-300 hover:dark:border-gray-700">
            <div className="absolute top-2 right-2">
                <DeleteButton
                    creatorId={course.creatorId._id}
                    elementId={course._id}
                    elementType="course"
                    deleteRelations={true}
                />
            </div>
            
            <div className="flex items-center justify-between">
                <h1 className="lg:text-3xl text-2xl font-bold text-blue-400 dark:text-white capitalize">
                    {course.name}
                </h1>

                {userData?._id !== course.creatorId._id && <FollowButton courseId={course._id}/>}
            </div>

            <p className="inline-flex text-left text-xs text-gray-500 mb-2 gap-2">
                <FaCrown/>
                Created by {course.creatorId?.name ?? "???"} - {new Date(course.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-700 mb-3">{course.description}</p>


            {course.lessons.map((lesson) => (
                <div key={lesson._id} className="mb-1 px-2 py-1 rounded dark:bg-gray-950">
                    <div className="flex items-center justify-between capitalize">
                        {/* Título de la lección que ocupa el máximo espacio */}
                        <h2 className="text-base font-medium text-gray-800 dark:text-gray-200 flex-grow truncate">
                            {lesson.name}
                        </h2>
                        {/* Decks alineados a la derecha */}
                        <div className="flex gap-3 text-gray-600 dark:text-gray-300 text-xs items-center">
                            {lesson.kanjiDecks.length > 0 && (
                                <span className="flex items-center gap-1">
                        <FaBookOpen className="text-blue-400"/>
                        <span>Kanji: {lesson.kanjiDecks.length}</span>
                    </span>
                            )}
                            {lesson.wordDecks.length > 0 && (
                                <span className="flex items-center gap-1">
                        <FaFileAlt className="text-red-400"/>
                        <span>Words: {lesson.wordDecks.length}</span>
                    </span>
                            )}
                            {lesson.grammarDecks.length > 0 && (
                                <span className="flex items-center gap-1">
                        <FaBook className="text-green-400"/>
                        <span>Grammar: {lesson.grammarDecks.length}</span>
                    </span>
                            )}
                            {lesson.readingDecks?.length > 0 && (
                                <span className="flex items-center gap-1">
                        <FaEye className="text-yellow-400"/>
                        <span>Readings: {lesson.readingDecks.length}</span>
                    </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CourseBox;