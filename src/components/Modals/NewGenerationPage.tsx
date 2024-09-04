import React, { useState, useEffect } from 'react';
import {FaPaperPlane, FaCheckSquare, FaSquare, FaBookOpen, FaFileAlt, FaBook, FaQuestion} from 'react-icons/fa';
import LoadingScreen from '../LoadingScreen';
import { useGenerateText } from '../../hooks/useGenerateText';
import { GeneratedData } from "../../data/GenerationData.ts";
import { useLocation, useNavigate } from 'react-router-dom';
import OverlayModal from "./OverlayModal.tsx";
import {KanjiDeck} from "../../data/KanjiData.ts";
import {WordDeck} from "../../data/WordData.ts";
import {GrammarDeck} from "../../data/GrammarData.ts";
import ConfigDropdown from "../ConfigDropdown.tsx";
import {useBuildCourse} from "../../hooks/useBuildCourse.ts";
import {DeckType, isGrammarDeck, isKanjiDeck, isWordDeck} from "../../data/DeckData.ts";

interface NewGenerationPageProps {
    courseId?: string,
    courseName?: string,
    lessonName?: string,
    deckName?: string, 
    decks?: DeckType[];
    isVisible: boolean;
    onClose: () => void;
}

const NewGenerationPage: React.FC<NewGenerationPageProps> = ({ decks, courseName, courseId, lessonName, deckName, isVisible, onClose }) => {
    const [topic, setTopic] = useState('');
    const [style, setStyle] = useState('');
    const [length, setLength] = useState(150);
    const [jlptLevel, setJlptLevel] = useState(5);
    const [error, setError] = useState('');
    const [generatedText, setGeneratedText] = useState<GeneratedData>();
    const [isPublic, setIsPublic] = useState(true);
    const [onSaveTriggered, setOnSaveTriggered] = useState(false);
    const { mutate: buildCourse } = useBuildCourse();

    const { mutate: generateText, isLoading } = useGenerateText();

    const navigate = useNavigate();
    const location = useLocation();

    const kanjiDecks = decks?.filter((deck): deck is KanjiDeck => isKanjiDeck(deck));
    const wordDecks = decks?.filter((deck): deck is WordDeck => isWordDeck(deck));
    const grammarDecks = decks?.filter((deck): deck is GrammarDeck => isGrammarDeck(deck));

    function getPrioritizedKanji() {
        const allDecks = kanjiDecks;
        if (!allDecks) return
        const allKanji = allDecks.flatMap((x) => x.elements);
        const random = getRandomElements(allKanji, 50)
        
        return random.map((result) => result.kanji)
    }
    
    function getPrioritizedWords() {
        const allDecks = wordDecks;
        if (!allDecks) return
        const allKanji = allDecks.flatMap((x) => x.elements);
        const random = getRandomElements(allKanji, 25)
        
        return random.map((result) => result.word)
    }
    
    function getPrioritizedGrammar() {
        const allDecks = grammarDecks;
        if (!allDecks) return
        const allKanji = allDecks.flatMap((x) => x.elements);
        const random = getRandomElements(allKanji, 10)
        
        return random.map((result) => result.structure)
    }

    function getRandomElements<T>(arr: T[], num: number): T[] {
        const shuffled = arr.slice();

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled.slice(0, num);
    }
    
    const handleGenerate = () => {
        if (!topic || !style || length > 800) {
            setError('All fields are required, and Length must be between 150 and 800.');
            return;
        }

        if (!isLoading) {
            generateText(
                { topic, style, length, jlptLevel, isPublic, prioritization: { words: getPrioritizedWords() ?? [], kanji: getPrioritizedKanji() ?? [], grammar: getPrioritizedGrammar() ?? []}},
                {
                    onSuccess: (data: GeneratedData) => {
                        setGeneratedText(data);
                        setError('');
                        
                        if ((courseId || courseName) && lessonName && decks)
                        {
                            buildCourse(
                                {courseId: courseId ?? '', courseName: courseName ?? 'Course', lessonName: lessonName ?? 'Lesson', decks: [ { deckName: deckName ?? 'Deck', elements: [ data._id ], deckType: 'reading'}]},
                                {
                                    onSuccess: () => {
                                        setOnSaveTriggered(true)
                                    }
                                });
                        }
                        else
                        {
                            setOnSaveTriggered(true)
                        }
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

    const isGenerateEnabled = topic.trim() !== '' && style.trim() !== '' && length <= 800;

    return (
        <OverlayModal isVisible={isVisible} onClose={onClose}>
            <div className="flex items-center justify-center p-4 relative">
                <LoadingScreen isLoading={isLoading} />

                <div className="p-3 bg-white dark:bg-gray-900 w-full">
                    <div className="flex flex-col items-center justify-center mb-4">

                        <div className="flex items-center justify-center mb-4">

                            <h1 className="text-center text-3xl text-black dark:text-white font-bold mb-2">何読みたいの？</h1>

                            <div className={"absolute right-0"}>
                            <ConfigDropdown
                                icon={<FaQuestion/>}
                                items={[
                                    <p className="text-xs text-gray-600 dark:text-gray-300 font-bold">
                                        Tips:
                                    </p>,
                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                        - Be specific. Give context of what you want.
                                    </p>,
                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                        - If the decks are too big, not all elements will be used.
                                    </p>,
                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                        - The model prioritizes the selected Decks. If you ask for a topic not related
                                        to the Words and Kanjis, it is possible that the text doesn't match with your
                                        topic.
                                    </p>,
                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                        - Consider the size. Not all the deck's content will be available if the text is
                                        too short.
                                    </p>,
                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                        - Consider your level. If you scale up the JLPT level, advanced Words and Kanji
                                        will also appear in the text.
                                    </p>,
                                ]}
                            />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Generate topics based on your proficiency and selected content.
                            The text will be saved in the Reading section of the selected lesson.
                        </p>
                    </div>

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
                                className={`p-1.5 bg-blue-500 dark:bg-gray-700 text-white rounded hover:bg-blue-600 dark:hover:bg-gray-600 transition flex items-center justify-center w-full text-sm ${
                                    !isGenerateEnabled ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                disabled={isLoading || !isGenerateEnabled}
                            >
                                <FaPaperPlane className="mr-1.5" />
                                Generate
                            </button>
                        </div>
                    </div>

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

                    {decks && decks.length > 0 && (
                        <div className="w-full border-gray-200 rounded border p-3 max-h-64 overflow-y-auto">
                            <h1 className={"font-bold border-b mb-5"}>Priority</h1>
                            {kanjiDecks && kanjiDecks.length > 0 && (
                            <div className="w-full">
                                <div className="flex justify-between items-center mb-2 ">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                        <FaBookOpen className="text-blue-400 dark:text-white" /> Kanji Decks:
                                    </h4>
                                </div>
                                
                                {kanjiDecks.map((deck: KanjiDeck) => (
                                    <div key={deck._id} className="mb-4">
                                        <h1 className="text-l font-semibold pl-5">{deck.name}</h1>
                                        <div className="flex flex-wrap gap-2 pl-5">
                                            {deck.elements.map((element) => (
                                                <span
                                                    key={element.kanji}
                                                    className="p-2 rounded border border-gray-300 text-gray-700 font-bold text-xs hover:text-blue-400 dark:text-white hover:border-blue-500 transition-colors duration-300"
                                                >
                                                {element.kanji}
                                            </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                
                            </div>
                        )}
                        
                        {wordDecks && wordDecks.length > 0 && (
                            <div className="w-full mt-4 border-t pt-5">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                        <FaFileAlt className="text-red-400" /> Word Decks:
                                    </h4>
                                </div>
    
                                {wordDecks.map((deck: WordDeck) => (
                                    <div key={deck._id}>
                                        <h1 className="text-l font-semibold pl-5">{deck.name}</h1>
                                        <div className="flex flex-wrap gap-2 pl-5">
                                            {deck.elements.map((element) => (
                                                <span
                                                    key={element.word}
                                                    className="p-2 rounded border border-gray-300 text-gray-700 font-bold text-xs hover:text-blue-400 dark:text-white hover:border-blue-500 transition-colors duration-300"
                                                >
                                                {element.word}
                                            </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
    
                            </div>
                        )}
    
                        {grammarDecks && grammarDecks.length > 0 && (
                            <div className="w-full pt-5 mt-5 border-t">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                        <FaBook className="text-green-400"/> Grammar Decks:
                                    </h4>
                                </div>
    
                                {grammarDecks.map((deck: GrammarDeck) => (
                                    <div key={deck._id}>
                                        <h1 className="text-l font-semibold pl-5">{deck.name}</h1>
                                        <div className="flex flex-wrap gap-2 pl-5">
                                            {deck.elements.map((element) => (
                                                <span
                                                    key={element.structure}
                                                    className="p-2 rounded border border-gray-300 text-gray-700 font-bold text-xs hover:text-blue-400 dark:text-white hover:border-blue-500 transition-colors duration-300"
                                                >
                                                {element.structure}
                                            </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
    
                            </div>
                        )}
                    </div>
                    )}
                </div>
            </div>
        </OverlayModal>
    );
};

export default NewGenerationPage;