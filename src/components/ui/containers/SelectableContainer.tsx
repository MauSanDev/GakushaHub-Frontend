import React, { ReactNode } from 'react';
import Container from "./Container.tsx";

interface SelectableContainerProps {
    children: ReactNode;
    className?: string;
    isSelected: boolean;
    onClick?: () => void;
}

const SelectableContainer: React.FC<SelectableContainerProps> = ({ children, className = '', isSelected, onClick }) => {
    return (
        <Container
            className={`${isSelected ? 'container-selected' : 'container-unselected'} ${className}`}
            onClick={onClick}
        >
            {children}
        </Container>
    );
};

export default SelectableContainer;