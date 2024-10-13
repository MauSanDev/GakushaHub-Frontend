import React from 'react';

interface DeckToggleProps {
    isSelected: boolean;
    onToggle: () => void;
    icon: React.ReactNode;
    selectedColor: string;
}

const DeckToggle: React.FC<DeckToggleProps> = ({
                                                   isSelected,
                                                   onToggle,
                                                   icon,
                                                   selectedColor,
                                               }) => {
    const buttonColor = isSelected ? selectedColor : "bg-gray-200 dark:bg-gray-800";

    return (
        <button
            onClick={onToggle}
            className={`p-1 rounded transition-colors duration-300 ${buttonColor}`}
        >
            {icon}
        </button>
    );
};

export default DeckToggle;