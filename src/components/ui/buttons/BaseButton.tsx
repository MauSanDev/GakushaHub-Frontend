import React from 'react';
import LocSpan from "../../LocSpan.tsx";

interface BaseButtonProps {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    label?: string;
    value?: string;
    iconComponent?: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

const BaseButton: React.FC<BaseButtonProps> = ({ onClick, label, value, iconComponent, className = '', disabled }) => {

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        onClick(event);
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className={`flex justify-center items-center gap-2 text-center ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {iconComponent && <span>{iconComponent}</span>}
            {label && (
                <span>
                    <LocSpan textKey={label} />
                    {value && (
                        <>
                            {`: `}
                            <LocSpan textKey={value} />
                        </>
                    )}
                </span>
            )}
        </button>
    );
};

export default BaseButton;