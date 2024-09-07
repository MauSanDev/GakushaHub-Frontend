import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface OverlayModalProps {
    isVisible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const OverlayModal: React.FC<OverlayModalProps> = ({ isVisible, onClose, children }) => {
    useEffect(() => {
        if (isVisible) {
            // Añadir la clase que bloquea el scroll al abrir el modal
            document.body.style.overflow = 'hidden';
        } else {
            // Remover la clase al cerrar el modal
            document.body.style.overflow = 'auto';
        }

        // Cleanup para restaurar el estado original cuando el modal se cierra
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isVisible]);

    if (!isVisible) return null;

    const modalContent = (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 px-6 my-8">
            <div className="relative bg-white dark:bg-gray-900 p-4 lg:m-0 rounded shadow-lg w-full max-w-3xl max-h-full overflow-y-auto">
                <button
                    className="sticky top-0 right-0 mr-2 text-gray-500 hover:text-gray-700 z-10"
                    onClick={onClose}
                >
                    ✕
                </button>
                <div className="overflow-y-auto max-h-[80vh]">
                    {children}
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById("modal-root")!);
};

export default OverlayModal;