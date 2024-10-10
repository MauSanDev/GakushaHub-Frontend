import React, { useState } from 'react';
import { FaBookOpen, FaBook, FaFileAlt, FaEye, FaCheck } from 'react-icons/fa';
import { CourseData } from "../../data/CourseData.ts";

interface SelectionableCourseBoxProps {
    course: CourseData;
    onSelectCourse: (course: CourseData) => void;
    onDeselectCourse: (course: CourseData) => void;
    isSelected: boolean;
}

const SelectionableCourseBox: React.FC<SelectionableCourseBoxProps> = ({ course, onSelectCourse, onDeselectCourse, isSelected }) => {
    const [selected, setSelected] = useState(isSelected);

    const toggleSelection = () => {
        if (selected) {
            onDeselectCourse(course);
        } else {
            onSelectCourse(course);
        }
        setSelected(!selected);
    };

    return (
        <div
            onClick={toggleSelection}
            className={`relative flex items-center p-4 rounded-lg shadow-md transition-all border-2 cursor-pointer 
            ${selected ? 'border-green-500 bg-blue-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'} 
            ${selected ? 'hover:border-green-300' : 'hover:border-blue-300 hover:dark:border-gray-700'}`}
        >
            {selected && (
                <FaCheck className="absolute top-2 right-2 text-white bg-green-500 rounded-full p-1" />
            )}

            <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                    {course.name}
                </h2>

                <div className="flex items-center justify-between mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center">
                            <FaBookOpen className="mr-1 text-blue-400" />
                            <span>{course.lessons.length}</span>
                            <span className="hidden sm:inline">Lessons</span>
                        </span>
                        <span className="flex items-center">
                            <FaBook className="mr-1 text-green-400" />
                            <span>{course.lessons.reduce((sum, lesson) => sum + lesson.kanjiDecks.length, 0)}</span>
                            <span className="hidden sm:inline">Kanji</span>
                        </span>
                        <span className="flex items-center">
                            <FaFileAlt className="mr-1 text-red-400" />
                            <span>{course.lessons.reduce((sum, lesson) => sum + lesson.wordDecks.length, 0)}</span>
                            <span className="hidden sm:inline">Words</span>
                        </span>
                        <span className="flex items-center">
                            <FaEye className="mr-1 text-yellow-400" />
                            <span>{course.lessons.reduce((sum, lesson) => sum + lesson.readingDecks?.length || 0, 0)}</span>
                            <span className="hidden sm:inline">Readings</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectionableCourseBox;