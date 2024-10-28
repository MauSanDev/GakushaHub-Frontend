import React from "react";

const ChatDaySeparator: React.FC<{ date: string }> = ({ date }) => {
    return (
        <div className="flex items-center my-10">
            <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
            <span className="mx-4 text-sm text-gray-300 dark:text-gray-700">{date}</span>
            <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
        </div>
    );
};


export default ChatDaySeparator;