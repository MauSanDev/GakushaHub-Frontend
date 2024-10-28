import { useMutation } from 'react-query';
import { updateData } from '../../services/dataService.ts';
import { useQueryClient } from 'react-query';


interface UpdateDataParams<T> {
    collection: string;
    documentId: string;
    newData: T;
}

export const useUpdateData = <T>() => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ collection, documentId, newData }: UpdateDataParams<T>) => {
            return await updateData(collection, documentId, newData, queryClient);
        },
        {
            onError: (error) => {
                console.error("Error updating document:", error);
            },
        }
    );
};