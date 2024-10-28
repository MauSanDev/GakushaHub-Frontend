import React from 'react';
import BaseButton from "./BaseButton.tsx";
import {FaArrowLeft} from "react-icons/fa";

interface BackButtonProps {
    onClick: () => void;
    className?: string;
    disabled?: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, disabled, className}) => {

    return (
        <BaseButton
            onClick={onClick}
            iconComponent={<FaArrowLeft />}
            disabled={disabled}
            className={`bg-blue-500 dark:bg-gray-700 text-white p-2 rounded-full transition-all shadow hover:bg-blue-600 dark:hover:bg-gray-600 mr-4 ${className}`}
        />
    );
};

export default BackButton;