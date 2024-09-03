import React from 'react';
import { FaBookOpen, FaBook, FaFileAlt } from 'react-icons/fa';
import { CourseData } from "../../data/CourseData.ts";
import DeleteButton from '../DeleteButton';

interface CourseBoxProps {
    course: CourseData;
}

const CourseBox: React.FC<CourseBoxProps> = ({ course }) => {
    return (
        <div className="relative bg-white p-6 rounded-lg shadow-md mb-6 text-left border-2 border-gray-200 transform transition-transform duration-300 hover:scale-105 hover:border-blue-300">
            <div className="absolute top-2 right-2">
                <DeleteButton
                    creatorId={course.creatorId}
                    elementId={course._id}
                    elementType="course"
                    deleteRelations={true}
                />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-blue-500">{course.name}</h1>
            <p className="text-gray-700 mb-6">{course.description}</p>

            {course.lessons.map((lesson) => (
                <div key={lesson._id} className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">{lesson.name}</h2>
                    <div className="grid grid-cols-3 gap-4 ml-9">
                        {lesson.kanjiDecks.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 text-blue-400">
                                    <FaBookOpen />
                                    <span className="font-semibold text-gray-800">Kanji Decks:</span>
                                </div>
                                <ul className="ml-6 list-disc list-inside text-gray-600">
                                    {lesson.kanjiDecks.map((deck) => (
                                        <li key={deck._id}>{deck.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {lesson.wordDecks.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 text-red-400">
                                    <FaFileAlt />
                                    <span className="font-semibold text-gray-800">Word Decks:</span>
                                </div>
                                <ul className="ml-6 list-disc list-inside text-gray-600">
                                    {lesson.wordDecks.map((deck) => (
                                        <li key={deck._id}>{deck.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {lesson.grammarDecks.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 text-green-400">
                                    <FaBook />
                                    <span className="font-semibold text-gray-800">Grammar Decks:</span>
                                </div>
                                <ul className="ml-6 list-disc list-inside text-gray-600">
                                    {lesson.grammarDecks.map((deck) => (
                                        <li key={deck._id}>{deck.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CourseBox;