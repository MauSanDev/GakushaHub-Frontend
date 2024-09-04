import React from 'react';
import { FaBookOpen, FaBook, FaFileAlt, FaChevronRight, FaCrown, FaEye } from 'react-icons/fa';
import { CourseData } from "../../data/CourseData.ts";
import DeleteButton from '../DeleteButton';

interface CourseBoxProps {
    course: CourseData;
}

const CourseBox: React.FC<CourseBoxProps> = ({ course }) => {
    return (
        <div className="relative bg-white dark:bg-gray-900 px-6 pt-6 rounded-lg shadow-md text-left border-2 border-gray-200 dark:border-gray-800 transform transition-transform duration-300 lg:hover:scale-105 hover:border-blue-300 hover:dark:border-gray-700">
            <div className="absolute top-2 right-2">
                <DeleteButton
                    creatorId={course.creatorId._id}
                    elementId={course._id}
                    elementType="course"
                    deleteRelations={true}
                />
            </div>
            <h1 className="text-3xl font-bold text-blue-400 dark:text-white capitalize">{course.name}</h1>

            <p className="inline-flex text-left text-xs text-gray-500 mb-2 gap-2">
                <FaCrown />
                Created by {course.creatorId?.name ?? "???"} - {new Date(course.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-700 mb-3">{course.description}</p>

            {course.lessons.map((lesson) => (
                <div key={lesson._id} className="mb-4 indent-5 dark:bg-gray-950 rounded py-2 border dark:border-gray-800">
                    <div className="flex items-center max-w-full capitalize">
                        <FaChevronRight />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{lesson.name}</h2>
                    </div>

                    {/* Responsive: Display as a single line on larger screens and as a list on smaller screens */}
                    <div className="ml-9 flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:gap-2 text-gray-600 dark:text-gray-300">
                        {lesson.kanjiDecks.length > 0 && (
                            <span className="flex items-center gap-1">
                                <FaBookOpen className="text-blue-400" />
                                <span className="font-semibold text-gray-800 dark:text-gray-200">Kanji:</span> {lesson.kanjiDecks.length} elements
                            </span>
                        )}

                        {lesson.wordDecks.length > 0 && (
                            <span className="flex items-center gap-1">
                                <FaFileAlt className="text-red-400" />
                                <span className="font-semibold text-gray-800 dark:text-gray-200">Words:</span> {lesson.wordDecks.length} Deck
                            </span>
                        )}

                        {lesson.grammarDecks.length > 0 && (
                            <span className="flex items-center gap-1">
                                <FaBook className="text-green-400" />
                                <span className="font-semibold text-gray-800 dark:text-gray-200">Grammar:</span> {lesson.grammarDecks.length} Deck
                            </span>
                        )}

                        {lesson.readingDecks?.length > 0 && (
                            <span className="flex items-center gap-1">
                                <FaEye className="text-yellow-400" />
                                <span className="font-semibold text-gray-800 dark:text-gray-200">Readings:</span> {lesson.readingDecks.length} Deck
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CourseBox;