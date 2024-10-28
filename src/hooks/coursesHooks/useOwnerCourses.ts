import { usePaginatedData } from '../usePaginatedData';
import { useAuth } from '../../context/AuthContext';
import { CourseData } from "../../data/CourseData.ts";

export const MY_COURSES_ENDPOINT = `/api/course/myCourses`;

export const useOwnerCourses = (page: number, limit: number) => {
    const { userData } = useAuth();

    if (!userData || !userData._id) {
        throw new Error("Pagination data not available");
    }

    const mutation = usePaginatedData<CourseData>(
        MY_COURSES_ENDPOINT,
        page,
        limit,
        userData._id
    );

    return {
        ...mutation,
        fetchCourses: mutation.mutate, 
    };
};