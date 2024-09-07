import { usePaginatedData } from '../usePaginatedData';
import { useAuth } from '../../context/AuthContext';
import {CourseData} from "../../data/CourseData.ts";

export const MY_COURSES_ENDPOINT = `/api/course/myCourses`;

export const useOwnerCourses = (page: number, limit: number) => {
    const { userData } = useAuth();
    const { data, error, resetQueries, ...rest } = usePaginatedData<CourseData>(MY_COURSES_ENDPOINT, page, limit, userData?._id);

    if (!userData || !userData._id) {
        throw new Error("Pagination data not available");
    }

    return { data, error, resetQueries, ...rest };
};