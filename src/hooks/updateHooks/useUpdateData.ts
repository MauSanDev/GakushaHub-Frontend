import { useMutation } from 'react-query';
import { updateData } from '../../services/dataService.ts';

interface UpdateDataParams<T> {
    collection: string;
    documentId: string;
    newData: T;
}

export const useUpdateData = <T>() => {
    return useMutation(
        async ({ collection, documentId, newData }: UpdateDataParams<T>) => {
            return await updateData(collection, documentId, newData);
        },
        {
            onError: (error) => {
                console.error("Error updating document:", error);
            },
        }
    );
};