import React, { useState, useEffect } from 'react';
import { FaPaperPlane, FaCheckSquare, FaSquare, FaBookOpen, FaFileAlt, FaBook, FaQuestion } from 'react-icons/fa';
import LoadingScreen from '../LoadingScreen';
import { useGenerateText } from '../../hooks/useGenerateText';
import { GeneratedData } from "../../data/GenerationData.ts";
import { useLocation, useNavigate } from 'react-router-dom';
import TooltipButton from "../TooltipButton.tsx";
import { useBuildCourse } from "../../hooks/useBuildCourse.ts";
import { useTranslation } from 'react-i18next';
import LocSpan from "../LocSpan.tsx";
import ModalWrapper from "../../pages/ModalWrapper.tsx";
import Container from "../ui/containers/Container.tsx";
import PrimaryButton from "../ui/buttons/PrimaryButton.tsx";
import {CollectionTypes} from "../../data/CollectionTypes.tsx";
import ModalTitle from "../ui/text/ModalTitle.tsx";

interface NewGenerationPageProps {
    courseId?: string,
    courseName?: string,
    lessonName?: string,
    deckName?: string,
    termsDictionary?: Record<CollectionTypes, string[]>;
    onClose: () => void;
}

const NewGenerationPage: React.FC<NewGenerationPageProps> = ({ termsDictionary, courseName, courseId, lessonName, deckName, onClose }) => {
    const { t, i18n } = useTranslation();

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

    function getPrioritizedKanji() {
        return getRandomElements(termsDictionary?.[CollectionTypes.Kanji] || [], 50);
    }

    function getPrioritizedWords() {
        return getRandomElements(termsDictionary?.[CollectionTypes.Word] || [], 25);
    }

    function getPrioritizedGrammar() {
        return getRandomElements(termsDictionary?.[CollectionTypes.Grammar] || [], 10);
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

                        if ((courseId || courseName) && lessonName && termsDictionary) {
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
        <ModalWrapper onClose={onClose}>
            <Container>
                <LoadingScreen isLoading={isLoading} />
                <div className="flex flex-col items-center justify-center mb-4">
                    <div className="flex items-center justify-center mb-4">
                        <ModalTitle title={"何読みたいの？"} className={"text-center"} />
                        <div className={"absolute right-10"}>
                            <TooltipButton
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
                            className={`input-field ${style ? 'border-blue-500' : ''}`}
                            disabled={isLoading}
                        >
                            <option value="">{t(`generationPage.selectStyle`)}</option>
                            {writingStyleKeys.map((key) => (
                                <option key={key} value={key}>
                                    {i18n.getFixedT("ja")(`generationStyles.${key}`, `generationStyles.${key}`)} -
                                    {t(`generationStyles.${key}`)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col w-full sm:w-1/4">
                        <select
                            id="jlptLevel"
                            value={jlptLevel ?? ""}
                            onChange={(e) => setJlptLevel(e.target.value ? Number(e.target.value) : 0)}
                            className={`input-field ${jlptLevel ? 'border-blue-500' : ''}`}
                            disabled={isLoading}
                        >
                            <option value=""> {t("generationPage.selectYourLevel")}</option>
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
                            className={`input-field ${topic ? 'border-blue-500' : ''}`}
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
                    <div className="flex w-full sm:w-1/4 justify-end">
                        <PrimaryButton label={"generationPage.generate"} iconComponent={<FaPaperPlane />} onClick={handleGenerate} disabled={isLoading || !isGenerateEnabled} />
                    </div>
                </div>

                <div className="flex items-center mb-4 mt-4">
                    <button
                        onClick={() => setIsAnonymous(!isAnonymous)}
                        className="flex items-center space-x-2"
                    >
                        {isAnonymous ? (
                            <FaCheckSquare className="text-blue-600" size={24} />
                        ) : (
                            <FaSquare className="text-gray-400" size={24} />
                        )}
                        <span
                            className="text-sm text-gray-500"><LocSpan textKey={"generationPage.anonymousDisclaimer"} /></span>
                    </button>
                </div>

                {termsDictionary && Object.keys(termsDictionary).length > 0 && (
                    <div className="w-full border-gray-200 rounded border p-3 max-h-64 overflow-y-auto dark:border-gray-700 pb-8">
                        <h1 className="font-bold border-b mb-5 dark:text-white dark:border-gray-700">
                            <LocSpan textKey={"priority"} />
                        </h1>

                        {termsDictionary[CollectionTypes.Kanji] && termsDictionary[CollectionTypes.Kanji].length > 0 && (
                            <div className="w-full">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                        <FaBookOpen className="text-blue-400" /> <LocSpan textKey={"kanjiDecks"} />:
                                    </h4>
                                </div>
                                <div className="flex flex-wrap gap-2 pl-5">
                                    {termsDictionary[CollectionTypes.Kanji].map((kanji) => (
                                        <span
                                            key={kanji}
                                            className="p-2 rounded border border-gray-300 dark:border-blue-400 text-gray-700 font-bold text-xs hover:text-blue-400 dark:text-white hover:border-blue-500 transition-colors duration-300"
                                        >
                                            {kanji}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {termsDictionary[CollectionTypes.Word] && termsDictionary[CollectionTypes.Word].length > 0 && (
                            <div className="w-full mt-4 border-t dark:border-gray-700 pt-5">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                        <FaFileAlt className="text-red-400" /> <LocSpan textKey={"wordDecks"} />:
                                    </h4>
                                </div>
                                <div className="flex flex-wrap gap-2 pl-5">
                                    {termsDictionary[CollectionTypes.Word].map((word) => (
                                        <span
                                            key={word}
                                            className="p-2 rounded border border-gray-300 dark:border-red-400 text-gray-700 font-bold text-xs hover:text-blue-400 dark:text-white hover:border-blue-500 transition-colors duration-300"
                                        >
                                            {word}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {termsDictionary[CollectionTypes.Grammar] && termsDictionary[CollectionTypes.Grammar].length > 0 && (
                            <div className="w-full pt-5 mt-5 border-t dark:border-gray-700">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                        <FaBook className="text-green-400" /> <LocSpan textKey={"grammarDecks"} />:
                                    </h4>
                                </div>
                                <div className="flex flex-wrap gap-2 pl-5">
                                    {termsDictionary[CollectionTypes.Grammar].map((grammar) => (
                                        <span
                                            key={grammar}
                                            className="p-2 rounded border border-gray-300 dark:border-green-400 text-gray-700 font-bold text-xs hover:text-blue-400 dark:text-white hover:border-blue-500 transition-colors duration-300"
                                        >
                                            {grammar}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Container>
        </ModalWrapper>
    );
};

export default NewGenerationPage;