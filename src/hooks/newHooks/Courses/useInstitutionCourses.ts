import { useFullPagination } from '../useFullPagination';
import { CourseData } from '../../../data/CourseData';
import { PaginatedData } from '../../../data/PaginatedData.ts';

export const useInstitutionCourses = (
    page: number,
    limit: number,
    search: string = '',
    institutionId: string
): { mutate: () => void, isLoading: boolean, data?: PaginatedData<CourseData>, resetQueries: () => void } => {
    const extraParams = { institutionId };

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
        extraParams);
};