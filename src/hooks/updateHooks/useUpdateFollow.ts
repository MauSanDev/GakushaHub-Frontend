import { updateList } from '../../services/dataService.ts';
import { useAuth } from "../../context/AuthContext.tsx";
import {useQueryClient} from "react-query";

export const useUpdateFollow = (courseId: string) => {
    const { userData, updateUserData } = useAuth();
    const queryClient = useQueryClient();

    const updateFollow = async (isFollowing: boolean) => {
        if (!userData || !userData._id) {
            console.error("User data not available");
            return;
        }

        const action = isFollowing ? 'remove' : 'add';

        try {
            await updateList("auth/userInfo", userData._id, 'followedCourses', [courseId], action, queryClient);

            const updatedFollows = action === 'add'
                ? [...(userData.followedCourses || []), courseId]
                : (userData.followedCourses || []).filter((id) => id !== courseId);

            updateUserData({ followedCourses: updatedFollows });
        } catch (error) {
            console.error("Error updating followed courses:", error);
        }
    };

    return updateFollow;
};