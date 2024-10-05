import { useState } from "react";
import { FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";
import SentenceInput from "./SentenceInput.tsx";
import { GrammarData } from "../../data/GrammarData.ts";
import LocSpan from "../LocSpan.tsx";

interface GrammarPracticeBoxProps {
    element: GrammarData;
}

interface Sentence {
    id: number;
}

const GrammarPracticeBox = ({ element }: GrammarPracticeBoxProps) => {
    const [sentences, setSentences] = useState<Sentence[]>([{ id: Date.now() }]); // Lista de inputs para este elemento
    const [showDetails, setShowDetails] = useState(false); // Controlar si mostramos la descripción y ejemplos

    const handleAddSentence = () => {
        setSentences((prev) => [...prev, { id: Date.now() }]); // Agregamos un nuevo input con un id único
    };

    const handleRemoveSentence = (id: number) => {
        if (sentences.length > 1) {
            setSentences((prev) => prev.filter((sentence) => sentence.id !== id)); // Eliminamos el input con el id seleccionado
        }
    };

    const handleToggleDetails = () => {
        setShowDetails((prev) => !prev); // Toggle para expandir o colapsar el contenido
    };

    return (
        <div className="w-full mb-4 border-b border-gray-800 pt-10">
            <div
                className="flex items-center cursor-pointer p-2"
                onClick={handleToggleDetails} // Al hacer clic se expande o colapsa
            >
                <h2 className="text-2xl font-semibold text-white hover:text-blue-400 transition-all">
                    {element.structure}
                </h2>
                <button className="text-white ml-2">
                    {showDetails ? <FaChevronUp /> : <FaChevronDown />}
                </button>
            </div>

            {/* Contenedor con la transición de expandir/colapsar */}
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
                                <LocSpan
                                    textKey={example.replace('example', 'examples.example')}
                                    fixTo="ja"
                                    namespace={"grammar_jlpt" + element.jlpt}
                                />
                                <p>
                                    <LocSpan
                                        textKey={example.replace('example', 'examples.example')}
                                        namespace={"grammar_jlpt" + element.jlpt}
                                    />
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="w-full mb-4">
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
    );
};

export default GrammarPracticeBox;