import React, { useState } from 'react';
import { FaBookOpen, FaBook, FaFileAlt, FaEye } from 'react-icons/fa';
import { CourseData } from "../../data/CourseData.ts";
import SelectableContainer from "../../components/ui/containers/SelectableContainer.tsx";

interface SelectionableCourseBoxProps {
    course: CourseData;
    onSelectCourse: (course: CourseData) => void;
    onDeselectCourse: (course: CourseData) => void;
    isSelected: boolean;
}

const SelectableCourseBox: React.FC<SelectionableCourseBoxProps> = ({ course, onSelectCourse, onDeselectCourse, isSelected }) => {
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
        <SelectableContainer isSelected={selected} onClick={toggleSelection}>
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
        </SelectableContainer>
    );
};

export default SelectableCourseBox;