import { usePaginatedData } from '../usePaginatedData';
import { useAuth } from '../../context/AuthContext';
import { CourseData } from "../../data/CourseData.ts";

export const FOLLOWED_COURSES_ENDPOINT = `/api/course/followed`;

export const useFollowedCourses = (page: number, limit: number) => {
    const { userData } = useAuth();

    if (!userData || !userData._id) {
        throw new Error("User data not available");
    }

    const mutation = usePaginatedData<CourseData>(
        FOLLOWED_COURSES_ENDPOINT,
        page,
        limit,
        userData._id
    );

    return {
        ...mutation,
        fetchCourses: mutation.mutate,
    };
};