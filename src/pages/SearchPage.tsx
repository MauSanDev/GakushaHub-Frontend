import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import SaveDeckInput from '../components/SaveDeckInput';
import loadingIcon from '../assets/loading-icon.svg';
import KanjiBox from '../components/KanjiBox';
import WordBox from '../components/WordBox';
import { useSearchContent } from '../hooks/useSearchContent';
import { useBuildCourse, parseDecks} from '../hooks/useBuildCourse';

const SearchPage: React.FC = () => {
    const [tagsMap, setTagsMap] = useState<{ [tag: string]: boolean }>({});
    const { kanjiResults, wordResults, loading, error } = useSearchContent(tagsMap);

    const { mutate: buildCourse, isLoading: isSaving, isError: saveError, isSuccess: saveSuccess } = useBuildCourse();

    const handleSaveDeck = (courseId: string | null, courseName: string, lessonName: string, deckName: string,) => {
        const decks = parseDecks(deckName, kanjiResults, wordResults, [])
        buildCourse({courseId, courseName, lessonName, deckName, decks});
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">
            <div className="text-center w-full max-w-md mt-40">
                <h1 className="text-3xl font-bold mb-4">Let's 探します</h1>
                <SearchBar
                    onTagsChange={setTagsMap}
                    tagsMap={tagsMap}
                    interactable={true}
                />
            </div>

            <div className="fixed top-4 right-4">
                <SaveDeckInput onSave={handleSaveDeck}/>
            </div>

            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80 z-10 transition-opacity duration-500">
                    <img src={loadingIcon} alt="Loading..." className="w-16 h-16" />
                </div>
            )}

            {isSaving && (
                <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80 z-10 transition-opacity duration-500">
                    <p>Guardando curso...</p>
                </div>
            )}

            {saveError && (
                <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80 z-10 transition-opacity duration-500">
                    <p className="text-red-500">Error al guardar el curso.</p>
                </div>
            )}

            {saveSuccess && (
                <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80 z-10 transition-opacity duration-500">
                    <p className="text-green-500">Curso guardado con éxito.</p>
                </div>
            )}

            <div className="mt-8 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left transition-opacity duration-500">
                {error && <p className="text-red-500 col-span-full">{error}</p>}
                {kanjiResults && kanjiResults.map((kanjiData, index) => (
                    <KanjiBox key={index} result={kanjiData} />
                ))}
                {wordResults && wordResults.map((wordData, index) => (
                    <WordBox key={index} result={wordData} />
                ))}
            </div>
        </div>
    );
};

export default SearchPage;