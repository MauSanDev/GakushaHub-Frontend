import { useUpdateDocument } from './useUpdateDocument';
import { useAuth } from "../../context/AuthContext.tsx";
// import {FOLLOWED_COURSES_ENDPOINT} from "../coursesHooks/useFollowedCourses.ts";

interface UpdateFollowParams {
    $push?: { followedCourses: string };
    $pull?: { followedCourses: string };
}

export const useUpdateFollow = (courseId: string) => {
    const updateDocument = useUpdateDocument<UpdateFollowParams>();
    const { userData, updateUserData } = useAuth();


    const updateFollow = (addFollow: boolean) => {
        if (!userData || !userData._id) {
            console.error("User data not available");
            return;
        }

        const updateData = addFollow
            ? { $push: { followedCourses: courseId } }
            : { $pull: { followedCourses: courseId } };

        updateDocument.mutate(
            {
                collection: 'users',
                documentId: userData._id,
                updateData,
            },
            {
                onSuccess: () => {
                    const updatedFollows = addFollow
                        ? [...(userData.followedCourses || []), courseId]
                        : (userData.followedCourses || []).filter((id) => id !== courseId);

                    // queryClient.invalidateQueries(FOLLOWED_COURSES_ENDPOINT)
                    updateUserData({ followedCourses: updatedFollows });
                },
                onError: (error) => {
                    console.error("Error updating followed courses:", error);
                },
            }
        );
    };

    return updateFollow;
};