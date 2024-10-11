import React, { ReactNode } from 'react';
import SectionTitle from '../text/SectionTitle.tsx';
import LoadingScreen from '../../LoadingScreen.tsx';

interface SectionContainerProps {
    title?: string;
    children: ReactNode;
    isLoading?: boolean;
    error?: string;  
    className?: string;
}

const SectionContainer: React.FC<SectionContainerProps> = ({ title, children, isLoading = false, error = '', className = '' }) => {
    return (
        <div className={`flex-1 flex mt-6 flex-col items-center justify-start h-full w-full relative overflow-y-auto ${className}`}>
            {title && <SectionTitle title={title} /> }

            {isLoading && <LoadingScreen isLoading={isLoading} />}

            {error ? (
                <p className="text-red-500">{error}</p>  
            ) : (
                children
            )}
        </div>
    );
};

export default SectionContainer;