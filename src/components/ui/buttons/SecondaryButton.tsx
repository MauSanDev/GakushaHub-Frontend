import React from 'react';
import LocSpan from "../../LocSpan.tsx";

interface SecondaryButtonProps {
    onClick: () => void;
    label?: string;
    IconComponent?: React.ReactNode;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({ onClick, label, IconComponent }) => {
    return (
        <button
            onClick={onClick}
            className="flex justify-center text-center text-xs border dark:border-gray-700 rounded-full px-3 py-2 transition-all duration-300 transform lg:hover:scale-105 hover:shadow-md items-center gap-2 bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-blue-300 hover:text-white"
        >
            {IconComponent && <span>{IconComponent}</span>}
            {label && <LocSpan textKey={label}/>}
        </button>
    );
};

export default SecondaryButton;