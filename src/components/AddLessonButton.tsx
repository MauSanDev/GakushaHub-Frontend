import React, { useState } from 'react';
import {FaPlus} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CreateLessonModal from "../pages/CreateEmpty/CreateLessonModal.tsx";
import TertiaryButton from "./ui/buttons/TertiaryButton.tsx";

interface AddLessonButtonProps {
    courseId: string;
    courseName: string;
}
const AddLessonButton: React.FC<AddLessonButtonProps> = ({ courseId, courseName}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

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
            <TertiaryButton onClick={openModal} iconComponent={<FaPlus />} className={"hover:bg-green-600 hover:dark:bg-green-600"} />

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