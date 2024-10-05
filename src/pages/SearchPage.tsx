import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import SaveDeckInput from '../components/SaveDeckInput';
import KanjiBox from '../components/KanjiBox';
import WordBox from '../components/WordBox';
import LoadingScreen from '../components/LoadingScreen';
import { useSearchContent } from '../hooks/useSearchContent';
import { SaveStatus } from "../utils/SaveStatus";
import { useAuth } from "../context/AuthContext.tsx";
import { KanjiData } from "../data/KanjiData";
import { WordData } from "../data/WordData";
import { FaEye, FaEyeSlash, FaCheckSquare, FaSquare, FaTrashAlt, FaBookOpen, FaFileAlt, FaBook, FaEye as FaReadingIcon } from 'react-icons/fa';

interface SearchPageProps {
    courseId?: string;
    courseName?: string;
    lessonName?: string;
    deckName?: string;
    onSaveSuccess?: () => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ courseId, courseName, lessonName, deckName, onSaveSuccess }) => {
    const [showKanji, setShowKanji] = useState(true); // Kanji toggle on by default
    const [showWord, setShowWord] = useState(true);   // Word toggle on by default
    const [showGrammar, setShowGrammar] = useState(false); // Grammar toggle off by default
    const [showReadings, setShowReadings] = useState(false); // Reading toggle off by default
    const { mutate: searchContent, data, isLoading } = useSearchContent(); // Execute mutation

    const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.Idle);
    const { isAuthenticated } = useAuth();

    const [selectedKanji, setSelectedKanji] = useState<KanjiData[]>([]);
    const [selectedWords, setSelectedWords] = useState<WordData[]>([]);
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);
    const [showDeselectTooltip, setShowDeselectTooltip] = useState(false);
    const [showSelectedTooltip, setShowSelectTooltip] = useState(false);

    useEffect(() => {
        if (data?.kanjiResults) {
            setSelectedKanji(data.kanjiResults);
        }
    }, [data?.kanjiResults]);

    useEffect(() => {
        if (data?.wordResults) {
            setSelectedWords(data.wordResults);
        }
    }, [data?.wordResults]);

    const toggleDeselectTooltip = () => {
        setShowDeselectTooltip(!showDeselectTooltip);
    };
    const toggleSelectedTooltip = () => {
        setShowSelectTooltip(!showSelectedTooltip);
    };

    const onSaveStatusChanged = (status: SaveStatus) => {
        setSaveStatus(status);
        if (status === SaveStatus.Success && onSaveSuccess) {
            onSaveSuccess();
        }
    };
    
    const onSavePressed = (updatedTagsMap: { [tag: string]: boolean }) => {
        searchContent({
            tagsMap: updatedTagsMap,
            options: { showKanji, showWord, showGrammar }
        });
    };

    const isSaving = saveStatus === SaveStatus.Saving;

    const toggleSelectedKanji = (kanjiData: KanjiData, isSelected: boolean) => {
        setSelectedKanji(prevSelected =>
            isSelected ? [...prevSelected, kanjiData] : prevSelected.filter(item => item.kanji !== kanjiData.kanji)
        );
    };

    const toggleSelectedWord = (wordData: WordData, isSelected: boolean) => {
        setSelectedWords(prevSelected =>
            isSelected ? [...prevSelected, wordData] : prevSelected.filter(item => item.word !== wordData.word)
        );
    };

    const contentToShow = () => {
        if (showSelectedOnly) {
            return {
                kanjis: selectedKanji,
                words: selectedWords
            };
        }
        return {
            kanjis: data?.kanjiResults || [],
            words: data?.wordResults || []
        };
    };

    const { kanjis, words } = contentToShow();

    const selectAll = () => {
        setSelectedKanji(data?.kanjiResults || []);
        setSelectedWords(data?.wordResults || []);
    };

    const deselectAll = () => {
        setSelectedKanji([]);
        setSelectedWords([]);
    };

    const clearSearch = () => {
        setSelectedKanji([]);
        setSelectedWords([]);
    };

    const handleToggle = (type: string) => {
        switch (type) {
            case 'kanji':
                setShowKanji(!showKanji);
                break;
            case 'word':
                setShowWord(!showWord);
                break;
            case 'grammar':
                setShowGrammar(!showGrammar);
                break;
            case 'readings':
                setShowReadings(!showReadings);
                break;
            default:
                break;
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">
            <div className="mt-8 w-full max-w-md text-center">
                <div className="flex items-center gap-1.5 p-1.5 border border-gray-300 dark:border-gray-700 rounded-lg">
                    <button
                        onClick={() => handleToggle('kanji')}
                        className={`p-1 rounded transition-colors duration-300 ${showKanji ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 dark:bg-gray-800 text-blue-400 hover:bg-gray-300'}`}
                        title="Kanji"
                    >
                        <FaBookOpen className={`text-sm ${showKanji ? 'text-white' : 'text-blue-400'}`} />
                    </button>
                    <button
                        onClick={() => handleToggle('word')}
                        className={`p-1 rounded transition-colors duration-300 ${showWord ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-200 dark:bg-gray-800 text-red-500 hover:bg-gray-300'}`}
                        title="Words"
                    >
                        <FaFileAlt className={`text-sm ${showWord ? 'text-white' : 'text-red-500'}`} />
                    </button>
                    <button
                        onClick={() => handleToggle('grammar')}
                        className={`p-1 rounded transition-colors duration-300 ${showGrammar ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-200 dark:bg-gray-800 text-green-500 hover:bg-gray-300'}`}
                        title="Grammar"
                    >
                        <FaBook className={`text-sm ${showGrammar ? 'text-white' : 'text-green-500'}`} />
                    </button>
                    <button
                        onClick={() => handleToggle('readings')}
                        className={`p-1 rounded transition-colors duration-300 ${showReadings ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-gray-200 dark:bg-gray-800 text-yellow-400 hover:bg-gray-300'}`}
                        title="Readings"
                    >
                        <FaReadingIcon className={`text-sm ${showReadings ? 'text-white' : 'text-yellow-400'}`} />
                    </button>
                </div>
            </div>

            {/* Search bar */}
            <div className="text-center w-full max-w-md mt-4">
                <h1 className="text-3xl font-bold mb-4 text-black dark:text-white">Let's 探します</h1>
                <SearchBar
                    onSearch={onSavePressed}
                    interactable={!isSaving && !isLoading}
                />
            </div>

            {(kanjis.length > 0 || words.length > 0) && (
                <div className="mt-4 w-full max-w-4xl gap-2 flex flex-wrap justify-center items-center px-2">
                    {/* Primera línea: Selected y Show Selected */}
                    <div className="w-full flex justify-center items-center gap-2">
                        <span className="text-sm text-gray-700 dark:text-gray-500">
                            Selected: {selectedKanji.length} Kanji - {selectedWords.length} Words
                        </span>
                        <button
                            onClick={() => setShowSelectedOnly(!showSelectedOnly)}
                            className={`whitespace-nowrap text-xs border dark:border-gray-700 rounded-full px-3 py-2 transition-all duration-300 transform lg:hover:scale-105 hover:shadow-md flex items-center gap-2 ${
                                showSelectedOnly
                                    ? 'bg-blue-500 dark:bg-green-900 text-white'
                                    : 'bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-blue-300 hover:text-white'
                            }`}
                        >
                            {showSelectedOnly ? <FaEyeSlash /> : <FaEye />}
                            {showSelectedOnly ? 'Show All' : 'Show Selection'}
                        </button>
                    </div>

                    {/* Segunda línea: Select All, Deselect All, Clear Search */}
                    <div className="flex justify-center items-center gap-2 relative">

                        <div className="w-full flex justify-center items-center gap-2 relative">
                            <button
                                onClick={toggleSelectedTooltip}
                                className="whitespace-nowrap text-xs border dark:border-gray-700 rounded-full px-3 py-2 transition-all duration-300 transform lg:hover:scale-105 hover:shadow-md flex items-center gap-2 bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-blue-300 hover:text-white"
                            >
                                <FaCheckSquare />
                                Select All
                            </button>

                            {showSelectedTooltip && (
                                <div
                                    className="absolute z-50 top-full mt bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-lg">
                                    <button
                                        onClick={() => {
                                            setSelectedKanji(data?.kanjiResults ?? []);
                                            setShowDeselectTooltip(false);
                                        }}
                                        className="block px-4 py-1 w-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    >
                                        Kanji
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedWords(data?.wordResults ?? []);
                                            setShowDeselectTooltip(false);
                                        }}
                                        className="block px-4 py-1 w-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    >
                                        Words
                                    </button>
                                    <button
                                        onClick={() => {
                                            selectAll();
                                            setShowDeselectTooltip(false);
                                        }}
                                        className="block px-4 py-1 w-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    >
                                        All
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="w-full flex justify-center items-center gap-2 relative">
                            <button
                                onClick={toggleDeselectTooltip}
                                className="whitespace-nowrap text-xs border dark:border-gray-700 rounded-full px-3 py-2 transition-all duration-300 transform lg:hover:scale-105 hover:shadow-md flex items-center gap-2 bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-blue-300 hover:text-white"
                            >
                                <FaSquare />
                                Deselect All
                            </button>

                            {showDeselectTooltip && (
                                <div
                                    className="absolute z-50 top-full mt bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-lg">
                                    <button
                                        onClick={() => {
                                            setSelectedKanji([]);
                                            setShowDeselectTooltip(false);
                                        }}
                                        className="block px-4 py-1 w-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    >
                                        Kanji
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedWords([]);
                                            setShowDeselectTooltip(false);
                                        }}
                                        className="block px-4 py-1 w-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    >
                                        Words
                                    </button>
                                    <button
                                        onClick={() => {
                                            deselectAll();
                                            setShowDeselectTooltip(false);
                                        }}
                                        className="block px-4 py-1 w-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    >
                                        All
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={clearSearch}
                            className="whitespace-nowrap text-xs border dark:border-gray-700 rounded-full px-3 py-2 transition-all duration-300 transform lg:hover:scale-105 hover:shadow-md flex items-center gap-2 bg-gray-400 dark:bg-gray-900 text-white hover:bg-red-900 dark:hover:bg-red-600"
                        >
                            <FaTrashAlt />
                            Clear Search
                        </button>
                    </div>
                </div>
            )}

            {isAuthenticated &&
                <div className="absolute top-0 right-0 flex gap-2">
                    <SaveDeckInput
                        kanjiList={selectedKanji}
                        wordList={selectedWords}
                        grammarList={data?.grammarResults || []}
                        readingList={[]}
                        onSaveStatusChange={onSaveStatusChanged}
                        courseId={courseId}
                        courseName={courseName}
                        lessonName={lessonName}
                        deckName={deckName}
                    />
                </div>
            }

            <LoadingScreen isLoading={isLoading} />

            <div
                className="mt-8 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left transition-opacity duration-500 pb-24">
                {kanjis.map((kanjiData, index) => (
                    <KanjiBox
                        key={index}
                        result={kanjiData}
                        isSelected={selectedKanji.includes(kanjiData)}
                        onSelect={(selected) => toggleSelectedKanji(kanjiData, selected)}
                    />
                ))}
                {words.map((wordData, index) => (
                    <WordBox
                        key={index}
                        result={wordData}
                        isSelected={selectedWords.includes(wordData)}
                        onSelect={(selected) => toggleSelectedWord(wordData, selected)}
                    />
                ))}
            </div>
        </div>
    );
};

export default SearchPage;