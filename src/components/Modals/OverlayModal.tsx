import React from 'react';
import ReactDOM from 'react-dom';

interface OverlayModalProps {
    isVisible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const OverlayModal: React.FC<OverlayModalProps> = ({ isVisible, onClose, children }) => {
    if (!isVisible) return null;

    const modalContent = (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-white dark:bg-gray-900 p-4 rounded shadow-lg w-full max-w-3xl">
                <button
                    className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById("modal-root")!);
};

export default OverlayModal;