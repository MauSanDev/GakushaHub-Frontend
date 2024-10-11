import { usePaginatedData } from './usePaginatedData';
import { CourseData } from "../data/CourseData";
import { useAuth } from "../context/AuthContext";

export const usePaginatedCourse = (page: number, limit: number, searchString?: string, institutionId?: string) => {
    const { userData } = useAuth();

    if (!userData || !userData._id) {
        throw new Error("Pagination data not available");
    }

    const { data, error, mutate, resetQueries, ...rest } = usePaginatedData<CourseData>(
        '/api/course/paginated',
        page,
        limit,
        userData._id,
        {
            ...(institutionId && { institutionId }),  // Add institutionId if provided
            ...(searchString && { search: searchString })  // Add search string if provided
        }
    );

    const triggerFetch = () => {
        mutate(); // Manually trigger the mutation
    };

    return { data, error, triggerFetch, resetQueries, ...rest };
};