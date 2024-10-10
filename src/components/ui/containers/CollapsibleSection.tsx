import React, { useState, ReactNode, MouseEvent } from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import LocSpan from "../../LocSpan.tsx";

interface CollapsibleSectionProps {
    title: string;
    children: ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setIsOpen(!isOpen);
    };

    return (
        <div onClick={handleToggle}>
            <div className="flex items-center cursor-pointer text-black dark:text-white font-semibold">
                <span className="mr-2">
                    {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                </span>
                <LocSpan textKey={title} />
            </div>

            <div
                className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
                    isOpen ? 'max-h-[1000px]' : 'max-h-0'
                }`}
            >
                {children}
            </div>
        </div>
    );
};

export default CollapsibleSection;