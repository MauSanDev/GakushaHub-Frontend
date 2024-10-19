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
        <div className={`mt-5  max-w-4xl flex-1 flex flex-col items-center justify-start h-screen w-full relative overflow-hidden ${className}`}>
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