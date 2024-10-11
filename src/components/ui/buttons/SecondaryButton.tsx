import React from 'react';
import BaseButton from "./BaseButton.tsx";

interface SecondaryButtonProps {
    onClick: () => void;
    label?: string;
    iconComponent?: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({ onClick, label, iconComponent , disabled, className}) => {
    return (
        <BaseButton
            onClick={onClick}
            label={label}
            iconComponent={iconComponent}
            disabled={disabled}
            className={`text-xs border dark:border-gray-700 rounded-full px-3 py-2 transition-all duration-300 transform lg:hover:scale-105 hover:shadow-md bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-blue-300 hover:text-white ${className}`}
        />
    );
};

export default SecondaryButton;