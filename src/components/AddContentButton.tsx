import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';  // Importar useNavigate
import SearchModal from '../pages/SearchPage/SearchModal';

interface AddContentButtonProps {
    creatorId: string;
    courseId?: string;
    courseName?: string;
    lessonName?: string;
    deckName?: string;
}

const AddContentButton: React.FC<AddContentButtonProps> = ({ creatorId, courseId, courseName, lessonName, deckName }) => {
    const { user, userData } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();  

    if (!user || (creatorId && userData?._id != creatorId)) return null;

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
                className="flex items-center gap-1 text-gray-700 bg-gray-300 dark:text-gray-300 dark:bg-gray-950 hover:text-white hover:bg-red-500 dark:hover:bg-green-600 px-2 py-2 rounded transition-colors duration-200 text-sm"
            >
                <FaPlus size={12} className="text-inherit transition-colors duration-75" />
            </button>

            {isModalOpen &&
                <SearchModal
                    onClose={closeModal}
                    courseId={courseId}
                    courseName={courseName}
                    lessonName={lessonName}
                    deckName={deckName}
                    onSaveSuccess={onSaveModal}  
                />}
        </>
    );
};

export default AddContentButton;