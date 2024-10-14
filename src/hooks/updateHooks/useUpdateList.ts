import { useMutation } from 'react-query';
import { updateList } from '../../services/dataService.ts';

interface UpdateListParams {
    collection: string;
    documentId: string;
    field: string;
    value: string;
    action: 'add' | 'remove';
}

export const useUpdateList = () => {
    return useMutation(
        async ({ collection, documentId, field, value, action }: UpdateListParams) => {
            return await updateList(collection, documentId, field, value, action);
        },
        {
            onError: (error) => {
                console.error("Error modifying list:", error);
            },
            onSuccess: (data) => {
                console.log("List modified successfully:", data);
            },
        }
    );
};