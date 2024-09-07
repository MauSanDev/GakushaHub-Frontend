import React, { useState, useEffect } from 'react';
import { FaBookmark } from "react-icons/fa";
import { useUpdateFollow } from '../hooks/updateHooks/useUpdateFollow';
import { useAuth } from "../context/AuthContext.tsx";

interface FollowButtonProps {
    courseId: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ courseId }) => {
    const { userData } = useAuth();
    const [isFollowing, setIsFollowing] = useState(false);
    const updateFollow = useUpdateFollow(courseId);

    useEffect(() => {
        if (userData?.followedCourses?.includes(courseId)) {
            setIsFollowing(true);
        }
    }, [userData, courseId]);

    const toggleFollow = () => {
        updateFollow(!isFollowing);
        setIsFollowing((prevState) => !prevState);
    };

    return (
        <button
            onClick={toggleFollow}
            className={`flex text-xs px-3 items-center p-1 rounded-full shadow transition-colors duration-300 ${
                isFollowing ? 'bg-red-500 text-white font-bold' : 'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
            }`}
        >
            <FaBookmark className={`mr-1 ${isFollowing ? 'text-white' : 'text-gray-500'}`} />
            {isFollowing ? 'Following' : 'Follow'}
        </button>
    );
};

export default FollowButton;