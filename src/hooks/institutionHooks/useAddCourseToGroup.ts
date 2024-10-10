import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../../services/ApiClient';

export const useAddCourseToGroup = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ studyGroupId, courseIds }: { studyGroupId: string; courseIds: string[] }) => {
            return await ApiClient.post('/api/institution/studyGroup/courses/add', {
                studyGroupId,
                courseIds
            });
        },
        {
            onSuccess: (_data, variables) => {
                queryClient.invalidateQueries(`studyGroup_${variables.studyGroupId}`);
            },
            onError: (error) => {
                console.error("Error adding courses to group:", error);
            }
        }
    );
};