import { useFullPagination } from '../useFullPagination';
import { CourseData } from '../../../data/CourseData';
import { PaginatedData } from '../../../data/PaginatedData.ts';
import {useAuth} from "../../../context/AuthContext.tsx";

export const useMyCourses = (
    page: number,
    limit: number,
    search: string = ''
): { mutate: () => void, isLoading: boolean, data?: PaginatedData<CourseData>, resetQueries: () => void } => {
    const { userData } = useAuth();

    return useFullPagination<CourseData>(
        page,
        limit,
        'course',
        search,
        ['name'],
        {},
        userData?._id 
    );
};