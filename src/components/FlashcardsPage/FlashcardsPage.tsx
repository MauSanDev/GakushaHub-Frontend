import { useState } from "react";
import ReactDOM from "react-dom";
import { useSpring, animated } from "react-spring";
import { useDrag } from "@use-gesture/react";
import { FaArrowLeft, FaEye, FaUndo, FaCheck } from "react-icons/fa";
import { FlashcardDeck, FlashcardData } from "../../data/data-structures"; // Importa FlashcardDeck y FlashcardData

interface FlashcardsModalProps {
    deck: FlashcardDeck;
    onClose: () => void;
}

const FlashcardsModal = ({ deck, onClose }: FlashcardsModalProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [showMeanings, setShowMeanings] = useState(false);
    const [completed, setCompleted] = useState<Set<number>>(new Set());

    const allCards: FlashcardData[] = deck.elements;
    const currentCard = allCards[currentIndex];

    const [props, api] = useSpring(() => ({
        x: 0,
        opacity: 1,
        scale: 1,
        rotateY: 0,
    }));

    const bind = useDrag(
        ({ active, movement: [mx], direction: [dx], cancel, velocity }) => {
            if (active && velocity > 0.2) {
                if (dx > 0) {
                    handleSwipeRight();
                } else {
                    handleSwipeLeft();
                }
                cancel();
            }
            api.start({ x: active ? mx : 0, scale: active ? 1.1 : 1, opacity: active ? 0.8 : 1 });
        }
    );

    const handleSwipeLeft = () => {
        setFlipped(false);
        setShowMeanings(false);
    };

    const handleSwipeRight = () => {
        setFlipped(false);
        setShowMeanings(false);
        setCompleted((prev) => new Set(prev).add(currentIndex));
        setCurrentIndex((prevIndex) => (prevIndex + 1) % allCards.length);
    };

    const toggleFlip = () => setFlipped((prev) => !prev);

    const toggleReveal = () => setShowMeanings((prev) => !prev);

    const modalContent = (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-white w-11/12 md:w-96 h-96 p-4 rounded-lg shadow-lg flex flex-col items-center">
                <button onClick={onClose} className="absolute top-2 left-2 text-white bg-blue-500 p-2 rounded-full shadow">
                    <FaArrowLeft />
                </button>

                <div className="relative w-full h-full mt-4">
                    {/* Carta de atrás */}
                    {currentIndex < allCards.length - 1 && (
                        <div className="absolute top-0 left-0 w-full h-full bg-white border border-gray-300 rounded-lg shadow-lg opacity-50"></div>
                    )}
                    {/* Carta actual */}
                    <animated.div
                        {...bind()}
                        style={{
                            ...props,
                            transformStyle: "preserve-3d",
                        }}
                        className="absolute w-full h-full bg-white border border-blue-400 rounded-lg shadow-lg cursor-pointer"
                        onClick={toggleFlip}
                    >
                        <div
                            className={`absolute inset-0 flex items-center justify-center p-4 backface-hidden ${
                                flipped ? "hidden" : ""
                            }`}
                        >
                            <h1 className="text-4xl font-bold">{currentCard.front}</h1>
                        </div>
                        <div
                            className={`absolute inset-0 flex items-center justify-center p-4 backface-hidden ${
                                flipped ? "" : "hidden"
                            }`}
                            style={{ transform: "rotateY(180deg)" }}
                        >
                            <div className="text-center">
                                <h1 className="text-2xl font-bold">{currentCard.back}</h1>
                                {showMeanings && (
                                    <p className="mt-4 text-sm text-gray-700">
                                        {currentCard.meanings.join("; ")}
                                    </p>
                                )}
                            </div>
                        </div>
                    </animated.div>
                </div>

                {/* Botones de acciones */}
                <div className="flex gap-4 mt-6">
                    <button onClick={handleSwipeLeft} className="bg-red-500 text-white p-3 rounded-full shadow">
                        <FaUndo />
                    </button>
                    <button onClick={handleSwipeRight} className="bg-green-500 text-white p-3 rounded-full shadow">
                        <FaCheck />
                    </button>
                </div>

                {/* Botón de revelar significados */}
                <button
                    onClick={toggleReveal}
                    className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow"
                >
                    <FaEye />
                </button>

                {/* Contador */}
                <div className="mt-4 text-gray-700">
                    <p>
                        Correctas: {completed.size} | Repetidas: {allCards.length - completed.size}
                    </p>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById("modal-root")!);
};

export default FlashcardsModal;