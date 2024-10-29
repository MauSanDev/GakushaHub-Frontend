import React from 'react';
import LocSpan from "../../LocSpan.tsx";

interface SectionTitleProps {
    title: string;
    className?: string;
}

const ModalTitle: React.FC<SectionTitleProps> = ({ title, className = '' }) => {
    return (
        <div className={`w-full max-w-4xl mt-2 mb-2 px-4`}>
            <h1 className={`text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 ${className}`}>
                <LocSpan textKey={title} />
            </h1>
        </div>
    );
};

export default ModalTitle;