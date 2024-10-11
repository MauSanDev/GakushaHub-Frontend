import React from 'react';
import LocSpan from "../../LocSpan.tsx";

interface TabToggleProps {
    isSelected: boolean;
    onToggle: () => void;
    onSelected: {
        icon?: React.ReactNode;
        text: string;
        className?: string;
    };
    onDeselected: {
        icon?: React.ReactNode;
        text: string;
        className?: string;
    };
}

const TabToggle: React.FC<TabToggleProps> = ({
                                                 isSelected,
                                                 onToggle,
                                                 onSelected,
                                                 onDeselected,
                                             }) => {
    const currentState = isSelected ? onSelected : onDeselected;

    return (
        <button
            onClick={onToggle}
            className={`${currentState.className} flex items-center gap-2 px-4 py-2 rounded lg:text-sm text-xs transition-all`}
        >
            {currentState.icon}
            <LocSpan textKey={currentState.text} />
        </button>
    );
};

export default TabToggle;