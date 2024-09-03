import React, { useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import NewGenerationPage from "./NewGenerationPage.tsx";

const GenerationButton: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <button
                onClick={handleOpenModal}
                className="bg-purple-500 text-xs text-white p-2 rounded shadow hover:bg-purple-600 flex items-center"
            >
                <FaRobot className="mr-2" />
                <span>Generate</span>
            </button>

            <NewGenerationPage isVisible={isModalVisible} onClose={handleCloseModal} />
        </>
    );
};

export default GenerationButton;