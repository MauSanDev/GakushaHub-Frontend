import React from 'react';
import LocSpan from "./LocSpan.tsx";

interface DottedBoxProps {
    title: string;
    description: string;
    onClick: () => void;
}

const DottedBox: React.FC<DottedBoxProps> = ({ title, description, onClick }) => {
    return (
        <div
            className="p-6 my-10 border-2 border-dashed border-gray-400 dark:border-gray-600 hover:dark:border-green-800 hover:border-green-700 rounded-lg shadow-md text-center cursor-pointer transition-all hover:bg-green-100 dark:hover:bg-green-950 flex items-center justify-center h-48 text-gray-600 dark:text-gray-400 hover:dark:text-green-400 hover:text-green-700"
            onClick={onClick}
        >
            <p className="mb-4 text-xl">
                <LocSpan textKey={title} />
                <br />
                <LocSpan textKey={description} />
            </p>
        </div>
    );
};

export default DottedBox;