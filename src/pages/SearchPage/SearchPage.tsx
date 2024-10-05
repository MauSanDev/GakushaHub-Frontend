import React, { useState, useEffect } from 'react';
import SearchBar from '../../components/SearchBar';
import SaveDeckInput from '../../components/SaveDeckInput';
import KanjiBox from '../../components/KanjiBox';
import WordBox from '../../components/WordBox';
import GrammarBox from '../../components/GrammarStructureBox';
import LoadingScreen from '../../components/LoadingScreen';
import { useSearchContent } from '../../hooks/useSearchContent';
import { SaveStatus } from '../../utils/SaveStatus';
import { useAuth } from '../../context/AuthContext.tsx';
import SearchPageContainer from './SearchPageContainer.tsx';
import { FaCheckSquare, FaSquare } from 'react-icons/fa';
import { KanjiData } from '../../data/KanjiData';
import { WordData } from '../../data/WordData';
import { GrammarData } from '../../data/GrammarData.ts';

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
            setSelectedKanji(data?.kanjiResults ?? [])
        }
        if (data?.wordResults.length ?? 0 > 0) {
            setSelectedWords(data?.wordResults ?? [])
        }
        if (data?.grammarResults.length ?? 0 > 0) {
            setSelectedGrammar(data?.grammarResults ?? [])
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
        <div className={`${searchExecuted ? "min-h-screen flex flex-col w-full overflow-y-auto items-center pt-24" : "flex flex-col items-center justify-center w-full overflow-y-auto"}`}>
            <div className="text-center w-full max-w-md">
                <h1 className="text-3xl font-bold mb-4 text-black dark:text-white">Let's 探します</h1>

                <div className="w-full max-w-md flex justify-center gap-4 p-1.5 dark:border-gray-700">
                    <button
                        onClick={() => handleToggle('kanji')}
                        className={`flex items-center gap-2 px-2 py-1 text-sm rounded transition-colors duration-300 ${showKanji ? 'bg-blue-500 dark:bg-blue-800 text-white border border-blue-500 dark:border-gray-900' : 'border dark:border-gray-600 dark:text-gray-300 border-gray-300 text-gray-500'}`}
                        title="Kanji"
                    >
                        {showKanji ? <FaCheckSquare className="text-white" /> : <FaSquare className="text-gray-300" />}
                        <span>Kanji</span>
                    </button>
                    <button
                        onClick={() => handleToggle('word')}
                        className={`flex items-center gap-2 px-2 py-1 text-sm rounded transition-colors duration-300 ${showWord ? 'bg-blue-500 dark:bg-blue-800 text-white border border-blue-500 dark:border-gray-900' : 'border dark:border-gray-600 dark:text-gray-300 border-gray-300 text-gray-500'}`}
                        title="Words"
                    >
                        {showWord ? <FaCheckSquare className="text-white" /> : <FaSquare className="text-gray-300" />}
                        <span>Words</span>
                    </button>
                    <button
                        onClick={() => handleToggle('grammar')}
                        className={`flex items-center gap-2 px-2 py-1 text-sm rounded transition-colors duration-300 ${showGrammar ? 'bg-blue-500 dark:bg-blue-800 text-white border border-blue-500 dark:border-gray-900' : 'border dark:border-gray-600 dark:text-gray-300 border-gray-300 text-gray-500'}`}
                        title="Grammar"
                    >
                        {showGrammar ? <FaCheckSquare className="text-white" /> : <FaSquare className="text-gray-300" />}
                        <span>Grammar</span>
                    </button>
                    {/*<button*/}
                    {/*    onClick={() => handleToggle('readings')}*/}
                    {/*    className={`flex items-center gap-2 px-2 py-1 text-sm rounded transition-colors duration-300 ${showReadings ? 'bg-gray-800 text-white border border-gray-900' : 'border dark:border-gray-600 text-gray-300'}`}*/}
                    {/*    title="Readings"*/}
                    {/*>*/}
                    {/*    {showReadings ? <FaCheckSquare className="text-white" /> : <FaSquare className="text-gray-300" />}*/}
                    {/*    <span>Readings</span>*/}
                    {/*</button>*/}
                </div>

                <SearchBar onSearch={onSavePressed} interactable={!isLoading} />
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
                                    <GrammarBox
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

            <LoadingScreen isLoading={isLoading}/>
        </div>
    );
};

export default SearchPage;