import { useFullPagination } from '../useFullPagination';
import { CourseData } from '../../../data/CourseData';
import { PaginatedData } from '../../../data/PaginatedData.ts';

export const usePublicCourses = (
    page: number,
    limit: number,
    search: string = ''
): { mutate: () => void, isLoading: boolean, data?: PaginatedData<CourseData>, resetQueries: () => void } => {
    return useFullPagination<CourseData>(
        page,
        limit,
        'course',              
        search,                
        ['name'],
        { isPublic: 'true' }  
    );
};