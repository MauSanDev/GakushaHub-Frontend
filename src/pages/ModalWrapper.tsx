import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FaArrowLeft } from "react-icons/fa";

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
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-40 overflow-y-auto">
            <div
                className="relative w-11/12 md:w-80 lg:w-1/2 h-auto p-4 flex flex-col max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700"
                style={{ paddingLeft: '1rem' }}
            >
                <div className="relative">
                    <button
                        onClick={onClose}
                        className="relative text-xl text-white p-2 rounded-full shadow-lg bg-gray-800 hover:bg-gray-600 z-10"
                    >
                        <FaArrowLeft />
                    </button>
                </div>

                <div className="relative z-0 w-full flex justify-center items-center">
                    {children}
                </div>
            </div>
        </div>,
        document.getElementById('modal-root')!
    );
};

export default ModalWrapper;