import { useState, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { fetchElements } from '../../../services/dataService';
import { LessonData } from '../../../data/CourseData';

export const useLessons = (ids: string[]): {
    data: Record<string, LessonData> | undefined,
    isLoading: boolean,
    fetchLessons: () => void 
} => {
    const queryClient = useQueryClient();
    const [data, setData] = useState<Record<string, LessonData> | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchLessons = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await fetchElements<LessonData>(ids, 'course/lesson', queryClient);
            setData(result);
        } catch (error) {
            console.error('Error fetching lessons:', error);
            setData(undefined);
        } finally {
            setIsLoading(false);
        }
    }, [ids, queryClient]); // useCallback para evitar que se redefina en cada render

    return {
        data,
        isLoading,
        fetchLessons, // Devuelvo la función para que pueda llamarse manualmente
    };
};