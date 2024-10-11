import React from 'react';
import BaseButton from "./BaseButton.tsx";

interface PrimaryButtonProps {
    onClick: () => void;
    label?: string;
    iconComponent?: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onClick, label, iconComponent , disabled, className}) => {

    return (
        <BaseButton
            onClick={onClick}
            label={label}
            iconComponent={iconComponent}
            disabled={disabled}
            className={`bg-blue-500 dark:bg-blue-800 text-white rounded py-2 px-4 w-full hover:bg-blue-600 dark:hover:bg-blue-700 transition-all ${className}`}
        />
    );
};

export default PrimaryButton;