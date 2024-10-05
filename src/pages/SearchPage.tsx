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
import { FaEye, FaEyeSlash, FaCheckSquare, FaSquare, FaTrashAlt } from 'react-icons/fa';

interface SearchPageProps {
    courseId?: string;
    courseName?: string;
    lessonName?: string;
    deckName?: string;
    onSaveSuccess?: () => void; 
}

const SearchPage: React.FC<SearchPageProps> = ({ courseId, courseName, lessonName, deckName, onSaveSuccess }) => {
    const [tagsMap, setTagsMap] = useState<{ [tag: string]: boolean }>({});
    const { kanjiResults, wordResults, loading, error } = useSearchContent(tagsMap);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.Idle);
    const { isAuthenticated } = useAuth();

    const [selectedKanji, setSelectedKanji] = useState<KanjiData[]>([]);
    const [selectedWords, setSelectedWords] = useState<WordData[]>([]);
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);
    const [showDeselectTooltip, setShowDeselectTooltip] = useState(false);
    const [showSelectedTooltip, setShowSelectTooltip] = useState(false);

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

    const isSaving = saveStatus === SaveStatus.Saving;

    useEffect(() => {
        if (kanjiResults) {
            setSelectedKanji(kanjiResults);
        }
    }, [kanjiResults]);

    useEffect(() => {
        if (wordResults) {
            setSelectedWords(wordResults);
        }
    }, [wordResults]);

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
            kanjis: kanjiResults || [],
            words: wordResults || []
        };
    };

    const { kanjis, words } = contentToShow();


    const selectAll = () => {
        setSelectedKanji(kanjiResults || []);
        setSelectedWords(wordResults || []);
    };


    const deselectAll = () => {
        setSelectedKanji([]);
        setSelectedWords([]);
    };


    const clearSearch = () => {
        setTagsMap({});
        setSelectedKanji([]);
        setSelectedWords([]);
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">
            <div className="text-center w-full max-w-md mt-40">
                <h1 className="text-3xl font-bold mb-4 text-black dark:text-white">Let's 探します</h1>
                <SearchBar
                    onTagsChange={setTagsMap}
                    tagsMap={tagsMap}
                    interactable={!isSaving && !loading}
                />
            </div>


            {(kanjiResults.length > 0 || wordResults.length > 0) && (
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
                                <FaCheckSquare/>
                                Select All
                            </button>

                            {showSelectedTooltip && (
                                <div
                                    className="absolute z-50 top-full mt bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-lg">
                                    <button
                                        onClick={() => {
                                            setSelectedKanji(kanjiResults);
                                            setShowDeselectTooltip(false)
                                        }}
                                        className="block px-4 py-1 w-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    >
                                        Kanji
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedWords(wordResults);
                                            setShowDeselectTooltip(false)
                                        }}
                                        className="block px-4 py-1 w-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    >
                                        Words
                                    </button>
                                    <button
                                        onClick={() => {
                                            selectAll();
                                            setShowDeselectTooltip(false)
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
                                <FaSquare/>
                                Deselect All
                            </button>

                            {showDeselectTooltip && (
                                <div
                                    className="absolute z-50 top-full mt bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow-lg">
                                    <button
                                        onClick={() => {
                                            setSelectedKanji([]);
                                            setShowDeselectTooltip(false)
                                        }}
                                        className="block px-4 py-1 w-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    >
                                        Kanji
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedWords([]);
                                            setShowDeselectTooltip(false)
                                        }}
                                        className="block px-4 py-1 w-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    >
                                        Words
                                    </button>
                                    <button
                                        onClick={() => {
                                            deselectAll();
                                            setShowDeselectTooltip(false)
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
                            <FaTrashAlt/>
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
                        grammarList={[]}
                        readingList={[]}
                        onSaveStatusChange={onSaveStatusChanged}
                        courseId={courseId}
                        courseName={courseName}
                        lessonName={lessonName}
                        deckName={deckName}
                    />
                </div>
            }

            <LoadingScreen isLoading={loading}/>

            <div
                className="mt-8 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left transition-opacity duration-500 pb-24">
                {error && <p className="text-red-500 col-span-full">{error}</p>}
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