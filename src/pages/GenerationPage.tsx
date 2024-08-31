import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import loadingIcon from '../assets/loading-icon.svg';
import TextReader from '../components/TextReader';
import { useGenerateText, GenerateTextResponse } from '../hooks/useGenerateText';

const GenerationPage: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [style, setStyle] = useState('');
    const [length, setLength] = useState(150);
    const [jlptLevel, setJlptLevel] = useState(5);
    const [error, setError] = useState('');
    const [generatedText, setGeneratedText] = useState('');

    const { mutate: generateText, isLoading } = useGenerateText();

    const handleGenerate = () => {
        if (!topic || !style || length < 150 || length > 800) {
            setError('Topic, Style, and Length (between 150 and 800) are required.');
            return;
        }

        generateText(
            { topic, style, length, jlptLevel },
            {
                onSuccess: (data: GenerateTextResponse) => {
                    setGeneratedText(data.generatedText);
                    setError('');
                },
                onError: (error: unknown) => {
                    setError(`Error generating text: ${error instanceof Error ? error.message : 'Unknown error'}`);
                },
            }
        );
    };

    const isGenerateEnabled = topic.trim() !== '' && style.trim() !== '' && length >= 150 && length <= 800;

    return (
        <div className="flex flex-col items-center justify-center h-full w-full p-4">
            <div className="flex-1 p-8 rounded-md overflow-y-auto relative max-w-4xl w-full">
                {isLoading && (
                    <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80 z-10">
                        <img src={loadingIcon} alt="Loading..." className="w-16 h-16" />
                    </div>
                )}
                {generatedText ? (
                    <TextReader title="Generated Text" content={generatedText} />
                ) : (
                    <div className="flex items-center justify-center h-full mt-2">
                        <h1 className="text-center text-4xl text-gray-300 font-bold align-middle space-x-0">何読みたい？</h1>
                    </div>
                )}
                {error && <p className="text-red-500 text-center">{error}</p>}
            </div>


            <div className="p-3 bg-white border border-gray-200 rounded-md shadow-lg w-full max-w-3xl fixed bottom-0 left-1/2 transform -translate-x-1/2">
                <div className="flex flex-wrap gap-3">
                    <div className="flex flex-col sm:flex-1">
                        <span className="text-gray-500 text-[10px]">Style</span>
                        <input
                            id="style"
                            type="text"
                            placeholder="Style (max 40 characters)"
                            value={style}
                            onChange={(e) => setStyle(e.target.value)}
                            maxLength={40}
                            className={`p-1.5 text-sm border rounded w-full ${style ? 'border-blue-500' : ''}`}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="flex flex-col sm:w-1/6">
                        <span className="text-gray-500 text-[10px]">Length</span>
                        <input
                            id="length"
                            type="number"
                            placeholder="Length (150-800)"
                            value={length}
                            onChange={(e) => setLength(Math.min(800, Number(e.target.value)))}
                            min={150}
                            max={800}
                            className={`p-1.5 text-sm border rounded w-full ${length >= 150 && length <= 800 ? 'border-blue-500' : ''}`}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="flex flex-col sm:w-1/4">
                        <span className="text-gray-500 text-[10px]">Level</span>
                        <select
                            id="jlptLevel"
                            value={jlptLevel}
                            onChange={(e) => setJlptLevel(Number(e.target.value))}
                            className={`p-1.5 text-sm border rounded w-full ${jlptLevel ? 'border-blue-500' : ''}`}
                            disabled={isLoading}
                        >
                            {[5, 4, 3, 2, 1].map((level) => (
                                <option key={level} value={level}>
                                    JLPT {level}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                    <div className="flex flex-col sm:flex-1">
                        <textarea
                            id="topic"
                            placeholder="Enter the topic (max 140 characters)"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            maxLength={140}
                            className={`p-1.5 text-sm border rounded w-full h-8 resize-none ${topic ? 'border-blue-500' : ''}`}
                            disabled={isLoading}
                            rows={1}
                            style={{ height: 'auto' }}
                            onInput={(e) => {
                                const textarea = e.target as HTMLTextAreaElement;
                                textarea.style.height = 'auto';
                                textarea.style.height = `${Math.min(textarea.scrollHeight, 80)}px`;
                            }}
                        />
                    </div>
                    <div className="flex sm:w-1/4 justify-end">
                        <button
                            onClick={handleGenerate}
                            className={`p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center justify-center w-full text-sm ${
                                !isGenerateEnabled ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={isLoading || !isGenerateEnabled}
                        >
                            <FaPaperPlane className="mr-1.5" />
                            Generate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenerationPage;