import { useState, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { fetchElements } from '../services/dataService'; // Asegúrate de que este es el path correcto
import { StudyGroupData } from '../data/Institutions/StudyGroupData.ts';
import { CollectionTypes } from '../data/CollectionTypes.tsx';

export const useStudyGroup = (id: string): {
    data: StudyGroupData | undefined,
    isLoading: boolean,
    fetchStudyGroup: () => void
} => {
    const queryClient = useQueryClient();
    const [data, setData] = useState<StudyGroupData | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchStudyGroup = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await fetchElements<StudyGroupData>([id], CollectionTypes.StudyGroup, queryClient);
            // fetchElements devuelve un Record<string, StudyGroupData>, así que tomamos el valor correspondiente al id
            setData(result[id]);
        } catch (error) {
            console.error('Error fetching study group:', error);
            setData(undefined);
        } finally {
            setIsLoading(false);
        }
    }, [id, queryClient]);

    return {
        data,
        isLoading,
        fetchStudyGroup,
    };
};