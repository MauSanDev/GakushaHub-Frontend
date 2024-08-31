import React, { useState, useEffect } from 'react';
import { FaCog, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useParseJapanese } from '../../hooks/useParseJapanese';
import Tooltip from '../WordTooltip.tsx';

interface TextReaderProps {
    title: string;
    content: string;
}

const TextReader: React.FC<TextReaderProps> = ({ title, content }) => {
    const [showFurigana, setShowFurigana] = useState(true);
    const [fontSize, setFontSize] = useState(18);
    const [letterSpacing, setLetterSpacing] = useState(1);
    const [lineHeight, setLineHeight] = useState(1.8);
    const [showConfig, setShowConfig] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState<{ word: string; element: Element } | null>(null);

    const { data: formattedContent, error } = useParseJapanese(content);

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
            setActiveTooltip(null); // Cierra cualquier tooltip activo
        });
    }, [formattedContent]);

    return (
        <div className="whitemax-w-relative p-8 pb-24 bg-white border border-gray-300 rounded-md shadow-lg">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <div className="absolute top-14 right-14 flex items-center space-x-2">
                <button
                    className={`text-white flex items-center space-x-1 px-2 py-1 rounded ${
                        showFurigana ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                    onClick={toggleFurigana}
                >
                    {showFurigana ? <FaEye /> : <FaEyeSlash />}
                    <span className="text-xs">ふりがな</span>
                </button>
                <div className="relative">
                    <button
                        className="text-white bg-blue-500 hover:bg-blue-600 p-1 rounded"
                        onClick={() => setShowConfig(!showConfig)}
                    >
                        <FaCog />
                    </button>
                    {showConfig && (
                        <div className="absolute right-0 mt-2 w-56 p-4 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                            <div className="flex items-center justify-between">
                                <label className="text-xs text-gray-700">Text Size</label>
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
                                <label className="text-xs text-gray-700">Letter Spacing</label>
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
                                <label className="text-xs text-gray-700">Line Height</label>
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
                className="prose mt-4 p-2"
                style={{
                    fontSize: `${fontSize}px`,
                    letterSpacing: `${letterSpacing}px`,
                    lineHeight: lineHeight,
                    textIndent: '2em',
                }}
                dangerouslySetInnerHTML={{ __html: error ? 'Error processing content.' : formattedContent ?? '' }}
            />
            {activeTooltip && (
                <Tooltip word={activeTooltip.word} targetElement={activeTooltip.element} onClose={() => setActiveTooltip(null)} />
            )}
        </div>
    );
};

export default TextReader;