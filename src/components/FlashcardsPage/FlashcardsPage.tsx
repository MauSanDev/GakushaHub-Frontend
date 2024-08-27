import { useState } from "react";
import ReactDOM from "react-dom";
import { FaArrowLeft, FaEye, FaUndo, FaCheck } from "react-icons/fa";
import { FlashcardDeck, FlashcardData } from "../../data/data-structures";

interface FlashcardsModalProps {
    deck: FlashcardDeck;
    onClose: () => void;
}

const FlashcardsModal = ({ deck, onClose }: FlashcardsModalProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showBack, setShowBack] = useState(false); // Estado para alternar entre front y back
    const [showMeanings, setShowMeanings] = useState(false);
    const [correct, setCorrect] = useState<Set<number>>(new Set());
    const [incorrect, setIncorrect] = useState<Set<number>>(new Set());
    const [filteredCards, setFilteredCards] = useState<FlashcardData[]>(deck.elements);

    const allCards: FlashcardData[] = filteredCards;
    const currentCard = allCards[currentIndex];

    const handleReject = () => {
        setShowBack(false);
        setShowMeanings(false);
        setIncorrect((prev) => {
            const newSet = new Set(prev);
            newSet.add(currentIndex);
            moveToNextCard(newSet);
            return newSet;
        });
    };

    const handleAccept = () => {
        setShowBack(false);
        setShowMeanings(false);
        setCorrect((prev) => {
            const newSet = new Set(prev);
            newSet.add(currentIndex);
            moveToNextCard(newSet);
            return newSet;
        });
    };

    const moveToNextCard = (updatedSet: Set<number>) => {
        if (currentIndex >= allCards.length - 1) {
            handleEndOfDeck();
        } else {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handleEndOfDeck = () => {
        const retryIncorrect = window.confirm(
            `Terminaste el mazo. Acertaste ${correct.size} de ${allCards.length}. ¿Quieres repetir las tarjetas incorrectas?`
        );

        if (retryIncorrect && incorrect.size > 0) {
            const incorrectCardIndexes = Array.from(incorrect);
            const incorrectCards = incorrectCardIndexes.map((index) => filteredCards[index]);

            setFilteredCards(incorrectCards);
            setCorrect(new Set());
            setIncorrect(new Set());
            setCurrentIndex(0);
        } else {
            const retryAll = window.confirm("¿Quieres repetir todo el mazo?");
            if (retryAll) {
                resetDeck(deck.elements);
            } else {
                onClose();
            }
        }
    };

    const resetDeck = (cards: FlashcardData[]) => {
        setFilteredCards(cards);
        setCorrect(new Set());
        setIncorrect(new Set());
        setCurrentIndex(0);
    };

    const toggleCard = () => setShowBack((prev) => !prev);

    const toggleReveal = () => setShowMeanings((prev) => !prev);

    const modalContent = (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-white w-11/12 md:w-96 h-96 p-4 rounded-lg shadow-lg flex flex-col items-center">
                <button
                    onClick={onClose}
                    className="absolute top-2 left-2 text-white bg-blue-500 p-2 rounded-full shadow"
                >
                    <FaArrowLeft/>
                </button>

                <h1 className="text-4xl font-bold">{deck.name}</h1>
                <div className="relative w-full h-full mt-4" onClick={toggleCard}>
                    {showBack ? (
                        // Vista del back
                        <div
                            className="absolute inset-0 w-full h-full bg-white border border-blue-400 rounded-lg shadow-lg flex flex-col items-center justify-center p-4 overflow-auto cursor-pointer">
                            <p className="text-center text-3xl font-normal whitespace-pre-line">
                                {currentCard?.back}
                            </p>
                        </div>
                    ) : (
                        // Vista del front
                        <div
                            className="absolute inset-0 w-full h-full bg-white border border-blue-400 rounded-lg shadow-lg flex items-center justify-center p-4 cursor-pointer">
                            <p className="text-center text-6xl font-normal">{currentCard?.front}</p>
                        </div>
                    )}
                </div>

                {/* Botones de acciones */}
                <div className="flex gap-4 mt-6 items-center">
                    <p className="text-red-500">{incorrect.size}</p>
                    <button onClick={handleReject} className="bg-red-500 text-white p-3 rounded-full shadow">
                        <FaUndo/>
                    </button>
                    <p className="text-gray-500">{allCards.length - correct.size - incorrect.size}</p>
                    <button onClick={handleAccept} className="bg-green-500 text-white p-3 rounded-full shadow">
                        <FaCheck/>
                    </button>
                    <p className="text-green-500">{correct.size}</p>
                </div>

                {/* Botón de revelar significados */}
                <button
                    onClick={toggleReveal}
                    className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow"
                >
                    <FaEye/>
                </button>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById("modal-root")!);
};

export default FlashcardsModal;