import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';  // Importar useNavigate
import SearchModal from '../pages/SearchPage/SearchModal';
import TertiaryButton from "./ui/buttons/TertiaryButton.tsx";

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

    const openModal = () => {
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
            <TertiaryButton iconComponent={<FaPlus />} onClick={openModal} className={"hover:bg-green-600 hover:dark:bg-green-600"}/>

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