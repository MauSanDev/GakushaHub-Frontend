import React, { useState, useEffect } from 'react';
import SearchBar from '../../components/SearchBar';
import SaveDeckInput from '../../components/SaveDeckInput';
import KanjiBox from '../../components/KanjiBox';
import WordBox from '../../components/WordBox';
import GrammarElement from '../../components/GrammarElement.tsx';
import { useSearchContent } from '../../hooks/useSearchContent';
import { SaveStatus } from '../../utils/SaveStatus';
import { useAuth } from '../../context/AuthContext.tsx';
import SearchPageContainer from './SearchPageContainer.tsx';
import {FaCheckSquare, FaEraser, FaSquare} from 'react-icons/fa';
import { KanjiData } from '../../data/KanjiData';
import { WordData } from '../../data/WordData';
import { GrammarData } from '../../data/GrammarData.ts';
import LocSpan from "../../components/LocSpan.tsx";
import SectionContainer from "../../components/ui/containers/SectionContainer.tsx";

interface SearchPageProps {
    courseId?: string;
    courseName?: string;
    lessonName?: string;
    deckName?: string;
    onSaveSuccess?: () => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ courseId, courseName, lessonName, deckName, onSaveSuccess }) => {
    const [activeTab, setActiveTab] = useState<'kanji' | 'word' | 'grammar'>('kanji'); // Tab activa
    const [showKanji, setShowKanji] = useState(true);
    const [showWord, setShowWord] = useState(true);
    const [showGrammar, setShowGrammar] = useState(false);
    const [showReadings, setShowReadings] = useState(false);
    const [searchExecuted, setSearchExecuted] = useState(false);

    const { mutate: searchContent, data, isLoading } = useSearchContent();
    const { isAuthenticated } = useAuth();

    const [selectedKanji, setSelectedKanji] = useState<KanjiData[]>([]);
    const [selectedWords, setSelectedWords] = useState<WordData[]>([]);
    const [selectedGrammar, setSelectedGrammar] = useState<GrammarData[]>([]);

    useEffect(() => {
        if (data?.kanjiResults.length ?? 0 > 0) {
            setSelectedKanji(data?.kanjiResults ?? []);
        }
        if (data?.wordResults.length ?? 0 > 0) {
            setSelectedWords(data?.wordResults ?? []);
        }
        if (data?.grammarResults.length ?? 0 > 0) {
            setSelectedGrammar(data?.grammarResults ?? []);
        }

        // Lógica para seleccionar automáticamente la pestaña con resultados
        if (data) {
            if (data.kanjiResults.length > 0) {
                setActiveTab('kanji');
            } else if (data.wordResults.length > 0) {
                setActiveTab('word');
            } else if (data.grammarResults.length > 0) {
                setActiveTab('grammar');
            }
        }
    }, [data]);

    const onSaveStatusChanged = (status: SaveStatus) => {
        if (status === SaveStatus.Success && onSaveSuccess) {
            onSaveSuccess();
        }
    };

    const onSavePressed = (updatedTagsMap: { [tag: string]: boolean }) => {
        setSearchExecuted(true);
        searchContent({
            tagsMap: updatedTagsMap,
            options: { showKanji, showWord, showGrammar }
        });
    };

    const onClearSearch = () => {
        setSearchExecuted(false);
        setSelectedKanji([]);
        setSelectedWords([]);
        setSelectedGrammar([]);
        setActiveTab('kanji');
    };

    const kanjiResults = data?.kanjiResults || [];
    const wordResults = data?.wordResults || [];
    const grammarResults = data?.grammarResults || [];

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
        <SectionContainer className={`${searchExecuted ? "min-h-screen flex flex-col w-full overflow-y-auto items-center pt-24" : "flex flex-col items-center justify-center w-full overflow-y-auto"}`}  isLoading={isLoading}>
            <div className="text-center w-full max-w-md">
                <h1 className="text-3xl font-bold mb-4 text-black dark:text-white"><LocSpan textKey={"searchPage.title"} /></h1>

                <div className="w-full max-w-md flex justify-center gap-4 p-1.5 dark:border-gray-700">
                    <button
                        onClick={() => handleToggle('kanji')}
                        className={`flex items-center gap-2 px-2 py-1 text-sm rounded transition-colors duration-300 ${showKanji ? 'bg-blue-500 dark:bg-blue-800 text-white border border-blue-500 dark:border-gray-900' : 'border dark:border-gray-600 dark:text-gray-300 border-gray-300 text-gray-500'}`}
                        title="Kanji"
                    >
                        {showKanji ? <FaCheckSquare className="text-white" /> : <FaSquare className="text-gray-300" />}
                        <LocSpan textKey={"kanji"} />
                    </button>
                    <button
                        onClick={() => handleToggle('word')}
                        className={`flex items-center gap-2 px-2 py-1 text-sm rounded transition-colors duration-300 ${showWord ? 'bg-blue-500 dark:bg-blue-800 text-white border border-blue-500 dark:border-gray-900' : 'border dark:border-gray-600 dark:text-gray-300 border-gray-300 text-gray-500'}`}
                        title="Words"
                    >
                        {showWord ? <FaCheckSquare className="text-white" /> : <FaSquare className="text-gray-300" />}
                        <LocSpan textKey={"words"} />
                    </button>
                    <button
                        onClick={() => handleToggle('grammar')}
                        className={`flex items-center gap-2 px-2 py-1 text-sm rounded transition-colors duration-300 ${showGrammar ? 'bg-blue-500 dark:bg-blue-800 text-white border border-blue-500 dark:border-gray-900' : 'border dark:border-gray-600 dark:text-gray-300 border-gray-300 text-gray-500'}`}
                        title="Grammar"
                    >
                        {showGrammar ? <FaCheckSquare className="text-white" /> : <FaSquare className="text-gray-300" />}
                        <LocSpan textKey={"grammar"} />
                    </button>
                </div>

                <SearchBar onSearch={onSavePressed} interactable={!isLoading} />
                {searchExecuted && (
                    <div className="flex justify-center w-full mt-4">
                        <button
                            onClick={onClearSearch}
                            className="flex justify-center text-center text-xs border dark:border-gray-700 rounded-full px-3 py-1 transition-all duration-300 transform lg:hover:scale-105 hover:shadow-md items-center gap-2 bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-blue-300 hover:text-white"
                        >
                            <FaEraser/>
                            <LocSpan textKey={"clearSearch"}/>
                        </button>
                    </div>
                )}
            </div>

            {searchExecuted && (
                <>
                    <div className="w-full max-w-4xl mt-6 flex justify-center">
                        <div className="flex w-full border-b border-gray-700">

                            {kanjiResults.length > 0 &&
                                <button
                                    onClick={() => setActiveTab('kanji')}
                                    className={`w-full px-4 py-1text-sm font-medium transition-colors duration-300 ${activeTab === 'kanji' ? 'bg-blue-500 dark:bg-blue-800 text-white' : 'dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300'}`}
                                >
                                    Kanji <p className="text-xs">({kanjiResults.length} Results
                                    | {selectedKanji.length} Selected)</p>
                                </button>
                            }

                            {wordResults.length > 0 &&
                                <button
                                    onClick={() => setActiveTab('word')}
                                    className={`w-full px-4 py-1 text-sm font-medium transition-colors duration-300 ${activeTab === 'word' ? 'bg-blue-500 dark:bg-blue-800 text-white' : 'dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300'}`}
                                >
                                    Words <p className="text-xs">({wordResults.length} Results
                                    | {selectedWords.length} Selected)</p>
                                </button>
                            }

                            {grammarResults.length > 0 &&
                                <button
                                    onClick={() => setActiveTab('grammar')}
                                    className={`w-full px-4 py-1 text-sm font-medium transition-colors duration-300 ${activeTab === 'grammar' ? 'bg-blue-500 dark:bg-blue-800 text-white border-blue-500' : 'dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300'}`}
                                >
                                    Grammar <p className="text-xs">({grammarResults.length} Results
                                    | {selectedGrammar.length} Selected)</p>
                                </button>
                            }
                        </div>
                    </div>

                    <div className="mt-4 w-full max-w-4xl gap-2 flex flex-wrap justify-center items-center px-2">
                        {activeTab === 'kanji' && showKanji && kanjiResults.length > 0 && (
                            <SearchPageContainer<KanjiData>
                                items={kanjiResults}
                                renderItem={(kanjiData, isSelected, onSelect) => (
                                    <KanjiBox
                                        key={kanjiData.kanji}
                                        result={kanjiData}
                                        isSelected={isSelected}
                                        onSelect={onSelect}
                                    />
                                )}
                                onSelectionChange={setSelectedKanji}
                            />
                        )}

                        {activeTab === 'word' && showWord && wordResults.length > 0 && (
                            <SearchPageContainer<WordData>
                                items={wordResults}
                                renderItem={(wordData, isSelected, onSelect) => (
                                    <WordBox
                                        key={wordData.word}
                                        result={wordData}
                                        isSelected={isSelected}
                                        onSelect={onSelect}
                                    />
                                )}
                                onSelectionChange={setSelectedWords}
                            />
                        )}

                        {activeTab === 'grammar' && showGrammar && grammarResults.length > 0 && (
                            <SearchPageContainer<GrammarData>
                                items={grammarResults}
                                maxColumns={1}
                                renderItem={(grammarData, isSelected, onSelect) => (
                                    <GrammarElement
                                        key={grammarData.structure}
                                        result={grammarData}
                                        isSelected={isSelected}
                                        onSelect={onSelect}
                                    />
                                )}
                                onSelectionChange={setSelectedGrammar}
                            />
                        )}
                    </div>
                </>
            )}

            {isAuthenticated && (
                <div className="absolute top-0 right-0 flex gap-2">
                    <SaveDeckInput
                        kanjiList={selectedKanji}
                        wordList={selectedWords}
                        grammarList={selectedGrammar}
                        readingList={[]}
                        onSaveStatusChange={onSaveStatusChanged}
                        courseId={courseId}
                        courseName={courseName}
                        lessonName={lessonName}
                        deckName={deckName}
                    />
                </div>
            )}
        </SectionContainer>
    );
};

export default SearchPage;