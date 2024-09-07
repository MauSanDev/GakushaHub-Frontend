import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../../services/ApiClient';


interface UpdateDocumentParams<T> {
    collection: string;
    documentId: string;
    updateData: T;
}


const updateDocument = async <T>({ collection, documentId, updateData }: UpdateDocumentParams<T>): Promise<T> => {
    return ApiClient.put<T, T>(`/api/update/${collection}/${documentId}`, updateData);
};


export const useUpdateDocument = <T>() => {
    const queryClient = useQueryClient();

    return useMutation(updateDocument<T>, {
        onSuccess: (data, variables) => {
            
            queryClient.invalidateQueries([variables.collection, variables.documentId]);
        },
        onError: (error) => {
            console.error("Error updating document:", error);
        },
    });
};