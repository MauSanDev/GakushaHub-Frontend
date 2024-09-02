import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FaArrowLeft, FaEye, FaUndo, FaCheck } from "react-icons/fa";
import { FlashcardDeck, FlashcardData } from "../../data/FlashcardData.ts";
import SwipeableCard from "../SwipeableCard";
import SummaryModal from "../SummaryModal";
import SettingsTooltip from "../SettingsTooltip";

interface FlashcardsModalProps {
    deck: FlashcardDeck;
    onClose: () => void;
}

const FlashcardsModal = ({ deck, onClose }: FlashcardsModalProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showMeanings, setShowMeanings] = useState(false);
    const [correct, setCorrect] = useState<Set<number>>(new Set());
    const [incorrect, setIncorrect] = useState<Set<number>>(new Set());
    const [filteredCards, setFilteredCards] = useState<FlashcardData[]>(deck.elements);
    const [isVisible, setIsVisible] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [isShuffleEnabled, setIsShuffleEnabled] = useState(false);
    const [isTermFirst, setIsTermFirst] = useState(true); // Controla la orientación del mazo
    const [feedbackEffect, setFeedbackEffect] = useState(false); // Controla el efecto de flash

    useEffect(() => {
        setIsVisible(true); // Iniciar la animación de entrada al montar el componente
    }, []);

    useEffect(() => {
        if (isShuffleEnabled) {
            shuffleDeck();
        } else {
            resetDeck(deck.elements); // Si se desactiva el shuffle, vuelve al orden original
        }
    }, [isShuffleEnabled]);

    const shuffleDeck = () => {
        setFeedbackEffect(true); // Activa el feedback visual
        const shuffled = [...deck.elements].sort(() => Math.random() - 0.5);
        setFilteredCards(shuffled);
        setCurrentIndex(0);
        setCorrect(new Set());
        setIncorrect(new Set());
        setTimeout(() => setFeedbackEffect(false), 500); // Desactiva el feedback visual después de 500ms
    };

    const allCards: FlashcardData[] = filteredCards;
    const currentCard = allCards[currentIndex];

    const handleApprove = () => {
        setCorrect((prev) => {
            const newSet = new Set(prev);
            newSet.add(currentIndex);
            moveToNextCard();
            return newSet;
        });
    };

    const handleReject = () => {
        setIncorrect((prev) => {
            const newSet = new Set(prev);
            newSet.add(currentIndex);
            moveToNextCard();
            return newSet;
        });
    };

    const moveToNextCard = () => {
        if (currentIndex >= allCards.length - 1) {
            setShowSummary(true); // Mostrar el modal de resumen cuando termine el mazo
        } else {
            setCurrentIndex((prevIndex) => {
                setShowMeanings(false);
                return prevIndex + 1;
            });
        }
    };

    const handleRetryIncorrect = () => {
        setFeedbackEffect(true); // Activa el feedback visual
        const incorrectCardIndexes = Array.from(incorrect);
        const incorrectCards = incorrectCardIndexes.map((index) => filteredCards[index]);

        setFilteredCards(incorrectCards);
        setCorrect(new Set());
        setIncorrect(new Set());
        setCurrentIndex(0);
        setShowSummary(false);
        setTimeout(() => setFeedbackEffect(false), 500); // Desactiva el feedback visual después de 500ms
    };

    const handleRetryAll = () => {
        setFeedbackEffect(true); // Activa el feedback visual
        resetDeck(deck.elements);
        setShowSummary(false);
        setTimeout(() => setFeedbackEffect(false), 500); // Desactiva el feedback visual después de 500ms
    };

    const resetDeck = (cards: FlashcardData[]) => {
        setFilteredCards(cards);
        setCorrect(new Set());
        setIncorrect(new Set());
        setCurrentIndex(0);
        setShowMeanings(false);
    };

    const toggleReveal = () => setShowMeanings((prev) => !prev);

    const closeWithAnimation = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Espera la animación antes de cerrar
    };

    const toggleShuffle = () => setIsShuffleEnabled((prev) => !prev);

    const toggleOrientation = () => setIsTermFirst((prev) => !prev);

    const modalContent = (
        <>
            {/* Efecto de feedback visual */}
            {feedbackEffect && (
                <div className="fixed inset-0 bg-white opacity-50 z-40 transition-opacity duration-500"></div>
            )}

            <div
                className={`fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 transition-all duration-300 transform ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
            >
                <div
                    className="relative w-11/12 md:w-1/3 lg:w-1/4 h-auto p-4 flex flex-col items-center"
                    style={{ maxHeight: "90vh" }}
                >
                    {/* Botón de cierre */}
                    <button
                        onClick={closeWithAnimation}
                        className="absolute top-2 left-2 text-white p-2 rounded-full shadow-lg bg-gray-800 hover:bg-gray-600"
                    >
                        <FaArrowLeft />
                    </button>

                    <div className="absolute right-0 top-3">
                    {/* Botón de configuración */}
                    <SettingsTooltip
                        onReset={() => {
                            setFeedbackEffect(true); // Activa el feedback visual
                            resetDeck(deck.elements);
                            setTimeout(() => setFeedbackEffect(false), 500); // Desactiva el feedback visual después de 500ms
                        }}
                        onToggleShuffle={toggleShuffle}
                        isShuffleEnabled={isShuffleEnabled}
                        onToggleOrientation={toggleOrientation}
                        isTermFirst={isTermFirst}
                    />
                    </div>


                    {/* Título del mazo */}
                    <h1 className="text-4xl font-bold text-white mb-6 flex justify-center items-center">
                        {deck.name}
                    </h1>

                    {/* Componente SwipeableCard */}
                    <SwipeableCard
                        front={isTermFirst ? currentCard?.front || "" : currentCard?.back || ""}
                        back={isTermFirst ? currentCard?.back || "" : currentCard?.front || ""}
                        onApprove={handleApprove}
                        onReject={handleReject}
                    />

                    {/* Botones de acciones */}
                    <div className="flex gap-4 mt-6 items-center">
                        <p className="text-red-500">{incorrect.size}</p>
                        <button onClick={handleReject} className="bg-red-500 text-white p-3 rounded-full shadow-lg">
                            <FaUndo />
                        </button>
                        <p className="text-gray-400">{allCards.length - correct.size - incorrect.size}</p>
                        <button onClick={handleApprove} className="bg-green-500 text-white p-3 rounded-full shadow-lg">
                            <FaCheck />
                        </button>
                        <p className="text-green-500">{correct.size}</p>
                    </div>

                    {/* Botón de revelar significados */}
                    <button
                        onClick={toggleReveal}
                        className="mt-4 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-lg"
                    >
                        <FaEye />
                    </button>

                    {/* Caja de significados con animación */}
                    <div
                        className={`transition-all duration-500 ease-in-out transform ${
                            showMeanings ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                        } w-full bg-gray-900 bg-opacity-80 rounded-t-lg p-4 shadow-lg overflow-hidden`}
                    >
                        {showMeanings && (
                            <p className="text-center text-lg text-gray-300 whitespace-pre-line capitalize">
                                {currentCard?.meanings.join("; ")}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de Resumen */}
            {showSummary && (
                <SummaryModal
                    correctCount={correct.size}
                    incorrectCount={incorrect.size}
                    totalCards={allCards.length}
                    onRetryIncorrect={handleRetryIncorrect}
                    onRetryAll={handleRetryAll}
                    onClose={() => {
                        setShowSummary(false); // Cerrar el SummaryModal
                        closeWithAnimation(); // Cerrar el FlashcardsModal
                    }}
                />
            )}
        </>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById("modal-root")!);
};

export default FlashcardsModal;