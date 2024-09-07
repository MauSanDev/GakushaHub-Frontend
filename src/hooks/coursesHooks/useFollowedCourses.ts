import { usePaginatedData } from '../usePaginatedData';
import { useAuth } from '../../context/AuthContext';
import { CourseData } from "../../data/CourseData.ts";

export const FOLLOWED_COURSES_ENDPOINT = `/api/course/followed`;

export const useFollowedCourses = (page: number, limit: number) => {
    const { userData } = useAuth();
    const { data, error, resetQueries, ...rest } = usePaginatedData<CourseData>(FOLLOWED_COURSES_ENDPOINT, page, limit, userData?._id);

    if (!userData || !userData._id) {
        throw new Error("User data not available");
    }

    return { data, error, resetQueries, ...rest };
};