import { usePaginatedData } from '../usePaginatedData';
import { CourseData } from "../../data/CourseData.ts";
import { useAuth } from "../../context/AuthContext.tsx";

export const usePublicCourses = (page: number, limit: number) => {
    const { userData } = useAuth();

    const mutation = usePaginatedData<CourseData>(
        '/api/course/paginated',
        page,
        limit,
        userData?._id
    );

    return {
        ...mutation,
        fetchCourses: mutation.mutate,
    };
};