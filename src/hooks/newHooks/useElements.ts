import { useState, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { fetchElements } from '../../services/dataService';
import { CollectionTypes } from '../../data/CollectionTypes';

export const useElements = <T>(
    ids: string[] | null | undefined,
    collectionType: CollectionTypes
): {
    data: Record<string, T> | undefined,
    isLoading: boolean,
    fetchElementsData: () => Promise<Record<string, T> | undefined>
} => {
    const queryClient = useQueryClient();
    const [data, setData] = useState<Record<string, T> | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchElementsData = useCallback(async () => {
        if (!ids || ids.length === 0) {
            setData({});
            return {};
        }

        setIsLoading(true);
        try {
            const result = await fetchElements<T>(ids, collectionType, queryClient);
            setData(result);
            return result;
        } catch (error) {
            console.error('Error fetching elements:', error);
            setData(undefined);
            return undefined;
        } finally {
            setIsLoading(false);
        }
    }, [ids, collectionType, queryClient]);

    return {
        data,
        isLoading,
        fetchElementsData,
    };
};