import React from 'react';
import BaseButton from "./BaseButton.tsx";

interface TertiaryButtonProps {
    onClick: () => void;
    label?: string;
    iconComponent?: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

const TertiaryButton: React.FC<TertiaryButtonProps> = ({ onClick, label, iconComponent, className = '', disabled }) => {

    return (
        <BaseButton
            onClick={onClick}
            label={label}
            iconComponent={iconComponent}
            disabled={disabled}
            className={`bg-blue-500 text-xs text-white p-2 rounded shadow hover:bg-blue-400 dark:bg-gray-950 hover:dark:bg-gray-800 flex items-center transition-all ${className}`}
        />
    );
};

export default TertiaryButton;