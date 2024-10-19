import React, { useState } from 'react';
import { FaSave} from 'react-icons/fa';
import SaveDeckModal from "./SaveDeckInput/SaveDeckModal.tsx";

const SaveDeckButton: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>

            <button onClick={openModal} className={`w-full flex gap-2 items-center justify-center px-4 py-2 mt-2 rounded bg-gray-300 dark:bg-gray-600 text-gray-400 cursor-not-allowed hover:bg-blue-600 dark:hover:bg-blue-600 transition-transform duration-300`}>
                <FaSave/> Save
            </button>
            

            {isModalOpen &&
                <SaveDeckModal
                    onClose={closeModal}
                    // courseId={"courseId"}
                    courseName={"courseName"}
                    lessonName={"lessonName"}
                    deckName={"deckName"}
                />}
        </>
    );
};

export default SaveDeckButton;