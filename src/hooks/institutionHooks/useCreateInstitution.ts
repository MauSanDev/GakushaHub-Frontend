import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../../services/ApiClient';
import { useAuth } from "../../context/AuthContext.tsx";

const CREATE_INSTITUTION_ENDPOINT = '/api/institution/create';

const createInstitution = async (name: string, creatorId: string, description: string): Promise<any> => {
    return await ApiClient.post(CREATE_INSTITUTION_ENDPOINT, { name, creatorId, description });
};

export const useCreateInstitution = () => {
    const { userData } = useAuth();  // Fetch user data from AuthContext
    const queryClient = useQueryClient();  // Get query client for cache management

    return useMutation(
        async ({ name, description }: { name: string; description: string }) => {
            if (!userData || !userData._id) {
                throw new Error("User data not available");
            }
            return await createInstitution(name, userData._id, description);
        },
        {
            onSuccess: (institution) => {
                // Invalidate queries related to institutions to refresh the list
                queryClient.invalidateQueries('institutions');
                queryClient.invalidateQueries(`institution_${institution._id}`);
            },
            onError: (error) => {
                console.error("Error creating institution:", error);
            }
        }
    );
};