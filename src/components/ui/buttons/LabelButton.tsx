import React from 'react';
import BaseButton from "./BaseButton.tsx";

interface LabelButtonProps {
    onClick: () => void;
    label?: string;
    value?: string;
    iconComponent?: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

const LabelButton: React.FC<LabelButtonProps> = ({ onClick, label, iconComponent , disabled, className, value}) => {

    return (
        <BaseButton
            onClick={onClick}
            label={label}
            iconComponent={iconComponent}
            disabled={disabled}
            value={value}
            className={`text-xs text-left text-white py-2 px-4 w-full hover:bg-blue-600 dark:hover:bg-gray-700 transition-all ${className}`}
        />
    );
};

export default LabelButton;