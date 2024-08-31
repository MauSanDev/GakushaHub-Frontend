import { usePaginatedData } from './usePaginatedData.ts';
import { CourseData } from '../data/CourseData.ts';

export const usePaginatedCourse = (page: number, limit: number) => {
    return usePaginatedData<CourseData>('/api/course/paginated', page, limit);
};