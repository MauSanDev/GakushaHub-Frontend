import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ToggleButton from './ToggleButton.tsx';

interface ShowSelectionToggleProps {
    isSelected: boolean;
    onToggle: () => void;
}

const ShowSelectionToggle: React.FC<ShowSelectionToggleProps> = ({ isSelected, onToggle }) => {
    return (
        <ToggleButton
            isSelected={isSelected}
            onToggle={onToggle}
            onSelected={{
                icon: <FaEyeSlash />,
                text: "showAll",
                className: "toggle-selected"
            }}
            onDeselected={{
                icon: <FaEye />,
                text: "showSelected",
                className: "toggle-deselected"
            }}
        />
    );
};

export default ShowSelectionToggle;