import { useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { fetchFullPagination } from '../../../services/dataService.ts';
import { CourseData } from '../../../data/CourseData';
import { PaginatedData } from '../../../data/PaginatedData';
import { useAuth } from "../../../context/AuthContext";

export const useMyCourses = (
    page: number,
    limit: number,
    search: string = ''
): { fetchCourses: () => void, isLoading: boolean, data?: PaginatedData<CourseData>, resetQueries: () => void } => {
    const { userData } = useAuth();
    const queryClient = useQueryClient();
    const [data, setData] = useState<PaginatedData<CourseData> | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const searches: Record<string, string[]> = {};

    if (search) {
        searches['search1'] = [search];
        searches['search1fields'] = ['name'];
    }

    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            const result = await fetchFullPagination<CourseData>(
                page,
                limit,
                'course',
                queryClient,
                searches,
                {},
                {},
                userData?._id
            );
            setData(result);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setData(undefined);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userData?._id) {
            fetchCourses();
        }
    }, [page, limit, search, userData?._id]);

    return {
        data,
        isLoading,
        resetQueries: () => queryClient.invalidateQueries('course'),
        fetchCourses,
    };
};