import React, { useState } from 'react';
import { GrammarStructureData, Example } from '../../data/data-structures';
import { useLanguage } from '../../context/LanguageContext';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';

interface SmallGrammarBoxProps {
    result: GrammarStructureData | null;
}

const SmallGrammarBox: React.FC<SmallGrammarBoxProps> = ({ result }) => {
    const { language } = useLanguage();
    const [isExamplesOpen, setIsExamplesOpen] = useState(false);

    if (!result) return null;

    return (
        <div
            className="bg-white p-2 rounded-md shadow-sm border border-gray-200 hover:border-blue-300 transition-transform transform hover:scale-105 w-full cursor-pointer relative"
        >
            {/* JLPT Tag */}
            <span className="absolute top-2 right-2 bg-blue-400 text-white text-xs px-2 py-1 rounded-full">
                JLPT{result.jlpt}
            </span>

            <h1 className="text-xl font-bold text-blue-400 mb-1">{result.structure}</h1>
            <p className="text-sm text-gray-600 mb-2">{result.hint}</p>

            {/* Subtítulo "Examples" colapsable */}
            <div
                className="flex items-center cursor-pointer text-black font-semibold text-sm mb-2"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsExamplesOpen(!isExamplesOpen);
                }}
            >
                <span className="mr-1">{isExamplesOpen ? <FaChevronDown /> : <FaChevronRight />}</span>
                <span>Examples</span>
            </div>

            {/* Contenedor de ejemplos colapsable con animación */}
            <div
                className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
                    isExamplesOpen ? 'max-h-[500px]' : 'max-h-0'
                }`}
            >
                {result.examples.map((example: Example, index) => (
                    <div key={index} className="mb-2 text-xs">
                        <span className="text-gray-500 mr-2">例:</span>
                        <b className="text-gray-900">{example.text}</b>
                        <p className="text-gray-600">
                            {example.translations && example.translations[language]
                                ? example.translations[language]
                                : example.translations.en}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SmallGrammarBox;