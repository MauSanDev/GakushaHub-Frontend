import React from 'react';

interface ChatMessageBoxProps {
    userName: string;
    avatarUrl: string;
    message: string;
    timestamp: string;
    isUser: boolean
}

const ChatMessageBox: React.FC<ChatMessageBoxProps> = ({ userName, avatarUrl, message, timestamp, isUser }) => {
    return (
        <div className={`flex justify-start ${isUser ? `justify-end` : ``}`}>
            <div className={`flex items-start gap-1 ${isUser ? `flex-row-reverse` : ``}`}>
                <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-800"
                />
                <div className={`px-3 py-2 rounded-lg ${isUser ? `dark:bg-blue-700 dark:bg-opacity-40 text-right bg-blue-500` : `dark:bg-gray-800 dark:text-gray-300 bg-gray-100 text-gray-500`}`}>
                    <div className={`flex gap-2 ${isUser ? `flex-row-reverse` : ``}`}>
                        <span  className="font-bold text-sm">{userName}</span>
                        <span className="text-xs text-gray-400 mt-1">{timestamp.slice(11)}</span>
                    </div>
                    <div className="text-sm">{message}</div>
                </div>
            </div>
        </div>
    );
};

export default ChatMessageBox;