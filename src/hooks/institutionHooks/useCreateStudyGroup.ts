import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../../services/ApiClient';
import { useAuth } from "../../context/AuthContext.tsx";
import { StudyGroupData } from '../../data/Institutions/StudyGroupData';

const CREATE_STUDY_GROUP_ENDPOINT = '/api/institution/studyGroup/add';

const createStudyGroup = async (
    institutionId: string,
    creatorId: string,
    groupName: string,
    description: string
): Promise<StudyGroupData> => {  
    return await ApiClient.post<StudyGroupData, { institutionId: string; creatorId: string; groupName: string; description: string }>(
        CREATE_STUDY_GROUP_ENDPOINT,
        { institutionId, creatorId, groupName, description }
    );
};

export const useCreateStudyGroup = () => {
    const { userData } = useAuth();  
    const queryClient = useQueryClient();  

    return useMutation(
        async ({ institutionId, groupName, description }: { institutionId: string; groupName: string; description: string }) => {
            if (!userData || !userData._id) {
                throw new Error("User data not available");
            }
            return await createStudyGroup(institutionId, userData._id, groupName, description);
        },
        {
            onSuccess: (studyGroup: StudyGroupData) => {
                
                queryClient.invalidateQueries(`studyGroups_${studyGroup.institutionId}`);
            },
            onError: (error) => {
                console.error("Error creating study group:", error);
            }
        }
    );
};