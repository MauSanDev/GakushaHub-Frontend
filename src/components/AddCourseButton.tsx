import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CreateCourseModal from "../pages/CreateEmpty/CreateCourseModal.tsx";
import PrimaryButton from "./ui/buttons/PrimaryButton.tsx";

interface AddCourseButtonProps {
    institutionId?: string
}

const AddCourseButton: React.FC<AddCourseButtonProps> = ({ institutionId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const onSaveModal = (courseId: string) => {
        closeModal();
        navigate(`/courses/${courseId}`);
    };

    return (
        <>
            <PrimaryButton label={"coursesListPage.createCourse"} className="text-xs" onClick={openModal} iconComponent={<FaPlus />}/>

            {isModalOpen &&
                <CreateCourseModal
                    onClose={closeModal}
                    onCreateSuccess={onSaveModal}
                    institutionId={institutionId}
                />}
        </>
    );
};

export default AddCourseButton;