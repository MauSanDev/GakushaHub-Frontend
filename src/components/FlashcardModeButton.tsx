import React, { useState } from 'react';
import { FaPlayCircle } from 'react-icons/fa';
import TertiaryButton from "./ui/buttons/TertiaryButton.tsx";
import {FlashcardDeck} from "../data/FlashcardData.ts";
import FlashcardsModal from "./FlashcardsPage";

interface FlashcardModeButtonProps {
    deck: FlashcardDeck
}

const FlashcardModeButton: React.FC<FlashcardModeButtonProps> = ({ deck}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    
    return (
        <>
            <TertiaryButton iconComponent={<FaPlayCircle />} onClick={openModal} className={"hover:bg-green-600 hover:dark:bg-green-600"}/>

            {isModalOpen &&
                <FlashcardsModal
                    onClose={closeModal}
                    deck={deck}
                />
            }
        </>
    );
};

export default FlashcardModeButton;