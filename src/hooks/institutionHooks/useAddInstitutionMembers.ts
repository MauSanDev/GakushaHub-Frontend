import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../../services/ApiClient';
import { useAuth } from "../../context/AuthContext.tsx";

interface MemberData {
    userId?: string;
    email: string;
    role: string;
    isActive: boolean;
}

interface AddMembersPayload {
    institutionId: string;
    emailList: string[];
    role: string;
}

const ADD_MEMBERS_ENDPOINT = '/api/institution/members/add';

const addInstitutionMembers = async ({ institutionId, emailList, role }: AddMembersPayload): Promise<MemberData[]> => {
    return await ApiClient.post<MemberData[], AddMembersPayload>(ADD_MEMBERS_ENDPOINT, { institutionId, emailList, role });
};

export const useAddInstitutionMembers = () => {
    const { userData } = useAuth();  // Fetch user data from AuthContext
    const queryClient = useQueryClient();  // Get query client for cache management

    return useMutation(
        async ({ institutionId, emailList, role }: AddMembersPayload) => {
            if (!userData || !userData._id) {
                throw new Error("User data not available");
            }

            return await addInstitutionMembers({ institutionId, emailList, role });
        },
        {
            onSuccess: (_, variables) => {
                queryClient.invalidateQueries(`institution_members_${variables.institutionId}`);
            },
            onError: (error) => {
                console.error("Error adding members to institution:", error);
            }
        }
    );
};