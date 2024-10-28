/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useState } from 'react';
import { FaBookOpen } from 'react-icons/fa';
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
                <span className="flex items-center">
                    <FaBookOpen className="mr-1 text-blue-400" />
                    <span>{course.lessons?.length || 0}</span>
                    <span className="hidden sm:inline">Lessons</span>
                </span>
            </div>
        </SelectableContainer>
    );
};

export default SelectableCourseBox;