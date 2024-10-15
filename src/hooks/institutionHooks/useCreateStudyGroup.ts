import { useMutation, useQueryClient } from 'react-query';
import { useAuth } from "../../context/AuthContext.tsx";
import { createElement } from '../../services/dataService';
import { StudyGroupData } from '../../data/Institutions/StudyGroupData';
import { CollectionTypes } from "../../data/CollectionTypes.tsx";

interface CreateStudyGroupPayload {
    name: string;
    creatorId: string;
    institutionId: string;
    description: string;
}

const createStudyGroup = async ({ name, creatorId, institutionId, description }: CreateStudyGroupPayload): Promise<StudyGroupData> => {
    const data: Record<string, unknown> = {
        name,
        creatorId,
        institutionId,
        description,
    };

    return await createElement(CollectionTypes.StudyGroup, data) as StudyGroupData;
};

export const useCreateStudyGroup = () => {
    const { userData } = useAuth();
    const queryClient = useQueryClient();

    return useMutation(
        async ({ groupName, institutionId, description }: { groupName: string; institutionId: string; description: string }) => {
            
            if (!groupName || groupName.trim() === '') {
                throw new Error("Group name is required");
            }
            
            if (!userData || !userData._id) {
                throw new Error("User data not available");
            }
            
            return await createStudyGroup({
                name: groupName,
                creatorId: userData._id,
                institutionId,
                description,
            });
        },
        {
            onSuccess: (studyGroup: StudyGroupData) => {
                queryClient.invalidateQueries(`studyGroups_${studyGroup.institutionId}`);
            },
            onError: (error) => {
                console.error("Error creating study group:", error);
            },
        }
    );
};