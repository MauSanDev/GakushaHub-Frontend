import React, { useState, useEffect } from 'react';
import SearchBar from '../../components/SearchBar';
import SaveDeckInput from '../../components/SaveDeckInput';
import KanjiDataElement from '../../components/KanjiDataElement.tsx';
import WordDataElement from '../../components/WordDataElement.tsx';
import GrammarDataElement from '../../components/GrammarDataElement.tsx';
import { useSearchContent } from '../../hooks/useSearchContent';
import { SaveStatus } from '../../utils/SaveStatus';
import { useAuth } from '../../context/AuthContext.tsx';
import SearchPageContainer from './SearchPageContainer.tsx';
import { FaEraser } from 'react-icons/fa';
import { KanjiData } from '../../data/KanjiData';
import { WordData } from '../../data/WordData';
import { GrammarData } from '../../data/GrammarData.ts';
import LocSpan from "../../components/LocSpan.tsx";
import SectionContainer from "../../components/ui/containers/SectionContainer.tsx";
import SelectionToggle from "../../components/ui/toggles/SelectionToggle.tsx";
import SecondaryButton from "../../components/ui/buttons/SecondaryButton.tsx";

interface SearchPageProps {
    courseId?: string;
    courseName?: string;
    lessonName?: string;
    deckName?: string;
    onSaveSuccess?: () => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ courseId, courseName, lessonName, deckName, onSaveSuccess }) => {
    const [activeTab, setActiveTab] = useState<'kanji' | 'words' | 'grammar'>('kanji'); // Tab activa
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
                setActiveTab('words');
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
            case 'words':
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
                    <SelectionToggle isSelected={showKanji} onToggle={() => handleToggle('kanji')} textKey={'kanji'} />
                    <SelectionToggle isSelected={showWord} onToggle={() => handleToggle('words')} textKey={'words'} />
                    <SelectionToggle isSelected={showGrammar} onToggle={() => handleToggle('grammar')} textKey={'grammar'} />
                </div>

                <SearchBar onSearch={onSavePressed} interactable={!isLoading} />
                {searchExecuted && (
                    <SecondaryButton onClick={onClearSearch} label={"clearSearch"} IconComponent={<FaEraser />} />
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
                                    onClick={() => setActiveTab('words')}
                                    className={`w-full px-4 py-1 text-sm font-medium transition-colors duration-300 ${activeTab === 'words' ? 'bg-blue-500 dark:bg-blue-800 text-white' : 'dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300'}`}
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
                                    <KanjiDataElement
                                        key={kanjiData.kanji}
                                        result={kanjiData}
                                        isSelected={isSelected}
                                        onSelect={onSelect}
                                    />
                                )}
                                onSelectionChange={setSelectedKanji}
                            />
                        )}

                        {activeTab === 'words' && showWord && wordResults.length > 0 && (
                            <SearchPageContainer<WordData>
                                items={wordResults}
                                renderItem={(wordData, isSelected, onSelect) => (
                                    <WordDataElement
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
                                    <GrammarDataElement
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