import React, { useState, useEffect } from 'react';
import { FaCog, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useParseJapanese } from '../../hooks/useParseJapanese';
import WordTooltip from '../WordTooltip.tsx';
import {GeneratedData} from "../../data/GenerationData.ts";

interface TextReaderProps {
    data: GeneratedData
}

const TextReader: React.FC<TextReaderProps> = ({ data }) => {
    const [showFurigana, setShowFurigana] = useState(true);
    const [fontSize, setFontSize] = useState(18);
    const [letterSpacing, setLetterSpacing] = useState(1);
    const [lineHeight, setLineHeight] = useState(1.8);
    const [showConfig, setShowConfig] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState<{ word: string; element: Element } | null>(null);

    const { data: formattedContent, error } = useParseJapanese(data.text);

    const toggleFurigana = () => {
        setShowFurigana(!showFurigana);

        const rtElements = document.querySelectorAll('.prose rt');
        rtElements.forEach(rt => {
            if (showFurigana) {
                rt.classList.add('hidden');
            } else {
                rt.classList.remove('hidden');
            }
        });
    };

    const handleSliderChange = (setter: React.Dispatch<React.SetStateAction<number>>) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setter(Number(event.target.value));
        };

    useEffect(() => {
        const triggers = document.querySelectorAll('.tooltip-trigger');

        triggers.forEach((trigger) => {
            trigger.addEventListener('click', (event) => {
                event.stopPropagation();
                const word = trigger.getAttribute('data-word') ?? '';
                if (word) {
                    setActiveTooltip({ word, element: trigger });
                }
            });
        });

        document.addEventListener('click', () => {
            setActiveTooltip(null);
        });
    }, [formattedContent]);

    return (
        <div className="relative lg:p-6 mb-24 pb-10 p-2 rounded-lg shadow-md text-left border-2 transform transition-transform duration-300 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <h1 className="text-2xl font-bold mb-4 mt-8 text-center dark:text-white">{data.title}</h1>
            <div className="absolute top-4 right-14 flex items-center space-x-2">
                <button
                    className={`text-white flex items-center space-x-1 px-2 py-1 rounded ${
                        showFurigana ? 'bg-blue-500 dark:bg-gray-700' : 'bg-gray-400 dark:bg-gray-800'
                    }`}
                    onClick={toggleFurigana}
                >
                    {showFurigana ? <FaEye/> : <FaEyeSlash/>}
                    <span className="text-xs">ふりがな</span>
                </button>
                <div className="relative">
                    <button
                        className="text-white bg-blue-500 dark:bg-gray-700 hover:bg-blue-600 dark:hover:bg-gray-600 p-1 rounded"
                        onClick={() => setShowConfig(!showConfig)}
                    >
                        <FaCog/>
                    </button>
                    {showConfig && (
                        <div
                            className="absolute right-0 mt-2 w-56 p-4 bg-white dark:bg-black border border-gray-300 dark:border-gray-800 rounded-md shadow-lg z-50">
                            <div className="flex items-center justify-between">
                                <label className="text-xs text-gray-700 dark:text-gray-400">Text Size</label>
                                <input
                                    type="range"
                                    min="10"
                                    max="30"
                                    value={fontSize}
                                    onChange={handleSliderChange(setFontSize)}
                                    className="ml-2"
                                />
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <label className="text-xs text-gray-700 dark:text-gray-400">Letter Spacing</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="5"
                                    value={letterSpacing}
                                    onChange={handleSliderChange(setLetterSpacing)}
                                    className="ml-2"
                                />
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <label className="text-xs text-gray-700 dark:text-gray-400">Line Height</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="3"
                                    step="0.1"
                                    value={lineHeight}
                                    onChange={handleSliderChange(setLineHeight)}
                                    className="ml-2"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div
                className="prose mt-4 p-2 dark:text-white"
                style={{
                    fontSize: `${fontSize}px`,
                    letterSpacing: `${letterSpacing}px`,
                    lineHeight: lineHeight,
                    textIndent: '2em',
                }}
                dangerouslySetInnerHTML={{__html: error ? 'Error processing content.' : formattedContent ?? ''}}
            />
            {activeTooltip && (
                <WordTooltip word={activeTooltip.word} targetElement={activeTooltip.element}
                             onClose={() => setActiveTooltip(null)}/>
            )}

            <div className="mt-60 border-t border-gray-200  dark:border-gray-800 pt-4">
                <p className="text-xs text-gray-500 mb-2">
                    Created by {data.isAnonymous || !data.creatorId?.name ? "Anonymous" : data.creatorId?.name} - {new Date(data.createdAt).toLocaleDateString()}
                </p>
                <h2 className="text-sm text-gray-600 dark:text-gray-300 italic mb-4">Topic: "{data.topic}"</h2>

                <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-block bg-blue-100 dark:bg-blue-900 dark:bg-opacity-50 text-blue-800 dark:text-blue-400 text-xs font-semibold px-2 py-0.5 rounded-full">
            Style: {data.style}
        </span>
                    <span
                        className="inline-block bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-500 dark:bg-opacity-50 text-xs font-semibold px-2 py-0.5 rounded-full">
            JLPT: N{data.jlptLevel}
        </span>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs">Tags:</span>
                        <div className="flex flex-wrap gap-1">
                            {data.keywords && data.keywords.length > 0 && data.keywords.map((keyword, index) => (
                                <div
                                    key={index}
                                    className="inline-block bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 dark:bg-opacity-50  text-xs font-semibold px-2 py-0.5 rounded-full"
                                >
                                    {keyword}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {data.prioritization && (
                    <div className="mt-4 border dark:border-gray-800 rounded p-2">
                        {data.prioritization.grammar && data.prioritization.grammar.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-gray-400 text-xs">Grammar:</span>
                                <div className="flex flex-wrap gap-1">
                                    {data.prioritization.grammar.map((grammarItem, index) => (
                                        <div
                                            key={index}
                                            className="inline-block bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 dark:bg-opacity-50 text-xs font-semibold px-2 py-0.5 rounded-full"
                                        >
                                            {grammarItem}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {data.prioritization.words && data.prioritization.words.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap mt-2">
                                <span className="text-gray-400 text-xs">Words:</span>
                                <div className="flex flex-wrap gap-1">
                                    {data.prioritization.words.map((wordItem, index) => (
                                        <div
                                            key={index}
                                            className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 dark:bg-opacity-50 text-xs font-semibold px-2 py-0.5 rounded-full"
                                        >
                                            {wordItem}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {data.prioritization.kanji && data.prioritization.kanji.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap mt-2">
                                <span className="text-gray-400 text-xs">Kanji:</span>
                                <div className="flex flex-wrap gap-1">
                                    {data.prioritization.kanji.map((kanjiItem, index) => (
                                        <div
                                            key={index}
                                            className="inline-block bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 dark:bg-opacity-50 text-xs font-semibold px-2 py-0.5 rounded-full"
                                        >
                                            {kanjiItem}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TextReader;