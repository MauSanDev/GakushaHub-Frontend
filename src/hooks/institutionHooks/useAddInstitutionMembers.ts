import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../../services/ApiClient';
import { useAuth } from "../../context/AuthContext.tsx";
import {MembershipData} from "../../data/MembershipData.ts";

interface AddMembersPayload {
    institutionId: string;
    emailList: string[];
    role: string;
}

const ADD_MEMBERS_ENDPOINT = '/api/membership/create';

const addInstitutionMembers = async ({ institutionId, emailList, role }: AddMembersPayload): Promise<MembershipData[]> => {
    return await ApiClient.post<MembershipData[], AddMembersPayload>(ADD_MEMBERS_ENDPOINT, { institutionId, emailList, role });
};

export const useAddInstitutionMembers = () => {
    const { userData } = useAuth();  
    const queryClient = useQueryClient();  

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