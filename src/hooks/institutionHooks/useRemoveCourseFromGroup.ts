import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../../services/ApiClient';

export const useRemoveCoursesFromGroup = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ studyGroupId, courseIds }: { studyGroupId: string; courseIds: string[] }) => {
            return await ApiClient.post('/api/institution/studyGroup/courses/remove', {
                studyGroupId,
                courseIds
            });
        },
        {
            onSuccess: (_data, variables) => {
                // Invalidar los queries relacionados al grupo de estudio
                queryClient.invalidateQueries(`studyGroup_${variables.studyGroupId}`);
            },
            onError: (error) => {
                console.error("Error removing courses from group:", error);
            }
        }
    );
};