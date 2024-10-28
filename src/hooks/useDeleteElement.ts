import { useMutation, useQueryClient } from 'react-query';
import { deleteData } from '../services/dataService';
import { CollectionTypes } from "../data/CollectionTypes.tsx";

export const useDeleteElement = () => {
    const queryClient = useQueryClient();

    return useMutation(
        ({
             elementIds,
             elementType,
             deleteRelations = false,
             extraParams = {} 
         }: {
            elementIds: string[],
            elementType: CollectionTypes,
            deleteRelations?: boolean,
            extraParams?: Record<string, unknown> 
        }) =>
            
        deleteData(elementIds, elementType, queryClient, deleteRelations, extraParams),
        {
            onSuccess: (x) => {
                return x;
            },
            onError: (error: Error) => {
                console.error('Error deleting element:', error.message);
            },
        }
    );
};