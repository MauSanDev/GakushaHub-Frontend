import { useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { fetchFullPagination } from '../../../services/dataService.ts';
import { CourseData } from '../../../data/CourseData';
import { PaginatedData } from '../../../data/PaginatedData';

export const usePublicCourses = (
    page: number,
    limit: number,
    search: string = ''
): { fetchCourses: () => void, isLoading: boolean, data?: PaginatedData<CourseData>, resetQueries: () => void } => {
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
                { isPublic: 'true' }
            );
            setData(result);
        } catch (error) {
            console.error('Error fetching public courses:', error);
            setData(undefined);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [page, limit, search]);

    return {
        data,
        isLoading,
        resetQueries: () => queryClient.invalidateQueries('course'),
        fetchCourses,
    };
};