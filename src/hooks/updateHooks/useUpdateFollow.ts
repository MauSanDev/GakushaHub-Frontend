import { updateList } from '../../services/dataService.ts'; 
import { useAuth } from "../../context/AuthContext.tsx";

export const useUpdateFollow = (courseId: string) => {
    const { userData, updateUserData } = useAuth();

    const updateFollow = async (addFollow: boolean) => {
        if (!userData || !userData._id) {
            console.error("User data not available");
            return;
        }

        const action = addFollow ? 'add' : 'remove'; 

        try {
            await updateList('users', userData._id, 'followedCourses', courseId, action);

            const updatedFollows = addFollow
                ? [...(userData.followedCourses || []), courseId]
                : (userData.followedCourses || []).filter((id) => id !== courseId);

            updateUserData({ followedCourses: updatedFollows });
        } catch (error) {
            console.error("Error updating followed courses:", error);
        }
    };

    return updateFollow;
};