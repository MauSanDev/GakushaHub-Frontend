import { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import ReactDOM from "react-dom";
import { GrammarDeck } from "../../data/GrammarData.ts";
import GrammarElement from "./GrammarPracticeBox.tsx";

interface GrammarPracticeModalProps {
    deck: GrammarDeck;
    onClose: () => void;
}

const GrammarPracticeModal = ({ deck, onClose }: GrammarPracticeModalProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (deck) {
            setIsVisible(true);
        }
    }, [deck]);

    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isVisible]);

    // Función para manejar el cierre con confirmación
    const handleClose = () => {
        const confirmClose = window.confirm(
            "Close the Grammar Practice? The practice will be discarded. Do you want to continue?"
        );
        if (confirmClose) {
            onClose(); // Si el usuario confirma, se cierra el modal
        }
    };

    const modalContent = (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div
                className="relative w-11/12 md:w-80 pr-8 lg:w-1/2 h-auto p-4 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700"
                style={{ maxHeight: "90vh" }}
            >
                <button
                    onClick={handleClose} // Usamos handleClose en lugar de onClose directamente
                    className="absolute top-2 left-2 text-white p-2 rounded-full shadow-lg bg-gray-800 hover:bg-gray-600"
                >
                    <FaArrowLeft />
                </button>

                <h1 className="text-4xl font-bold text-white mb-6 text-center">
                    文法を練習しましょう！
                </h1>

                {deck.elements.map((element, elementIndex) => (
                    <GrammarElement key={elementIndex} element={element} />
                ))}
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById("modal-root")!);
};

export default GrammarPracticeModal;