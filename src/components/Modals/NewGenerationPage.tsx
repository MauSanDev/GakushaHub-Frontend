import React, { useState, useEffect } from 'react';
import { FaPaperPlane, FaCheckSquare, FaSquare, FaBookOpen, FaFileAlt, FaBook, FaQuestion } from 'react-icons/fa';
import LoadingScreen from '../LoadingScreen';
import { useGenerateText } from '../../hooks/useGenerateText';
import { GeneratedData } from "../../data/GenerationData.ts";
import { useLocation, useNavigate } from 'react-router-dom';
import OverlayModal from "./OverlayModal.tsx";
import { KanjiDeck } from "../../data/KanjiData.ts";
import { WordDeck } from "../../data/WordData.ts";
import { GrammarDeck } from "../../data/GrammarData.ts";
import ConfigDropdown from "../ConfigDropdown.tsx";
import { useBuildCourse } from "../../hooks/useBuildCourse.ts";
import { DeckType, isGrammarDeck, isKanjiDeck, isWordDeck } from "../../data/DeckData.ts";
import { useTranslation } from 'react-i18next';
import LocSpan from "../LocSpan.tsx"; // Para traducciones

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
    const { t } = useTranslation(); // Hook de i18n para traducciones

    const [topic, setTopic] = useState('');
    const [style, setStyle] = useState('');
    const [jlptLevel, setJlptLevel] = useState(0);
    const [error, setError] = useState('');
    const [generatedText, setGeneratedText] = useState<GeneratedData>();
    const [isAnonymous, setIsAnonymous] = useState(false);
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
        if (!allDecks) return;
        const allKanji = allDecks.flatMap((x) => x.elements);
        const random = getRandomElements(allKanji, 50);
        return random.map((result) => result.kanji);
    }

    function getPrioritizedWords() {
        const allDecks = wordDecks;
        if (!allDecks) return;
        const allKanji = allDecks.flatMap((x) => x.elements);
        const random = getRandomElements(allKanji, 25);
        return random.map((result) => result.word);
    }

    function getPrioritizedGrammar() {
        const allDecks = grammarDecks;
        if (!allDecks) return;
        const allKanji = allDecks.flatMap((x) => x.elements);
        const random = getRandomElements(allKanji, 10);
        return random.map((result) => result.structure);
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
        if (!topic || !style) {
            setError('All fields are required.');
            return;
        }

        if (!isLoading) {
            generateText(
                {
                    topic,
                    style,
                    length: 800,
                    jlptLevel,
                    isPublic: true,
                    isAnonymous: isAnonymous ?? false,
                    prioritization: {
                        words: getPrioritizedWords() ?? [],
                        kanji: getPrioritizedKanji() ?? [],
                        grammar: getPrioritizedGrammar() ?? []
                    }
                },
                {
                    onSuccess: (data: GeneratedData) => {
                        setGeneratedText(data);
                        setError('');

                        if ((courseId || courseName) && lessonName && decks) {
                            buildCourse(
                                {
                                    courseId: courseId ?? '',
                                    courseName: courseName ?? 'Course',
                                    lessonName: lessonName ?? 'Lesson',
                                    decks: [{ deckName: deckName ?? 'Deck', elements: [data._id], deckType: 'reading' }]
                                },
                                {
                                    onSuccess: () => {
                                        setOnSaveTriggered(true);
                                    }
                                }
                            );
                        } else {
                            setOnSaveTriggered(true);
                        }
                    },
                    onError: (error: unknown) => {
                        setError(`Error generating text: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    }
                }
            );
        }
    };

    useEffect(() => {
        if (onSaveTriggered && generatedText) {
            navigate(`/generation/${generatedText._id}`, { state: { from: location } });
        }
    }, [onSaveTriggered, generatedText, navigate, location]);

    const isGenerateEnabled = topic.trim() !== '' && style.trim() !== '' && jlptLevel > 0;

    // Lista de claves de estilos que se traducirán con i18n
    const writingStyleKeys = [
        "article",
        "story",
        "traditionalTale",
        "diary",
        "dialogue",
        "essay",
        "poetry",
        "review",
        "letter",
        "novel",
        "manga",
        "advertisement",
        "haiku"
    ];

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
                                    icon={<FaQuestion />}
                                    items={[
                                        <p className="text-xs text-gray-600 dark:text-gray-300 font-bold"><LocSpan textKey={"generationPage.tips.title"} /></p>,
                                        <p className="text-xs text-gray-600 dark:text-gray-300"><LocSpan textKey={"generationPage.tips.tip1"} /></p>,
                                        <p className="text-xs text-gray-600 dark:text-gray-300"><LocSpan textKey={"generationPage.tips.tip2"} /></p>,
                                        <p className="text-xs text-gray-600 dark:text-gray-300"><LocSpan textKey={"generationPage.tips.tip3"} /></p>,
                                        <p className="text-xs text-gray-600 dark:text-gray-300"><LocSpan textKey={"generationPage.tips.tip4"} /></p>,
                                    ]}
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                            <LocSpan textKey={"generationPage.description"} />
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-3 mt-4">
                        <div className="flex flex-col w-full sm:flex-1">
                            <select
                                id="style"
                                value={style}
                                onChange={(e) => setStyle(e.target.value)}
                                className={`p-1.5 text-sm border rounded w-full ${style ? 'border-blue-500' : ''}`}
                                disabled={isLoading}
                            >
                                <option value=""><LocSpan textKey={`generationPage.selectStyle`} /></option>
                                {writingStyleKeys.map((key) => (
                                    <option key={key} value={key}>
                                        <LocSpan textKey={`generationStyles.${key}`} fixTo={"ja"} /> - 
                                        <LocSpan textKey={`generationStyles.${key}`} />
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col w-full sm:w-1/4">
                            <select
                                id="jlptLevel"
                                value={jlptLevel ?? ""}
                                onChange={(e) => setJlptLevel(e.target.value ? Number(e.target.value) : 0)}
                                className={`p-1.5 text-sm border rounded w-full ${jlptLevel ? 'border-blue-500' : ''}`}
                                disabled={isLoading}
                            >
                                <option value=""><LocSpan textKey={"selectYourLevel"} /></option>
                                {[5, 4, 3, 2, 1].map((level) => (
                                    <option key={level} value={level}>
                                        JLPT {level}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="flex flex-col w-full sm:flex-1">
        <textarea
            id="topic"
            placeholder={t("generationPage.topicPlaceholder")}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            maxLength={140}
            className={`p-1.5 text-sm border rounded w-full h-8 resize-none ${topic ? 'border-blue-500' : ''}`}
            disabled={isLoading}
            rows={1}
            style={{height: 'auto'}}
            onInput={(e) => {
                const textarea = e.target as HTMLTextAreaElement;
                textarea.style.height = 'auto';
                textarea.style.height = `${Math.min(textarea.scrollHeight, 80)}px`;
            }}
        />
                        </div>
                        <div className="flex w-full sm:w-1/4 justify-end">
                            <button
                                onClick={handleGenerate}
                                className={`p-1.5 bg-blue-500 dark:bg-gray-700 text-white rounded hover:bg-blue-600 dark:hover:bg-gray-600 transition flex items-center justify-center w-full text-sm ${
                                    !isGenerateEnabled ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                disabled={isLoading || !isGenerateEnabled}
                            >
                                <FaPaperPlane className="mr-1.5"/>
                                <LocSpan textKey={"generationPage.generate"} />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center mb-4 mt-4">
                        <button
                            onClick={() => setIsAnonymous(!isAnonymous)}
                            className="flex items-center space-x-2"
                        >
                            {isAnonymous ? (
                                <FaCheckSquare className="text-blue-600" size={24}/>
                            ) : (
                                <FaSquare className="text-gray-400" size={24}/>
                            )}
                            <span
                                className="text-sm text-gray-500"><LocSpan textKey={"generationPage.anonymousDisclaimer"} /></span>
                        </button>
                    </div>
                    {/*<div className="flex items-center mb-4 mt-4">*/}
                    {/*    <button*/}
                    {/*        onClick={() => setIsPublic(!isPublic)}*/}
                    {/*        className="flex items-center space-x-2"*/}
                    {/*    >*/}
                    {/*        {isPublic ? (*/}
                    {/*            <FaCheckSquare className="text-blue-600" size={24}/>*/}
                    {/*        ) : (*/}
                    {/*            <FaSquare className="text-gray-400" size={24}/>*/}
                    {/*        )}*/}
                    {/*        <span*/}
                    {/*            className="text-sm text-gray-500">Make it public (Other users will be able to read it)</span>*/}
                    {/*    </button>*/}
                    {/*</div>*/}

                    {decks && decks.length > 0 && (
                        <div
                            className="w-full border-gray-200 rounded border p-3 max-h-64 overflow-y-auto  dark:border-gray-700 pb-8">
                            <h1 className={"font-bold border-b mb-5 dark:text-white dark:border-gray-700"}>Priority</h1>
                            {kanjiDecks && kanjiDecks.length > 0 && (
                                <div className="w-full">
                                    <div className="flex justify-between items-center mb-2 ">
                                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                            <FaBookOpen className="text-blue-400"/> Kanji Decks:
                                        </h4>
                                    </div>

                                    {kanjiDecks.map((deck: KanjiDeck) => (
                                        <div key={deck._id} className="mb-4">
                                            <h1 className="text-xs pl-5 dark:text-gray-300">{deck.name}</h1>
                                            <div className="flex flex-wrap gap-2 pl-5">
                                                {deck.elements.map((element) => (
                                                    <span
                                                        key={element.kanji}
                                                        className="p-2 rounded border border-gray-300 dark:border-blue-400 text-gray-700 font-bold text-xs hover:text-blue-400 dark:text-white hover:border-blue-500 transition-colors duration-300"
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
                                <div className="w-full mt-4 border-t  dark:border-gray-700 pt-5">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                            <FaFileAlt className="text-red-400"/> Word Decks:
                                        </h4>
                                    </div>

                                    {wordDecks.map((deck: WordDeck) => (
                                        <div key={deck._id}>
                                            <h1 className="text-xs pl-5 dark:text-gray-300">{deck.name}</h1>
                                            <div className="flex flex-wrap gap-2 pl-5">
                                                {deck.elements.map((element) => (
                                                    <span
                                                        key={element.word}
                                                        className="p-2 rounded border border-gray-300 dark:border-red-400 text-gray-700 font-bold text-xs hover:text-blue-400 dark:text-white hover:border-blue-500 transition-colors duration-300"
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
                                <div className="w-full pt-5 mt-5 border-t dark:border-gray-700">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                            <FaBook className="text-green-400"/> Grammar Decks:
                                        </h4>
                                    </div>

                                    {grammarDecks.map((deck: GrammarDeck) => (
                                        <div key={deck._id}>
                                            <h1 className="text-xs pl-5 dark:text-gray-300">{deck.name}</h1>
                                            <div className="flex flex-wrap gap-2 pl-5">
                                                {deck.elements.map((element) => (
                                                    <span
                                                        key={element.structure}
                                                        className="p-2 rounded border border-gray-300 dark:border-green-400 text-gray-700 font-bold text-xs hover:text-blue-400 dark:text-white hover:border-blue-500 transition-colors duration-300"
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