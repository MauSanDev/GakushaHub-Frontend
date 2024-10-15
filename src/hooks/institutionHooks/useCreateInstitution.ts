import { useMutation, useQueryClient, QueryClient } from 'react-query';
import { useAuth } from "../../context/AuthContext.tsx";
import { createElement } from '../../services/dataService';
import { CollectionTypes } from "../../data/CollectionTypes.tsx";
import { InstitutionData } from '../../data/Institutions/InstitutionData.ts';

interface CreateInstitutionPayload {
    name: string;
    creatorId: string;
    description: string;
}

const createNewInstitution = async ({ name, creatorId, description }: CreateInstitutionPayload, queryClient: QueryClient): Promise<InstitutionData> => {
    const data: Record<string, unknown> = {
        name,
        creatorId,
        description
    };

    return await createElement(CollectionTypes.Institution, data, queryClient) as InstitutionData;
};

export const useCreateInstitution = () => {
    const { userData } = useAuth();
    const queryClient = useQueryClient();

    return useMutation(
        async ({ name, description }: { name: string; description: string }) => {
            if (!name || name.trim() === '') {
                throw new Error("Institution name is required");
            }

            if (!userData || !userData._id) {
                throw new Error("User data not available");
            }

            return await createNewInstitution({
                name,
                creatorId: userData._id,
                description,
            }, queryClient);
        },
        {
            onError: (error) => {
                console.error("Error creating institution:", error);
            }
        }
    );
};