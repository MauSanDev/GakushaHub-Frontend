import React, { useRef } from 'react';
import { GrammarData } from '../../data/GrammarData';
import { ExampleData } from '../../data/GeneralTypes.ts';
import { useLanguage } from '../../context/LanguageContext';
import { FaQuestionCircle } from 'react-icons/fa';
import ConfigDropdown from "../ConfigDropdown"; // Importamos el ConfigDropdown

interface SmallGrammarBoxProps {
    result: GrammarData | null;
}

const SmallGrammarBox: React.FC<SmallGrammarBoxProps> = ({ result }) => {
    const { language } = useLanguage();
    const contentRef = useRef<HTMLDivElement>(null);

    if (!result) return null;

    // Generar la lista de items para el ConfigDropdown
    const dropdownItems = [
        <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold text-blue-400 dark:text-white">{result.structure}</h1>
        </div>,
        <span className="text-xs text-gray-600 dark:text-gray-300">{result.hint}</span>,
        <div key="description">
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 font-bold">Description:</p>
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">{result.description}</p>
        </div>,
        <div key="examples">
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 font-bold">Examples:</p>
            <div className="text-gray-600 dark:text-gray-300">
                {result.examples && result.examples.length > 0 ? (
                    result.examples.map((example: ExampleData, index) => (
                        <div key={index} className="mb-2 text-xs pl-2">
                            <span className="text-gray-600 dark:text-gray-300 mr-2">例:</span>
                            <b className="text-gray-600 dark:text-gray-300">{example.text}</b>
                            <p className="text-gray-600 dark:text-gray-300 pl-6">
                                {example.translations && example.translations[language]
                                    ? example.translations[language]
                                    : example.translations.en}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600 dark:text-gray-300">No examples available.</p>
                )}
            </div>
        </div>
    ];

    return (
        <div
            className="bp-2 rounded-md shadow-sm border px-4 py-2 bg-white dark:bg-gray-950 hover:border-blue-300 hover:dark:border-gray-700 border-gray-200 dark:border-gray-800 w-full relative">
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-bold text-blue-400 dark:text-white">{result.structure}</h1>
                <div className="flex items-center space-x-2">
                    <span className="bg-blue-400 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded">
                        JLPT{result.jlpt}
                    </span>
                    <ConfigDropdown items={dropdownItems} icon={<FaQuestionCircle />} buttonSize="text-xs" />
                </div>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-300 pl-2">{result.hint}</span>
        </div>
    );
};

export default SmallGrammarBox;