import React, { useEffect, useState } from 'react';
import { GrammarData } from "../../data/GrammarData.ts";
import { ExampleData } from "../../data/GeneralTypes.ts";
import { useLanguage } from '../../context/LanguageContext';
import { FaCheck, FaChevronRight, FaChevronDown } from 'react-icons/fa';

interface GrammarStructureBoxProps {
    result: GrammarData | null;
    isSelected: boolean;
    onSelect: (selected: boolean) => void;
}

const GrammarStructureBox: React.FC<GrammarStructureBoxProps> = ({ result, isSelected, onSelect }) => {
    const { language } = useLanguage();
    const [isExamplesOpen, setIsExamplesOpen] = useState(false);

    useEffect(() => {
        console.log(`Idioma seleccionado: ${language}`);
    }, [language]);

    if (!result) return null;

    return (
        <div className="relative bg-white p-6 rounded-lg shadow-md text-left border-2 border-gray-200 transform transition-transform duration-300 hover:scale-105 hover:border-blue-300">
            {/* Tag de JLPT */}
            <span className="absolute top-2 right-12 bg-blue-400 text-white text-xs px-2 py-1 rounded-full">
                JLPT{result.jlpt}
            </span>

            {/* Checkbox personalizado para seleccionar la estructura */}
            <div
                className={`absolute top-2 right-2 w-6 h-6 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 ${
                    isSelected ? 'bg-green-500 text-white' : 'bg-gray-300'
                }`}
                onClick={() => onSelect(!isSelected)}
            >
                {isSelected && <FaCheck />}
            </div>

            <h1 className="text-3xl font-bold mb-2 text-blue-400">
                {result.structure} <span className="text-xl text-gray-600">({result.hint})</span>
            </h1>

            <p className="text-gray-700 mb-4">{result.description}</p>

            {/* Subtítulo "Examples" colapsable */}
            <div
                className="flex items-center cursor-pointer text-black font-semibold"
                onClick={() => setIsExamplesOpen(!isExamplesOpen)}
            >
                <span className="mr-2">{isExamplesOpen ? <FaChevronDown /> : <FaChevronRight />}</span>
                <span>Examples</span>
            </div>

            {/* Contenedor de ejemplos colapsable con animación */}
            <div
                className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
                    isExamplesOpen ? 'max-h-[1000px]' : 'max-h-0'
                }`}
            >
                {result.examples.map((example: ExampleData, index) => (
                    <div key={index} className="mt-4">
                        <span className="text-sm text-gray-500 mr-2">例:</span>
                        <b className="text-lg text-gray-900">{example.text}</b>
                        <p className="text-gray-600">
                            {example.translations && example.translations[language]
                                ? example.translations[language]
                                : example.translations.en}
                        </p>
                    </div>
                ))}
            </div>

            <div className="text-gray-400 text-sm mt-4 flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                    {result.example_contexts.map((context, index) => (
                        <span
                            key={index}
                            className="bg-gray-200 text-gray-500 rounded-1xl px-1 py-0.5 transition-all duration-300 hover:bg-gray-300 hover:text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap"
                        >
                            {context}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GrammarStructureBox;