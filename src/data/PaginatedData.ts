
export interface PaginatedData<T> {
    page: number;
    totalPages: number;
    limit: number;
    totalDocuments: number;
    documents: T[];
}