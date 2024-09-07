import { usePaginatedData } from '../usePaginatedData';
import {CourseData} from "../../data/CourseData.ts";

export const usePublicCourses = (page: number, limit: number) => {
    const { data, error, resetQueries, ...rest } = usePaginatedData<CourseData>('/api/course/paginated', page, limit);

    return { data, error, resetQueries, ...rest };
};