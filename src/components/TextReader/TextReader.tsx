import React, { useState, useEffect } from 'react';
import { FaCog, FaEye, FaEyeSlash } from 'react-icons/fa';
import { marked } from 'marked';

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
    const [formattedContent, setFormattedContent] = useState('');

    const toggleFurigana = () => setShowFurigana(!showFurigana);

    const handleSliderChange = (setter: React.Dispatch<React.SetStateAction<number>>) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setter(Number(event.target.value));
        };

    useEffect(() => {
        const processContent = async () => {
            // Convierte Markdown a HTML de manera asíncrona
            let htmlText = await marked(content);

            // Agrega clases y ajusta el formato de las etiquetas <wrd>
            htmlText = htmlText
                .replace(/<wrd>/g, '<wrd class="hover:bg-blue-100">') // Aplicar clases a las etiquetas <wrd>

            setFormattedContent(htmlText);
        };

        processContent();
    }, [content]);

    return (
        <div className="relative p-8 pb-24 bg-white border border-gray-300 rounded-md shadow-lg">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <div className="absolute top-4 right-4 flex items-center space-x-2">
                <button
                    className={`text-white flex items-center space-x-1 px-2 py-1 rounded ${showFurigana ? 'bg-blue-500' : 'bg-gray-400'}`}
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
                        <div className="absolute right-0 mt-2 w-56 p-4 bg-white border border-gray-300 rounded-md shadow-lg">
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
                    textIndent: '2em' // Aplica sangría al inicio de cada párrafo
                }}
                dangerouslySetInnerHTML={{
                    __html: showFurigana
                        ? formattedContent
                        : formattedContent.replace(/<rt>.*?<\/rt>/g, '')
                }}
            />
        </div>
    );
};

export default TextReader;