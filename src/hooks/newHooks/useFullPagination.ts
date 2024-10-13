import { usePagination } from './usePagination';
import { useElements } from './useElements';
import { PaginatedData } from "../../data/PaginatedData";

export const useFullPagination = <T>(
    page: number,
    limit: number,
    key: string,
    search: string = '',
    searchFields: string[] = ['name'],
    extraParams?: Record<string, string>, 
    creatorId?: string
): { mutate: () => void, isLoading: boolean, data?: PaginatedData<T>, resetQueries: () => void } => {
    
    const { mutate: paginateMutate, resetQueries: paginateResetQueries, data: paginatedData, isLoading: isPaginating } = usePagination<string>(
        `api/${key}`, page, limit, creatorId, search, searchFields, extraParams
    );
    
    const { mutate: fetchElementsMutate, resetQueries: elementsResetQueries, data: elementsData, isLoading: isFetchingElements } = useElements<T>(
        paginatedData?.documents || [], key
    );

    const fetchFullData = () => {
        paginateMutate(undefined, {
            onSuccess: (paginatedData) => {
                console.log("Paginated data received:", paginatedData);

                if (paginatedData?.documents && paginatedData.documents.length > 0) {
                    console.log(`Fetching full ${key} for IDs:`, paginatedData.documents);
                    fetchElementsMutate(paginatedData.documents);
                } else {
                    console.log(`No IDs found to fetch ${key}.`);
                }
            }
        });
    };

    const resetQueries = () => {
        paginateResetQueries();
        elementsResetQueries();
    };

    const combinedData: PaginatedData<T> | undefined = paginatedData && elementsData
        ? {
            ...paginatedData,
            documents: paginatedData.documents.map(id => elementsData[id])
        }
        : undefined;

    return {
        mutate: fetchFullData,
        isLoading: isPaginating || isFetchingElements,
        data: combinedData,
        resetQueries
    };
};