import { useMutation, useQueryClient } from 'react-query';
import { deleteData } from '../services/dataService';
import { CollectionTypes } from "../data/CollectionTypes.tsx";

export const useDeleteElement = () => {
    const queryClient = useQueryClient();

    return useMutation(
        ({ elementIds, elementType, deleteRelations = false }: { elementIds: string[], elementType: CollectionTypes, deleteRelations?: boolean }) =>
            deleteData(elementIds, elementType, deleteRelations),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('parsedText');
            },
            onError: (error: Error) => {
                console.error('Error deleting element:', error.message);
            },
        }
    );
};