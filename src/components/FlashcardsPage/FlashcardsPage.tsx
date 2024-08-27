import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FaArrowLeft, FaEye, FaUndo, FaCheck } from "react-icons/fa";
import { FlashcardDeck, FlashcardData } from "../../data/data-structures";

interface FlashcardsModalProps {
    deck: FlashcardDeck;
    onClose: () => void;
}

const FlashcardsModal = ({ deck, onClose }: FlashcardsModalProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showBack, setShowBack] = useState(false);
    const [showMeanings, setShowMeanings] = useState(false);
    const [correct, setCorrect] = useState<Set<number>>(new Set());
    const [incorrect, setIncorrect] = useState<Set<number>>(new Set());
    const [filteredCards, setFilteredCards] = useState<FlashcardData[]>(deck.elements);
    const [isVisible, setIsVisible] = useState(false); // Estado inicial para animar la entrada del modal

    useEffect(() => {
        // Iniciar la animación de entrada al montar el componente
        setIsVisible(true);
    }, []);

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
            setCurrentIndex((prevIndex) => {
                setShowMeanings(false);
                return prevIndex + 1;
            });
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
                closeWithAnimation();
            }
        }
    };

    const resetDeck = (cards: FlashcardData[]) => {
        setFilteredCards(cards);
        setCorrect(new Set());
        setIncorrect(new Set());
        setCurrentIndex(0);
        setShowMeanings(false);
    };

    const toggleCard = () => setShowBack((prev) => !prev);

    const toggleReveal = () => setShowMeanings((prev) => !prev);

    const closeWithAnimation = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Espera la animación antes de cerrar
    };

    const modalContent = (
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

                {/* Título del mazo */}
                <h1 className="text-4xl font-bold text-white mb-6">{deck.name}</h1>

                {/* Carta en formato más vertical (portrait) */}
                <div className="relative w-full h-96 lg:h-[36rem] mt-4 rounded-xl shadow-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center cursor-pointer" onClick={toggleCard}>
                    {showBack ? (
                        // Vista del back
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 overflow-auto text-white">
                            <p className="text-center text-3xl font-normal whitespace-pre-line">
                                {currentCard?.back}
                            </p>
                        </div>
                    ) : (
                        // Vista del front
                        <div className="w-full h-full flex items-center justify-center p-4 text-white">
                            <p className="text-center text-6xl font-normal">{currentCard?.front}</p>
                        </div>
                    )}
                </div>

                {/* Botones de acciones */}
                <div className="flex gap-4 mt-6 items-center">
                    <p className="text-red-500">{incorrect.size}</p>
                    <button onClick={handleReject} className="bg-red-500 text-white p-3 rounded-full shadow-lg">
                        <FaUndo />
                    </button>
                    <p className="text-gray-400">{allCards.length - correct.size - incorrect.size}</p>
                    <button onClick={handleAccept} className="bg-green-500 text-white p-3 rounded-full shadow-lg">
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
                        <p className="text-center text-lg text-gray-300 whitespace-pre-line">
                            {currentCard?.meanings.join("\n")}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById("modal-root")!);
};

export default FlashcardsModal;