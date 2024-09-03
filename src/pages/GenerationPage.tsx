import React, { useState, useEffect } from 'react';
import { FaPaperPlane, FaCheckSquare, FaSquare } from 'react-icons/fa';
import LoadingScreen from '../components/LoadingScreen';
import { useGenerateText } from '../hooks/useGenerateText';
import DeckSelectionInput from '../components/DeckSelectionInput';
import { GeneratedData } from "../data/GenerationData.ts";
import { useLocation, useNavigate } from 'react-router-dom';

const GenerationPage: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [style, setStyle] = useState('');
    const [length, setLength] = useState(150);
    const [jlptLevel, setJlptLevel] = useState(5);
    const [error, setError] = useState('');
    const [generatedText, setGeneratedText] = useState<GeneratedData>();
    const [isPublic, setIsPublic] = useState(true); 
    const [isDeckSelectionComplete, setIsDeckSelectionComplete] = useState(false);
    const [onSaveTriggered, setOnSaveTriggered] = useState(false);

    const { mutate: generateText, isLoading } = useGenerateText();
    
    const navigate = useNavigate();
    const location = useLocation();
    const handleGenerate = () => {
        if (!topic || !style || length > 800 || !isDeckSelectionComplete) {
            setError('All fields are required, and Length must be between 150 and 800.');
            return;
        }

        if (!isLoading) {
            generateText(
                { topic, style, length, jlptLevel, isPublic },
                {
                    onSuccess: (data: GeneratedData) => {
                        console.log(data);
                        setGeneratedText(data);
                        setError('');
                        setOnSaveTriggered(true);
                    },
                    onError: (error: unknown) => {
                        setError(`Error generating text: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    },
                }
            );
        }
    };

    useEffect(() => {
        if (onSaveTriggered && generatedText) {
            navigate(`/generation/${generatedText._id}`, { state: { from: location } });
        }
    }, [onSaveTriggered, generatedText, navigate, location]);

    const isGenerateEnabled = topic.trim() !== '' && style.trim() !== '' && length <= 800 && isDeckSelectionComplete;

    return (
        <div className="flex items-center justify-center h-screen w-screen p-4 relative">
            <LoadingScreen isLoading={isLoading} />

            <div className="p-3 bg-white w-full max-w-3xl absolute">
                <div className="flex flex-col items-center justify-center mb-4">
                    <h1 className="text-center text-4xl text-black font-bold mb-2">何読みたいの？</h1>
                    {error && <p className="text-red-500 text-center mb-2">{error}</p>}
                </div>

                <DeckSelectionInput
                    kanjiList={[]}
                    wordList={[]}
                    grammarList={[]}
                    readingList={generatedText ? [generatedText] : []}
                    onSaveTriggered={onSaveTriggered}
                    onSelectionComplete={setIsDeckSelectionComplete}
                />

                <div className="flex flex-wrap gap-3 mb-3 mt-4">
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
                <div className="flex flex-wrap gap-3">
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

                {/* Checkbox para hacer público o privado */}
                <div className="flex items-center mb-4 mt-4">
                    <button
                        onClick={() => setIsPublic(!isPublic)}
                        className="flex items-center space-x-2"
                    >
                        {isPublic ? (
                            <FaCheckSquare className="text-blue-600" size={24} />
                        ) : (
                            <FaSquare className="text-gray-400" size={24} />
                        )}
                        <span className="text-sm text-gray-500">Make it public (Other users will be able to read it)</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GenerationPage;