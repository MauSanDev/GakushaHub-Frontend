import React, { useState } from 'react';
import {FaPlus} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CreateLessonModal from "../pages/CreateEmpty/CreateLessonModal.tsx";
import TertiaryButton from "./ui/buttons/TertiaryButton.tsx";
import DottedBox from "./DottedBox.tsx";

interface AddLessonButtonProps {
    courseId: string;
    courseName: string;
    useDottedBox?: boolean;
}
const AddLessonButton: React.FC<AddLessonButtonProps> = ({ courseId, courseName, useDottedBox}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const onSaveModal = (lessonId: string) => {
        closeModal();
        navigate(`/courses/${courseId}/${lessonId}`);
        navigate(0);
    };

    return (
        <>
            {useDottedBox ?
                <DottedBox onClick={openModal} title={"There's no content yet."} description={'Click here to Add'}/>
                :
                <TertiaryButton onClick={openModal} iconComponent={<FaPlus />} className={"hover:bg-green-600 hover:dark:bg-green-600"} />
            }
            
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