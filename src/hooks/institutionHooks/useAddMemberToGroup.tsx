import { updateList } from '../../services/dataService.ts';
import { useAuth } from "../../context/AuthContext.tsx";
import { useQueryClient } from "react-query";
import {CollectionTypes} from "../../data/CollectionTypes.tsx";

export const useAddMembersToGroup = (studyGroupId: string) => {
    const { userData } = useAuth();
    const queryClient = useQueryClient();

    const addMembersToGroup = async (memberIds: string[]) => {
        if (!userData || !userData._id) {
            console.error("User data not available");
            return;
        }

        try {
            await updateList(
                CollectionTypes.StudyGroup,
                studyGroupId,
                'memberIds',
                memberIds,
                'add',
                queryClient
            );

            // Invalidar la cache para actualizar los datos del grupo de estudio
            queryClient.invalidateQueries(`studyGroup_${studyGroupId}`);
        } catch (error) {
            console.error("Error adding members to group:", error);
        }
    };

    return addMembersToGroup;
};