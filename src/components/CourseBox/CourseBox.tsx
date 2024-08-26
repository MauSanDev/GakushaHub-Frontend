import React from 'react';
import { CourseData } from '../../data/data-structures';

interface CourseBoxProps {
    course: CourseData;
}

const CourseBox: React.FC<CourseBoxProps> = ({ course }) => {
    return (
        <div className="relative bg-white p-6 rounded-lg shadow-md mb-6 text-left border-2 border-gray-200 transform transition-transform duration-300 hover:scale-105 hover:border-blue-300">
            <h1 className="text-2xl font-bold mb-2 text-blue-400">{course.name}</h1>
            <p className="text-gray-700 mb-4">{course.description}</p>
            <span className="text-sm text-gray-500">Lecciones: {course.lessons.length}</span>
        </div>
    );
};

export default CourseBox;