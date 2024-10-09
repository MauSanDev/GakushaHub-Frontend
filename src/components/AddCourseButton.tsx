import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CreateCourseModal from "../pages/CreateEmpty/CreateCourseModal.tsx";
import LocSpan from "./LocSpan.tsx";

const AddCourseButton: React.FC = () => {
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
                className="text-center justify-center flex items-center text-gray-700 bg-gray-300 dark:text-gray-300 dark:bg-blue-800 hover:text-white hover:bg-red-500 dark:hover:bg-blue-600 px-4 py-3 rounded transition-colors duration-200 text-xs"
            >
                <FaPlus size={12} className="text-inherit transition-colors duration-75" />
                <LocSpan textKey={"coursesListPage.createCourse"} />
            </button>

            {isModalOpen &&
                <CreateCourseModal
                    onClose={closeModal}
                    onCreateSuccess={onSaveModal}
                />}
        </>
    );
};

export default AddCourseButton;