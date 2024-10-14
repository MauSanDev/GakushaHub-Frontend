import { useState, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { fetchElements } from '../../../services/dataService';
import { CourseData } from '../../../data/CourseData';

export const useCourses = (ids: string[]): {
    data: Record<string, CourseData> | undefined,
    isLoading: boolean,
    fetchCourses: () => void
} => {
    const queryClient = useQueryClient();
    const [data, setData] = useState<Record<string, CourseData> | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchCourses = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await fetchElements<CourseData>(ids, 'course', queryClient);
            setData(result);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setData(undefined);
        } finally {
            setIsLoading(false);
        }
    }, [ids, queryClient]);

    return {
        data,
        isLoading,
        fetchCourses, // Devuelvo la función para que puedas llamarla manualmente
    };
};