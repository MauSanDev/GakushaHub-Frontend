import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { fetchFullPagination } from '../../../services/dataService.ts';
import { CourseData } from '../../../data/CourseData';
import { PaginatedData } from '../../../data/PaginatedData';
import { useAuth } from "../../../context/AuthContext";

export const useMyCourses = (
    page: number,
    limit: number,
    search: string = ''
): { fetchCourses: () => Promise<void>, isLoading: boolean, data?: PaginatedData<CourseData>, resetQueries: () => void } => {
    const { userData } = useAuth();
    const queryClient = useQueryClient();
    const [data, setData] = useState<PaginatedData<CourseData> | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const searches: Record<string, string[]> = {};

    if (search) {
        searches['search1'] = [search];
        searches['search1fields'] = ['name'];
    }

    searches['search2'] = ['null'];
    searches['search2fields'] = ['institutionId'];

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

    // Permite invalidar la caché de React Query para los cursos
    const resetQueries = () => {
        queryClient.invalidateQueries('courses');
    };

    return {
        data,
        isLoading,
        fetchCourses,  // Mantengo la función para llamarla manualmente
        resetQueries,  // Permite resetear la caché
    };
};