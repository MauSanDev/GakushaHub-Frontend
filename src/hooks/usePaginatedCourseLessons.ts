import { usePaginatedData } from './usePaginatedData';
import { LessonData } from '../data/CourseData';

export const usePaginatedCourseLessons = (courseId: string, page: number, limit: number) => {
    const endpoint = `/api/course/${courseId}/lessons/paginated`;
    return usePaginatedData<LessonData>(endpoint, page, limit);
};