import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';  // Importar useNavigate
import CreateLessonModal from "../pages/CreateEmpty/CreateLessonModal.tsx";

interface AddLessonButtonProps {
    courseId: string;
    courseName: string;
}
const AddLessonButton: React.FC<AddLessonButtonProps> = ({ courseId, courseName}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const openModal = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const onSaveModal = () => {
        closeModal();
        navigate(0);
    };

    return (
        <>
            <button
                onClick={openModal}
                className="flex items-center gap-1 text-gray-700 bg-gray-300 dark:text-gray-300 dark:bg-gray-800 hover:text-white hover:bg-red-500 dark:hover:bg-green-600 px-2 py-2 rounded transition-colors duration-200 text-xs"
            >
                <FaPlus size={12} className="text-inherit transition-colors duration-75" />
            </button>

            {isModalOpen &&
                <CreateLessonModal
                    onClose={closeModal}
                    onCreateSuccess={onSaveModal}
                    courseName={courseName}
                    courseId={courseId}
                />}
        </>
    );
};

export default AddLessonButton;