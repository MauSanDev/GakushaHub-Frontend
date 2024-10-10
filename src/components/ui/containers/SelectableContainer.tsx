import React, { ReactNode } from 'react';
import Container from "./Container.tsx";
import { FaCheck } from 'react-icons/fa';

interface SelectableContainerProps {
    children: ReactNode;
    className?: string;
    isSelected: boolean;
    onClick?: () => void;
}

const SelectableContainer: React.FC<SelectableContainerProps> = ({ children, className = '', isSelected, onClick }) => {
    return (
        <Container
            className={`${isSelected ? 'container-selected' : 'container-unselected'} ${className} relative`}
            onClick={onClick}
        >
            <div
                className={`absolute top-2 right-2 w-6 h-6 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 ${
                    isSelected ? 'text-green-500' : ''
                }`}
            >
                {isSelected && <FaCheck />}
            </div>

            {children}
        </Container>
    );
};

export default SelectableContainer;