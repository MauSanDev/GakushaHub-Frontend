import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { fetchElements } from '../../services/dataService';
import { PaginatedData } from "../../data/PaginatedData";

type FakePaginatedData<T> = PaginatedData<T>;

export const useFakePagination = <T>(
    ids: string[],
    page: number,
    limit: number,
    collection: string
): {
    mutate: () => void;
    isLoading: boolean;
    data?: FakePaginatedData<T>;
    resetQueries: () => void
} => {
    const queryClient = useQueryClient();
    const [paginatedIds, setPaginatedIds] = useState<string[]>([]);
    const [isPaginating, setIsPaginating] = useState(true);
    const [elementsData, setElementsData] = useState<Record<string, T> | undefined>(undefined);
    const [isFetchingElements, setIsFetchingElements] = useState(false);

    useEffect(() => {
        const paginate = () => {
            setIsPaginating(true);

            const start = (page - 1) * limit;
            const end = start + limit;
            const paginatedDocuments = ids.slice(start, end);

            // Solo actualiza `paginatedIds` si el resultado ha cambiado
            setPaginatedIds((prevPaginatedIds) => {
                if (JSON.stringify(prevPaginatedIds) !== JSON.stringify(paginatedDocuments)) {
                    return paginatedDocuments;
                }
                return prevPaginatedIds;
            });
            setIsPaginating(false);
        };

        paginate();
    }, [ids, page, limit]);

    const fetchFullData = useCallback(async () => {
        if (paginatedIds.length > 0) {
            setIsFetchingElements(true);
            try {
                const result = await fetchElements<T>(paginatedIds, collection, queryClient);
                setElementsData(result);
            } catch (error) {
                console.error('Error fetching elements:', error);
                setElementsData(undefined);
            } finally {
                setIsFetchingElements(false);
            }
        }
    }, [paginatedIds, collection, queryClient]);

    const resetQueries = () => {
        queryClient.invalidateQueries([collection]); // Invalidar caché
    };

    const combinedData: FakePaginatedData<T> | undefined = paginatedIds && elementsData
        ? {
            documents: paginatedIds.map(id => elementsData[id]),
            totalPages: Math.ceil(ids.length / limit),
            page: page,
            limit: limit,
            totalDocuments: ids.length,
        }
        : undefined;

    return {
        mutate: fetchFullData,
        isLoading: isPaginating || isFetchingElements,
        data: combinedData,
        resetQueries
    };
};