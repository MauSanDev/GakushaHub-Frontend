import React, { useState, useRef, useEffect } from 'react';
import { GrammarData } from '../../data/GrammarData';
import { ExampleData } from '../../data/GeneralTypes.ts';
import { useLanguage } from '../../context/LanguageContext';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';

interface SmallGrammarBoxProps {
    result: GrammarData | null;
}

const SmallGrammarBox: React.FC<SmallGrammarBoxProps> = ({ result }) => {
    const { language } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [maxHeight, setMaxHeight] = useState('0px');

    useEffect(() => {
        if (contentRef.current) {
            if (isExpanded) {
                setMaxHeight(`${contentRef.current.scrollHeight}px`);
            } else {
                setMaxHeight('0px');
            }
        }
    }, [isExpanded]);

    useEffect(() => {
        if (isExpanded) {
            // Reset the maxHeight to 'none' after the transition to allow for dynamic content resizing
            const timeout = setTimeout(() => setMaxHeight('none'), 500); // 500ms matches the transition duration
            return () => clearTimeout(timeout);
        }
    }, [isExpanded]);

    if (!result) return null;

    return (
        <div className="bg-white p-2 rounded-md shadow-sm border border-gray-200 hover:border-blue-300 w-full cursor-pointer relative">
            {/* JLPT Tag */}
            <span className="absolute top-1 right-1 bg-blue-400 text-white text-xs px-1 py-1 rounded-full">
                JLPT{result.jlpt}
            </span>

            {/* Title and Chevron */}
            <div className="flex items-center" onClick={() => setIsExpanded(!isExpanded)}>
                <span className="text-xs text-gray-600 mr-2">
                    {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                </span>
                <h1 className="text-lg font-bold text-blue-400">{result.structure}</h1>
            </div>
            <span className="text-xs text-gray-600">{result.hint}</span>

            {/* Animated Content */}
            <div
                ref={contentRef}
                className="overflow-hidden transition-all duration-500 ease-in-out"
                style={{ maxHeight }}
            >
                {isExpanded && (
                    <>
                        {/* Description */}
                        <p className="text-xs text-gray-600 mt-2 font-bold">Description:</p>
                        <p className="text-xs text-gray-600 mb-2">{result.description}</p>

                        {/* Examples */}
                        <p className="text-xs text-gray-600 mb-2 font-bold">Examples:</p>
                        <div className="text-gray-600">
                            {result.examples && result.examples.length > 0 ? (
                                result.examples.map((example: ExampleData, index) => (
                                    <div key={index} className="mb-2 text-xs pl-2">
                                        <span className="text-gray-500 mr-2">例:</span>
                                        <b className="text-gray-700">{example.text}</b>
                                        <p className="text-gray-500 pl-6">
                                            {example.translations && example.translations[language]
                                                ? example.translations[language]
                                                : example.translations.en}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600">No examples available.</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SmallGrammarBox;