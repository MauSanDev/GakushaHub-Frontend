import { updateList } from '../../services/dataService.ts';
import { useAuth } from "../../context/AuthContext.tsx";
import { useQueryClient } from "react-query";
import {CollectionTypes} from "../../data/CollectionTypes.tsx";

export const useAddCourseToGroup = (studyGroupId: string) => {
    const { userData } = useAuth();
    const queryClient = useQueryClient();

    const addCoursesToGroup = async (courseIds: string[]) => {
        if (!userData || !userData._id) {
            console.error("User data not available");
            return;
        }

        try {
            await updateList(
                CollectionTypes.StudyGroup,
                studyGroupId,
                'courseIds',
                courseIds,
                'add',
                queryClient
            );
        } catch (error) {
            console.error("Error adding courses to group:", error);
        }
    };

    return addCoursesToGroup;
};