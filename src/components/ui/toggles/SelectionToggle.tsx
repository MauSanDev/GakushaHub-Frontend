import React from 'react';
import { FaCheckSquare, FaSquare } from 'react-icons/fa';
import ToggleButton from './ToggleButton.tsx';

interface SelectionToggleProps {
    isSelected: boolean;
    onToggle: () => void;
    textKey: string; 
}

const SelectionToggle: React.FC<SelectionToggleProps> = ({ isSelected, onToggle, textKey }) => {
    return (
        <ToggleButton
            isSelected={isSelected}
            onToggle={onToggle}
            onSelected={{
                icon: <FaCheckSquare className="text-white" />,
                text:textKey,
                className: "selection-toggle-selected bg-blue-500 dark:bg-blue-800 text-white border border-blue-500 dark:border-gray-900"
            }}
            onDeselected={{
                icon: <FaSquare className="text-gray-300" />,
                text:textKey,
                className: "selection-toggle-deselected border dark:border-gray-600 dark:text-gray-300 border-gray-300 text-gray-500"
            }}
        />
    );
};

export default SelectionToggle;