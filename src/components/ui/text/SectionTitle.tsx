import React from 'react';

interface SectionTitleProps {
    title: string;
    className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, className = '' }) => {
    return (
        <div className={`lg:pl-0 pl-20 w-full max-w-4xl mt-8 mb-2 px-4`}>
            <h1 className={`text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 capitalize ${className}`}>
                {title}
            </h1>
        </div>
    );
};

export default SectionTitle;