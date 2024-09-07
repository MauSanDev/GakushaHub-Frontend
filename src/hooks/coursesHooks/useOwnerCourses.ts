import { usePaginatedData } from '../usePaginatedData';
import { useAuth } from '../../context/AuthContext';
import {CourseData} from "../../data/CourseData.ts";

export const useOwnerCourses = (page: number, limit: number) => {
    const { userData } = useAuth();
    const { data, error, resetQueries, ...rest } = usePaginatedData<CourseData>(`/api/course/myCourses`, page, limit, userData?._id);

    if (!userData || !userData._id) {
        throw new Error("Pagination data not available");
    }

    return { data, error, resetQueries, ...rest };
};