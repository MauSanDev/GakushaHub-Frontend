import { useState } from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from "@use-gesture/react";
import { FaArrowLeft, FaEye, FaUndo, FaCheck } from "react-icons/fa";
import { KanjiDeck, WordDeck } from "../../data/data-structures";

interface FlashcardsPageProps<T extends "kanji" | "word"> {
    deckType: T;
    decks: T extends "kanji" ? KanjiDeck[] : WordDeck[];
    onClose: () => void;
}

const FlashcardsPage = <T extends "kanji" | "word">({
                                                        deckType,
                                                        decks,
                                                        onClose,
                                                    }: FlashcardsPageProps<T>) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [showMeanings, setShowMeanings] = useState(false);
    const [completed, setCompleted] = useState<Set<number>>(new Set());

    const allCards = decks.flatMap((deck) => deck.elements);
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
        // Repetir la carta actual
    };

    const handleSwipeRight = () => {
        setFlipped(false);
        setShowMeanings(false);
        setCompleted((prev) => new Set(prev).add(currentIndex));
        setCurrentIndex((prevIndex) => (prevIndex + 1) % allCards.length);
    };

    const toggleFlip = () => setFlipped((prev) => !prev);

    const toggleReveal = () => setShowMeanings((prev) => !prev);

    return (
        <div className="flex flex-col items-center justify-center h-full w-full relative">
            <button onClick={onClose} className="absolute top-4 left-4 bg-blue-500 text-white p-2 rounded-full shadow">
                <FaArrowLeft />
            </button>

            <div className="relative w-80 h-96">
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
                        <h1 className="text-4xl font-bold">
                            {deckType === "kanji" ? currentCard._id.kanji : currentCard._id.word}
                        </h1>
                    </div>
                    <div
                        className={`absolute inset-0 flex items-center justify-center p-4 backface-hidden ${
                            flipped ? "" : "hidden"
                        }`}
                        style={{ transform: "rotateY(180deg)" }}
                    >
                        <div className="text-center">
                            <h1 className="text-2xl font-bold">
                                {deckType === "kanji" ? currentCard._id.kanji : currentCard._id.word}
                            </h1>
                            {showMeanings && (
                                <p className="mt-4 text-sm text-gray-700">
                                    {deckType === "kanji"
                                        ? currentCard._id.meanings["en"].join("; ")
                                        : currentCard._id.meanings["en"]?.join("; ")}
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
    );
};

export default FlashcardsPage;