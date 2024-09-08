import React from 'react';
import loadingIcon from '../../assets/loading-icon.svg';
import ReactDOM from "react-dom";

interface LoadingScreenProps {
    isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
    if (!isLoading) return null;

    const modalContent = (
        <div className="absolute inset-0 flex justify-center items-center bg-white dark:bg-black dark:bg-opacity-60 bg-opacity-50 z-10 transition-opacity duration-500">
            <img src={loadingIcon} alt="Loading..." className="w-16 h-16" />
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById("modal-root")!);

};

export default LoadingScreen;