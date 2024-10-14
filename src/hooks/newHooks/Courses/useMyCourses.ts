import { useFullPagination } from '../useFullPagination';
import { CourseData } from '../../../data/CourseData';
import { PaginatedData } from '../../../data/PaginatedData.ts';
import { useAuth } from "../../../context/AuthContext.tsx";

export const useMyCourses = (
    page: number,
    limit: number,
    search: string = ''
): { mutate: () => void, isLoading: boolean, data?: PaginatedData<CourseData>, resetQueries: () => void } => {
    const { userData } = useAuth();

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
        {},
        userData?._id  
    );
};