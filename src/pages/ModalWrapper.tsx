import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import {FaArrowLeft} from "react-icons/fa";

interface ModalWrapperProps {
    onClose?: () => void;
    children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ onClose, children }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-40">
            <div
                className="relative w-11/12 md:w-80 pr-8 lg:w-1/2 h-auto p-4 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700"
                style={{ maxHeight: '90vh' }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 left-2 text-white p-2 rounded-full shadow-lg bg-gray-800 hover:bg-gray-600"
                >
                    <FaArrowLeft />
                </button>
                {children}
            </div>
        </div>,
        document.getElementById('modal-root')!
    );
};

export default ModalWrapper;