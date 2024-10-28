import React from 'react';
import LocSpan from "../../LocSpan.tsx";

interface ToggleStateProps {
    icon?: React.ReactNode;   
    text: string;             
    className?: string;       
}

interface ToggleButtonProps {
    isSelected: boolean;
    onToggle: () => void;
    onSelected: ToggleStateProps;
    onDeselected: ToggleStateProps;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
                                                       isSelected,
                                                       onToggle,
                                                       onSelected,
                                                       onDeselected,
                                                   }) => {
    const currentState = isSelected ? onSelected : onDeselected;

    return (
        <button
            onClick={onToggle}
            className={`${currentState.className} flex items-center gap-2`}
        >
            {currentState.icon}
            <LocSpan textKey={currentState.text} />
        </button>
    );
};

export default ToggleButton;