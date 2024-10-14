import { useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { fetchFullPagination } from '../../../services/dataService.ts';
import { CourseData } from '../../../data/CourseData';
import { PaginatedData } from '../../../data/PaginatedData';

export const useInstitutionCourses = (
    page: number,
    limit: number,
    search: string = '',
    institutionId: string
): { fetchCourses: () => void, isLoading: boolean, data?: PaginatedData<CourseData>, resetQueries: () => void } => {
    const queryClient = useQueryClient();
    const [data, setData] = useState<PaginatedData<CourseData> | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const extraParams = { institutionId };
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
                extraParams
            );
            setData(result);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setData(undefined); // Aseguramos que nunca se asigne null
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [page, limit, search, institutionId]);

    return {
        data,
        isLoading,
        resetQueries: () => queryClient.invalidateQueries('course'),
        fetchCourses,
    };
};