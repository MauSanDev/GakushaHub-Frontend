import { useState, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { fetchElements } from '../../services/dataService';
import { CollectionTypes } from '../../data/CollectionTypes';

export const useElements = <T>(
    ids: string[],
    collectionType: CollectionTypes
): {
    data: Record<string, T> | undefined,
    isLoading: boolean,
    fetchElementsData: () => Promise<void>
} => {
    const queryClient = useQueryClient();
    const [data, setData] = useState<Record<string, T> | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchElementsData = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await fetchElements<T>(ids, collectionType, queryClient);
            setData(result);
        } catch (error) {
            console.error('Error fetching elements:', error);
            setData(undefined);
        } finally {
            setIsLoading(false);
        }
    }, [ids, collectionType, queryClient]);

    return {
        data,
        isLoading,
        fetchElementsData,  // Ahora es una promesa que se puede await
    };
};