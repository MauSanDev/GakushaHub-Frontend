import React, { useState} from 'react';
import LessonBox from '../components/LessonBox';
import { CourseData, LessonData } from "../data/CourseData.ts";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { usePaginatedCourseLessons } from '../hooks/usePaginatedCourseLessons';
import LoadingScreen from "../components/LoadingScreen";

const CourseDetailPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [page, setPage] = useState(1);
    const { data, isLoading, error } = usePaginatedCourseLessons(courseId || '', page, 10);

    const course = data?.course as CourseData | null;
    const lessons = data?.documents as LessonData[] || [];

    
    if (isLoading) {
        return (<LoadingScreen isLoading={isLoading} />);
    }

    if (error) {
        return <div className="text-red-500 text-center">{String(error)}</div>;
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">
            <div className="flex items-center w-full max-w-4xl mt-8 mb-2">
                <Link
                    to="/courses"
                    className="bg-blue-500 text-white p-2 rounded-full shadow hover:bg-blue-600 mr-4"
                >
                    <FaArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-4xl font-bold text-gray-800 capitalize">
                    {course?.name || "Course"}
                </h1>
            </div>

            <h3 className="text-gray-500 text-left w-full max-w-4xl mb-6 ml-10">
                {course?.description}
            </h3>

            <div className="w-full max-w-4xl flex flex-col gap-6 text-left">
                {lessons.length > 0 ? (
                    lessons.map((lesson) => (
                        <LessonBox
                            key={lesson._id}
                            lesson={lesson}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500">何もない</p>
                )}
            </div>
        </div>
    );
};

export default CourseDetailPage;