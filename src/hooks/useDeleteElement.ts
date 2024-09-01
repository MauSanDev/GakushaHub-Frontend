import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../services/ApiClient';

interface DeleteElementParams {
    elementId: string;
    elementType: 'course' | 'lesson' | 'kanji' | 'word' | 'grammar' | 'generation';
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
            queryClient.invalidateQueries('parsedText'); // TODO: Modify
        },
        onError: (error: Error) => {
            console.error('Error deleting element:', error.message);
        },
    });
};