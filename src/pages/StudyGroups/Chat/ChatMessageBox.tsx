import React, {useEffect} from 'react';
import {useAuth} from "../../../context/AuthContext.tsx";
import {useUserInfo} from "../../../hooks/newHooks/Courses/useUserInfo.ts";

interface ChatMessageBoxProps {
    userId: string;
    avatarUrl: string;
    message: string;
    timestamp: string;
}

const ChatMessageBox: React.FC<ChatMessageBoxProps> = ({ userId, avatarUrl, message, timestamp }) => {
    const { userData } = useAuth();
    const { fetchUserInfo, data: userInfo } = useUserInfo([userId]);

    useEffect(() => {
        fetchUserInfo();
    }, [userId]);

    const isFromUser = userId === userData?._id;
    
    return (
        <div className={`flex justify-start ${isFromUser ? `justify-end` : ``}`}>
            <div className={`flex items-start gap-1 ${isFromUser ? `flex-row-reverse` : ``}`}>
                <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-800"
                />
                <div className={`px-3 py-2 rounded-lg ${isFromUser ? `dark:bg-blue-700 dark:bg-opacity-40 text-right bg-blue-500` : `dark:bg-gray-800 dark:text-gray-300 bg-gray-100 text-gray-500`}`}>
                    <div className={`flex gap-2 ${isFromUser ? `flex-row-reverse` : ``}`}>
                        <span  className="font-bold text-sm">{isFromUser ? userData?.name : userInfo?.[userId].name}</span>
                        <span className="text-xs text-gray-400 mt-1">
    {new Date(timestamp).getHours().toString().padStart(2, '0')}:
                            {new Date(timestamp).getMinutes().toString().padStart(2, '0')}
</span></div>
                    <div className="text-sm">{message}</div>
                </div>
            </div>
        </div>
    );
};

export default ChatMessageBox;