import { useState, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { fetchElements } from '../../../services/dataService';
import { LessonData } from '../../../data/CourseData';
import {CollectionTypes} from "../../../data/CollectionTypes.tsx";

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
            const result = await fetchElements<LessonData>(ids, CollectionTypes.Lesson, queryClient);
            setData(result);
        } catch (error) {
            console.error('Error fetching lessons:', error);
            setData(undefined);
        } finally {
            setIsLoading(false);
        }
    }, [ids, queryClient]); 

    return {
        data,
        isLoading,
        fetchLessons, 
    };
};