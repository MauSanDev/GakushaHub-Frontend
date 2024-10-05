import React, { useState } from 'react';
import { GrammarData } from "../../data/GrammarData.ts";
import { FaCheck, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import LocSpan from "../LocSpan.tsx";
import i18n from "i18next";

interface GrammarBoxProps {
    result: GrammarData | null;
    isSelected: boolean;
    onSelect: (selected: boolean) => void;
}

const GrammarBox: React.FC<GrammarBoxProps> = ({ result, isSelected, onSelect }) => {
    const [isExamplesOpen, setIsExamplesOpen] = useState(false);

    if (!result) return null;

    return (
        <div className={"relative p-6 rounded-lg shadow-md text-left border-2 transform transition-transform duration-300 lg:hover:scale-105 bg-white dark:bg-gray-900 " +
            `${isSelected ? 'dark:border-green-800 dark:hover:border-green-600 border-green-500 hover:border-green-300' : 'border-gray-200 dark:border-gray-800 hover:border-blue-300 hover:dark:border-gray-700'}`}

             onClick={() => onSelect(!isSelected)}>

            <span className="absolute top-2 right-12 bg-blue-400 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
                JLPT{result.jlpt}
            </span>

            <div
                className={`absolute top-2 right-2 w-6 h-6 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 ${
                    isSelected ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-700'
                }`}
            >
                {isSelected && <FaCheck />}
            </div>

            <h1 className="text-3xl font-bold mb-2 text-blue-400 dark:text-white">
                {result.structure} <span className="text-xl text-gray-600 dark:text-gray-300">(<LocSpan textKey={result.hint} namespace={"grammar_jlpt"+result.jlpt} />)</span>
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mb-4"><LocSpan textKey={result.description} namespace={"grammar_jlpt"+result.jlpt} /></p>

            <div
                className="flex items-center cursor-pointer text-black dark:text-white font-semibold"
                onClick={() => setIsExamplesOpen(!isExamplesOpen)}
            >
                <span className="mr-2">{isExamplesOpen ? <FaChevronDown /> : <FaChevronRight />}</span>
                <span>Examples</span>
            </div>

            <div
                className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
                    isExamplesOpen ? 'max-h-[1000px]' : 'max-h-0'
                }`}
            >
                {result.examples.map((example, index) => (
                    <div key={index} className="mt-4">
                        <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">例:</span>
                        <LocSpan
                            textKey={example.replace('example', 'examples.example')}
                            fixTo={"ja"}
                            namespace={"grammar_jlpt" + result.jlpt}
                            className="text-lg text-gray-600 dark:text-gray-300 font-bold"
                        />
                        {i18n.language !== 'ja' && (
                            <p className="text-gray-600 dark:text-gray-300 indent-6">
                                <LocSpan textKey={example.replace('example', 'examples.example')} namespace={"grammar_jlpt" + result.jlpt} />
                            </p>
                        )}
                    </div>
                ))}
            </div>
            
            <div className="text-gray-400 text-sm mt-4 flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                    {result.keywords.map((context, index) => (
                        <span
                            key={index}
                            className="bg-gray-200 dark:bg-gray-950 text-gray-500 rounded-1xl px-1 py-0.5 transition-all duration-300 hover:bg-gray-300 hover:dark:bg-gray-800 hover:text-gray-600 dark:text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap"
                        >
                            {context}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GrammarBox;