import React, { useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import NewGenerationPage from "./NewGenerationPage.tsx";
import {DeckType} from "../../data/DeckData.ts";
import {useAuth} from "../../context/AuthContext.tsx";

interface GenerationButtonProps {
    decks?: DeckType[];
    courseId: string;
    courseName: string;
    lessonName: string;
    deckName?: string;
}

const GenerationButton: React.FC<GenerationButtonProps> = ({ decks, deckName, lessonName, courseName, courseId }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { isPremium } = useAuth()
    
    if (!isPremium)
        return null;

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
                className="bg-blue-300 text-xs text-white p-2 rounded shadow hover:bg-blue-400 dark:bg-gray-950 hover:dark:bg-gray-800 flex items-center"
            >
                <FaRobot />
            </button>

            <NewGenerationPage isVisible={isModalVisible} onClose={handleCloseModal} decks={decks} deckName={deckName ?? "読書"} lessonName={lessonName} courseName={courseName} courseId={courseId} />
        </>
    );
};

export default GenerationButton;