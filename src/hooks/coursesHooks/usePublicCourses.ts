import { usePaginatedData } from '../usePaginatedData';
import {CourseData} from "../../data/CourseData.ts";
import {useAuth} from "../../context/AuthContext.tsx";

export const usePublicCourses = (page: number, limit: number) => {
    const { userData } = useAuth();
    const { data, error, resetQueries, ...rest } = usePaginatedData<CourseData>('/api/course/paginated', page, limit, userData?._id);

    if (!userData || !userData._id) {
        throw new Error("Pagination data not available");
    }

    return { data, error, resetQueries, ...rest };
};