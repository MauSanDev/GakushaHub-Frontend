import { usePaginatedData } from './usePaginatedData';
import { CourseData, LessonData } from '../data/CourseData';
import {PaginatedData} from "../data/PaginatedData.ts";
import {useAuth} from "../context/AuthContext.tsx";

export const getCourseLessonsEndpoint = (courseId: string) =>
{
    return`/api/course/${courseId}/lessons/paginated`
}

export const usePaginatedCourseLessons = (courseId: string, page: number, limit: number) => {
    const { userData } = useAuth();
    const endpoint = getCourseLessonsEndpoint(courseId);
    
    return usePaginatedData<PaginatedCourseData<LessonData>>(endpoint, page, limit, userData?._id);
};


export interface PaginatedCourseData<T> extends PaginatedData<T> {
    course: CourseData;
}