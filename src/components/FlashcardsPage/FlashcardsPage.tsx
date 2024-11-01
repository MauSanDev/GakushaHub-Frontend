import { useState, useEffect, useRef } from "react";
import { FaEye, FaUndo, FaCheck } from "react-icons/fa";
import SwipeableCard from "../SwipeableCard";
import SummaryModal from "../SummaryModal";
import SettingsTooltip from "../SettingsTooltip";
import {FlashcardData, FlashcardDeck} from "../../data/FlashcardData.ts";
import ReactDOM from "react-dom";
import BackButton from "../ui/buttons/BackButton.tsx";

interface FlashcardsModalProps {
    deck: FlashcardDeck;
    onClose: () => void;
}

const FlashcardsModal = ({ deck, onClose }: FlashcardsModalProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showMeanings, setShowMeanings] = useState(false);
    const [correct, setCorrect] = useState<Set<number>>(new Set());
    const [incorrect, setIncorrect] = useState<Set<number>>(new Set());
    const [allCards, setAllCards] = useState<FlashcardData[]>([]);
    const [filteredCards, setFilteredCards] = useState<FlashcardData[]>([]);
    const [isVisible, setIsVisible] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [isShuffleEnabled, setIsShuffleEnabled] = useState(false);
    const [isTermFirst, setIsTermFirst] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const cardRef = useRef<any>(null);

    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isVisible]);

    useEffect(() => {
        setFilteredCards(deck.elements);
        setAllCards(deck.elements);
        setIsVisible(true);
    }, [deck]);

    useEffect(() => {
        if (allCards.length === 0) return;

        if (isShuffleEnabled) {
            shuffleDeck();
        } else {
            resetDeck(allCards);
        }
    }, [isShuffleEnabled]);

    useEffect(() => {
    }, [filteredCards]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isProcessing) {
                if (event.key === "ArrowRight") {
                    cardRef.current.approve();
                } else if (event.key === "ArrowLeft") {
                    cardRef.current.reject();
                } else if (event.key === "r")
                {
                    toggleReveal()
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [filteredCards, currentIndex, isProcessing]);

    const shuffleDeck = () => {
        const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
        setFilteredCards(shuffled);
        setCurrentIndex(0);
        setCorrect(new Set());
        setIncorrect(new Set());
    };

    const currentCard = filteredCards[currentIndex];

    const handleApprove = () => {
        if (!isProcessing) {
            setIsProcessing(true);
            setCorrect((prev) => {
                const newSet = new Set(prev);
                newSet.add(currentIndex);
                moveToNextCard();
                return newSet;
            });

            setTimeout(() => {
                setIsProcessing(false);
            }, 500);
        }
    };

    const handleReject = () => {
        if (!isProcessing) {
            setIsProcessing(true);
            setIncorrect((prev) => {
                const newSet = new Set(prev);
                newSet.add(currentIndex);
                moveToNextCard();
                return newSet;
            });

            setTimeout(() => {
                setIsProcessing(false);
            }, 500);
        }
    };

    const moveToNextCard = () => {
        if (currentIndex >= filteredCards.length - 1) {
            setShowSummary(true);
        } else {
            setCurrentIndex((prevIndex) => {
                setShowMeanings(false);
                return prevIndex + 1;
            });
        }
    };

    const handleRetryIncorrect = () => {
        const incorrectCardIndexes = Array.from(incorrect);
        const incorrectCards = incorrectCardIndexes.map((index) => filteredCards[index]);

        setFilteredCards(incorrectCards);
        setCorrect(new Set());
        setIncorrect(new Set());
        setCurrentIndex(0);
        setShowSummary(false);
    };

    const handleRetryAll = () => {
        resetDeck(allCards);
        setShowSummary(false);
    };

    const resetDeck = (cards: FlashcardData[]) => {
        setFilteredCards(cards);
        setCorrect(new Set());
        setIncorrect(new Set());
        setCurrentIndex(0);
        setShowMeanings(false);
    };

    const toggleReveal = () => setShowMeanings((prev) => !prev);

    const toggleShuffle = () => setIsShuffleEnabled((prev) => !prev);

    const toggleOrientation = () => setIsTermFirst((prev) => !prev);

    const modalContent = (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                <div
                    className="relative w-11/12 md:w-1/3 lg:w-1/4 h-auto p-4 flex flex-col items-center"
                    style={{ maxHeight: "90vh" }}
                >
                    <BackButton onClick={onClose} className={"absolute top-2 left-2"} />

                    <div className="absolute right-0 top-3">
                        <SettingsTooltip
                            onReset={() => {resetDeck(allCards);}}
                            onToggleShuffle={toggleShuffle}
                            isShuffleEnabled={isShuffleEnabled}
                            onToggleOrientation={toggleOrientation}
                            isTermFirst={isTermFirst}
                        />
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-6 flex justify-center items-center">
                        {deck.name}
                    </h1>

                    <SwipeableCard
                        ref={cardRef}
                        front={isTermFirst ? currentCard?.front || "" : currentCard?.back || ""}
                        back={isTermFirst ? currentCard?.back || "" : currentCard?.front || ""}
                        onApprove={handleApprove}
                        onReject={handleReject}
                    />

                    <div className="flex gap-6 mt-6 items-center w-full justify-center">
                        <p className="text-red-500 text-xl">{incorrect.size}</p>
                        <button
                            onClick={() => !isProcessing && cardRef.current.reject()}
                            className="bg-red-500 text-white p-5 rounded-full shadow-lg transform transition-transform duration-150 ease-in-out hover:scale-110 active:scale-90 hover:bg-red-400 active:bg-red-700 text-2xl"
                            disabled={isProcessing}
                        >
                            <FaUndo />
                        </button>
                        <p className="text-gray-400 text-xl">{filteredCards.length - correct.size - incorrect.size}</p>
                        <button
                            onClick={() => !isProcessing && cardRef.current.approve()}
                            className="bg-green-500 text-white p-5 rounded-full shadow-lg transform transition-transform duration-150 ease-in-out hover:scale-110 active:scale-90 hover:bg-green-400 active:bg-green-700 text-2xl"
                            disabled={isProcessing}
                        >
                            <FaCheck />
                        </button>
                        <p className="text-green-500 text-xl">{correct.size}</p>
                    </div>

                    <button
                        onClick={toggleReveal}
                        className="mt-4 p-4 bg-blue-500 dark:bg-gray-700 text-white rounded-full hover:bg-blue-600 dark:hover:bg-gray-600 active:bg-blue-700 shadow-lg transform transition-transform duration-150 ease-in-out hover:scale-110 active:scale-90 text-2xl"
                    >
                        <FaEye />
                    </button>

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

                {showSummary && (
                    <SummaryModal
                        correctCount={correct.size}
                        incorrectCount={incorrect.size}
                        totalCards={filteredCards.length}
                        onRetryIncorrect={handleRetryIncorrect}
                        onRetryAll={handleRetryAll}
                        onClose={() => {
                            setShowSummary(false);
                            onClose();
                        }}
                    />
                )}
            </div>
        </>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById("modal-root")!);
};

export default FlashcardsModal;