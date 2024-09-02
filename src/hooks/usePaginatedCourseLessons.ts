import { usePaginatedData } from './usePaginatedData';
import { CourseData, LessonData } from '../data/CourseData';
import {PaginatedData} from "../data/PaginatedData.ts";

export const usePaginatedCourseLessons = (courseId: string, page: number, limit: number) => {
    const endpoint = `/api/course/${courseId}/lessons/paginated`;
    return usePaginatedData<PaginatedCourseData<LessonData>>(endpoint, page, limit);
};


export interface PaginatedCourseData<T> extends PaginatedData<T> {
    course: CourseData;
}