import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../../services/ApiClient';

interface ChangeMembershipStatusParams {
    membershipId: string;
    newStatus: 'approved' | 'rejected' | 'pending';
}

export const useChangeMembershipStatus = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ membershipId, newStatus }: ChangeMembershipStatusParams) => {
            return await ApiClient.post('/api/membership/changeStatus', {
                membershipId,
                newStatus,
            });
        },
        {
            onSuccess: () => {
                // Invalidar los queries relacionados a la lista de memberships
                queryClient.invalidateQueries('myMemberships');
            },
            onError: (error) => {
                console.error("Error changing membership status:", error);
            }
        }
    );
};