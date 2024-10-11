import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../services/ApiClient';
import {CollectionTypes} from "../data/CollectionTypes.tsx";

interface DeleteElementParams {
    elementId: string;
    elementType: CollectionTypes;
    deleteRelations?: boolean;
}

interface DeleteResponse {
    elementId: string;
    message: string;
}

const deleteElement = async ({ elementId, elementType, deleteRelations = false }: DeleteElementParams): Promise<DeleteResponse> => {
    return ApiClient.delete<DeleteResponse>(`/api/delete/${elementType}`, {
        data: {
            elementId,
            deleteRelations,
        },
    });
};

export const useDeleteElement = () => {
    const queryClient = useQueryClient();

    return useMutation(deleteElement, {
        onSuccess: () => {
            queryClient.invalidateQueries('parsedText'); // TODO: Modify this as necessary
        },
        onError: (error: Error) => {
            console.error('Error deleting element:', error.message);
        },
    });
};