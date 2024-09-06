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

const SearchPage: React.FC = () => {
    const [tagsMap, setTagsMap] = useState<{ [tag: string]: boolean }>({});
    const { kanjiResults, wordResults, loading, error } = useSearchContent(tagsMap);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.Idle);
    const { userData } = useAuth();

    // Estado para los kanjis y palabras seleccionados, con los tipos correctos
    const [selectedKanji, setSelectedKanji] = useState<KanjiData[]>([]);
    const [selectedWords, setSelectedWords] = useState<WordData[]>([]);

    const onSaveStatusChanged = (status: SaveStatus) => {
        setSaveStatus(status);
    };

    const isSaving = saveStatus === SaveStatus.Saving;

    // useEffect para seleccionar todos los kanjis por defecto cuando cambian los resultados
    useEffect(() => {
        if (kanjiResults) {
            setSelectedKanji(kanjiResults); // Selecciona todos los kanjis por defecto
        }
    }, [kanjiResults]);

    // useEffect para seleccionar todas las palabras por defecto cuando cambian los resultados
    useEffect(() => {
        if (wordResults) {
            setSelectedWords(wordResults); // Selecciona todas las palabras por defecto
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

            {userData && (selectedKanji.length > 0 || selectedWords.length > 0) && (
                <div className="fixed top-4 right-4">
                    <SaveDeckInput
                        kanjiList={selectedKanji}
                        wordList={selectedWords}
                        grammarList={[]}
                        readingList={[]}
                        onSaveStatusChange={onSaveStatusChanged}
                    />
                </div>
            )}

            <LoadingScreen isLoading={loading} />

            <div className="mt-8 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left transition-opacity duration-500">
                {error && <p className="text-red-500 col-span-full">{error}</p>}
                {kanjiResults && kanjiResults.map((kanjiData, index) => (
                    <KanjiBox
                        key={index}
                        result={kanjiData}
                        isSelected={selectedKanji.includes(kanjiData)}
                        onSelect={(selected) => toggleSelectedKanji(kanjiData, selected)}
                    />
                ))}
                {wordResults && wordResults.map((wordData, index) => (
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