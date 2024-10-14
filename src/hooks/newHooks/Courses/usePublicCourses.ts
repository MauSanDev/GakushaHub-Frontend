import { useFullPagination } from '../useFullPagination';
import { CourseData } from '../../../data/CourseData';
import { PaginatedData } from '../../../data/PaginatedData.ts';

export const usePublicCourses = (
    page: number,
    limit: number,
    search: string = ''
): { mutate: () => void, isLoading: boolean, data?: PaginatedData<CourseData>, resetQueries: () => void } => {

    const searches: Record<string, string[]> = {};
    
    if (search) {
        searches['search1'] = [search];
        searches['search1fields'] = ['name'];
    }

    return useFullPagination<CourseData>(
        page,
        limit,
        'course',
        searches,  
        { isPublic: 'true' }  
    );
};