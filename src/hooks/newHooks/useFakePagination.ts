import { useState, useEffect } from 'react';
import { useElements } from './useElements';
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
    const [paginatedIds, setPaginatedIds] = useState<string[]>([]);
    const [isPaginating, setIsPaginating] = useState(true);


    const { mutate: fetchElementsMutate, data: elementsData, isLoading: isFetchingElements, resetQueries: resetElementsQueries } = useElements<T>(
        paginatedIds,
        collection
    );

    useEffect(() => {

        const paginate = () => {
            setIsPaginating(true);


            const start = (page - 1) * limit;
            const end = start + limit;
            const paginatedDocuments = ids.slice(start, end);


            setPaginatedIds(paginatedDocuments);
            setIsPaginating(false);
        };

        paginate();
    }, [ids, page, limit]);


    const fetchFullData = () => {
        if (paginatedIds.length > 0) {
            fetchElementsMutate(paginatedIds);
        }
    };


    const resetQueries = () => {
        resetElementsQueries();
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

    // Log the final combinedData before returning
    console.log("Final paginated data:", combinedData);

    return {
        mutate: fetchFullData,
        isLoading: isPaginating || isFetchingElements,
        data: combinedData,
        resetQueries
    };
};