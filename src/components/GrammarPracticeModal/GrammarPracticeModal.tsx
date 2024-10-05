import { useState, useEffect } from "react";
import { FaArrowLeft, FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";
import ReactDOM from "react-dom";
import { GrammarDeck } from "../../data/GrammarData.ts";
import LocSpan from "../LocSpan.tsx";
import SentenceInput from "./SentenceInput.tsx";

interface GrammarPracticeModalProps {
    deck: GrammarDeck;
    onClose: () => void;
}

interface Sentence {
    id: number;
}

const GrammarPracticeModal = ({ deck, onClose }: GrammarPracticeModalProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [sentences, setSentences] = useState<Sentence[]>([{ id: Date.now() }]); // Lista de inputs con identificador único

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

    const handleToggleDetails = () => {
        setShowDetails((prev) => !prev);
    };

    const handleAddSentence = () => {
        setSentences((prev) => [...prev, { id: Date.now() }]); // Agregamos un nuevo input con un id único
    };

    const handleRemoveSentence = (id: number) => {
        if (sentences.length > 1) {
            setSentences((prev) => prev.filter((sentence) => sentence.id !== id)); // Eliminamos el input con el id seleccionado
        }
    };

    const modalContent = (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div
                className="relative w-11/12 md:w-1/2 lg:w-1/2 h-auto p-4 flex flex-col overflow-y-auto"
                style={{ maxHeight: "90vh" }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 left-2 text-white p-2 rounded-full shadow-lg bg-gray-800 hover:bg-gray-600"
                >
                    <FaArrowLeft />
                </button>

                <h1 className="text-4xl font-bold text-white mb-6 text-center">
                    文法を練習しましょう！
                </h1>

                {deck.elements.map((element, elementIndex) => (
                    <div className="w-full mb-4" key={elementIndex}>
                        <div
                            onClick={handleToggleDetails}
                            className="flex items-center cursor-pointer p-2"
                        >
                            <button className="text-white mr-2">
                                {showDetails ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                            <h2 className="text-2xl font-semibold text-white hover:text-blue-400 transition-all">
                                {element.structure}
                            </h2>
                        </div>

                        <div
                            className={`transition-all duration-500 ease-in-out overflow-hidden ${
                                showDetails ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                        >
                            <div className="w-full bg-gray-950 p-4 rounded-lg mb-4 text-white">
                                <p className="mb-2 text-sm font-bold">
                                    <LocSpan textKey={element.hint} namespace={"grammar_jlpt" + element.jlpt} />
                                </p>
                                <p className="mb-2 text-sm">
                                    <LocSpan textKey={element.description} namespace={"grammar_jlpt" + element.jlpt} />
                                </p>
                                <p className="mb-2 font-bold">例:</p>
                                <ul className="list-disc pl-5">
                                    {element.examples.map((example, exampleIndex) => (
                                        <li key={exampleIndex} className={"text-sm pb-2"}>
                                            <LocSpan textKey={example.replace('example', 'examples.example')} fixTo="ja" namespace={"grammar_jlpt" + element.jlpt} />
                                            <p>
                                                <LocSpan textKey={example.replace('example', 'examples.example')} namespace={"grammar_jlpt" + element.jlpt} />
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="w-full mb-4">
                            <p className="text-white mb-2">文を書いてください:</p>
                            <div className="pl-4">
                                {sentences.map((sentence) => (
                                    <SentenceInput
                                        key={sentence.id}
                                        index={sentence.id}
                                        onRemove={() => handleRemoveSentence(sentence.id)}
                                        isLast={sentences.length === 1}
                                        grammarData={element}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={handleAddSentence}
                                    className="p-2 mt-2 bg-gray-900 text-xs text-white rounded-lg transition duration-150 ease-in-out"
                                >
                                    <FaPlus className="inline mr-2" />
                                    Add Sentence
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.getElementById("modal-root")!);
};

export default GrammarPracticeModal;