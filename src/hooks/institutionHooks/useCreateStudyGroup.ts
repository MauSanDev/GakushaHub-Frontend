import { QueryClient, useMutation, useQueryClient } from 'react-query';
import { useAuth } from "../../context/AuthContext.tsx";
import { createElement } from '../../services/dataService';
import { StudyGroupData } from '../../data/Institutions/StudyGroupData';
import { CollectionTypes } from "../../data/CollectionTypes.tsx";

interface CreateStudyGroupPayload {
    name: string;
    creatorId: string;
    institutionId: string;
    description: string;
    startDate?: string | null;
    endDate?: string | null;
    selectedTabs?: string[];
}

const createStudyGroup = async (
    { name, creatorId, institutionId, description, startDate, endDate, selectedTabs }: CreateStudyGroupPayload,
    queryClient: QueryClient
): Promise<StudyGroupData> => {
    const data: Record<string, unknown> = {
        name,
        creatorId,
        institutionId,
        description,
        fromDate: startDate || null,
        toDate: endDate || null,
        viewsEnabled: selectedTabs || [],
    };

    return await createElement(CollectionTypes.StudyGroup, data, queryClient) as StudyGroupData;
};

export const useCreateStudyGroup = () => {
    const { userData } = useAuth();
    const queryClient = useQueryClient();

    return useMutation(
        async ({ groupName, institutionId, description, startDate, endDate, selectedTabs }:
                   { groupName: string; institutionId: string; description: string; startDate?: string | null; endDate?: string | null; selectedTabs?: string[] }) => {

            if (!groupName || groupName.trim() === '') {
                throw new Error("Group name is required");
            }

            if (!userData || !userData._id) {
                throw new Error("User data not available");
            }

            if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
                throw new Error("Start date cannot be later than end date.");
            }

            return await createStudyGroup({
                name: groupName,
                creatorId: userData._id,
                institutionId,
                description,
                startDate,
                endDate,
                selectedTabs,
            }, queryClient);
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