import React, { useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import NewGenerationPage from "./NewGenerationPage.tsx";
import {DeckType} from "../../data/DeckData.ts";
import {useAuth} from "../../context/AuthContext.tsx";
import TertiaryButton from "../ui/buttons/TertiaryButton.tsx";

interface GenerationButtonProps {
    decks?: DeckType[];
    courseId: string;
    courseName: string;
    lessonName: string;
    deckName?: string;
}

const GenerationButton: React.FC<GenerationButtonProps> = ({ decks, deckName, lessonName, courseName, courseId }) => {
    const [ isModalVisible, setIsModalVisible] = useState(false);
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
            <TertiaryButton onClick={handleOpenModal} iconComponent={<FaRobot />} />
            {isModalVisible &&
                <NewGenerationPage onClose={handleCloseModal} decks={decks} deckName={deckName ?? "読書"} lessonName={lessonName} courseName={courseName} courseId={courseId} />
            }
        </>
    );
};

export default GenerationButton;