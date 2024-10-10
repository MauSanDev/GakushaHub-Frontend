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
                text: "Show All",
                className: "toggle-selected"
            }}
            onDeselected={{
                icon: <FaEye />,
                text: "Show Selected",
                className: "toggle-deselected"
            }}
        />
    );
};

export default ShowSelectionToggle;