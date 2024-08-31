import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
// import SaveDeckInput from '../components/SaveDeckInput';
import loadingIcon from '../assets/loading-icon.svg';
import KanjiBox from '../components/KanjiBox';
import WordBox from '../components/WordBox';
import { useSearchContent } from '../hooks/useSearchContent';

const SearchPage: React.FC = () => {
    const [tagsMap, setTagsMap] = useState<{ [tag: string]: boolean }>({});
    // const [showSaveInput, setShowSaveInput] = useState(false);

    const { kanjiResults, wordResults, loading, error } = useSearchContent(tagsMap);

    // const handleSearch = () => {
    //     const currentQuery = Object.keys(tagsMap).join(',');
    //     if (currentQuery === lastQuery) return;
    //     setLastQuery(currentQuery);
    //     setShowSaveInput(false);
    //     setResetSaveComponent(true);
    //     setTagsMap(updatedTagsMap);
    // };

    // const handleSaveDeck = async (
    //     courseId: string | null,
    //     courseName: string,
    //     lessonName: string,
    //     deckName: string
    // ) => {
    //     const kanjiIds = kanjiResults ? kanjiResults.map((kanji) => kanji._id) : []; //TODO: maybe delete?
    //     const wordIds = wordResults ? wordResults.map((word) => word._id) : [];
    //
    //     const decks = [];
    //
    //     if (kanjiIds.length > 0) {
    //         decks.push({
    //             deckName: `${deckName} - Kanji`,
    //             elements: kanjiIds,
    //             deckType: 'kanji',
    //         });
    //     }
    //
    //     if (wordIds.length > 0) {
    //         decks.push({
    //             deckName: `${deckName} - Words`,
    //             elements: wordIds,
    //             deckType: 'word',
    //         });
    //     }
    //
    //     try {
    //         if (decks.length > 0) {
    //             await fetch('http://localhost:3000/api/course/build', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({
    //                     courseId,
    //                     courseName,
    //                     lessonName,
    //                     decks,
    //                 }),
    //             });
    //         }
    //     } catch (error) {
    //         console.error('Error al guardar el deck:', error);
    //     }
    // };

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

            {/*{showSaveInput && (*/}
            {/*    <div className="fixed top-4 right-4">*/}
            {/*        <SaveDeckInput*/}
            {/*            onSave={handleSaveDeck}*/}
            {/*            key= "default"*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*)}*/}

            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80 z-10 transition-opacity duration-500">
                    <img src={loadingIcon} alt="Loading..." className="w-16 h-16" />
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