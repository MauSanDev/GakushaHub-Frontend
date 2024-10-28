import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import BackButton from "../components/ui/buttons/BackButton.tsx";

interface ModalWrapperProps {
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ onClose, children,className }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return ReactDOM.createPortal(
        <div className={`fixed inset-0 bg-white dark:bg-black bg-opacity-90 flex items-center justify-center z-40 overflow-y-auto ${className}`}>
            <div
                className="relative w-11/12 md:w-80 lg:w-1/2 h-auto p-4 flex flex-col max-h-[100vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700"
                style={{paddingLeft: '1rem'}}
            >
                <div className="relative ">
                    <BackButton onClick={onClose}/>
                </div>

                <div className="pt-3 max-w-5xl h-[80vh]">
                    <div className="relative z-0 w-full flex-col flex justify-center items-center">
                        {children}
                    </div>
                </div>
            </div>
        </div>,
        document.getElementById('modal-root')!
    );
};

export default ModalWrapper;