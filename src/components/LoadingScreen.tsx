import React from 'react';
import loadingIcon from '../assets/loading-icon.svg';

interface LoadingScreenProps {
    isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className="absolute inset-0 flex justify-center items-center bg-white dark:bg-black dark:bg-opacity-60 bg-opacity-50 z-10">
            <img src={loadingIcon} alt="Loading..." className="w-16 h-16" />
        </div>
    );
};

export default LoadingScreen;