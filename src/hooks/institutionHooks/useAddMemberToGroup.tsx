import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../../services/ApiClient';

export const useAddMembersToGroup = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ studyGroupId, memberIds }: { studyGroupId: string; memberIds: string[] }) => {
            return await ApiClient.post('/api/institution/studyGroup/members/add', {
                studyGroupId,
                memberIds
            });
        },
        {
            onSuccess: (_data, variables) => {
                queryClient.invalidateQueries(`studyGroup_${variables.studyGroupId}`);
            },
            onError: (error) => {
                console.error("Error adding members to group:", error);
            }
        }
    );
};