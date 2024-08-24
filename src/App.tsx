import { useState } from 'react';
import './App.css';
import { KanjiData, WordData } from './data/data-structures';
import SearchBar from './components/SearchBar';
import SearchButton from './components/SearchButton';
import KanjiBox from './components/KanjiBox';
import WordBox from './components/WordBox';
import Sidebar from './components/Sidebar';

function App() {
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [kanjiResults, setKanjiResults] = useState<KanjiData[] | null>(null);
    const [wordResults, setWordResults] = useState<WordData[] | null>(null);
    const [error, setError] = useState('');
    const [noResults, setNoResults] = useState<string[]>([]);

    const isValidJapaneseText = (text: string) => {
        return /^[\u3040-\u30FF\u4E00-\u9FFF\uFF66-\uFF9D\u3000-\u303F0-9]+$/.test(text);
    };

    const handleSearch = async () => {
        if (inputValue.trim()) {
            setTags([...new Set([...tags, inputValue.trim()])]);
            setInputValue('');
        }

        const invalidTags = tags.filter(tag => !isValidJapaneseText(tag));
        setNoResults(invalidTags);

        const validTags = tags.filter(tag => isValidJapaneseText(tag));

        const kanjiList = validTags.filter(tag => tag.length === 1);
        const wordList = validTags;

        if (wordList.length === 0) return;

        try {
            const kanjiResponse = await fetch(`http://localhost:3000/api/kanji?l=${kanjiList.join(',')}`);
            const kanjiData = kanjiResponse.ok ? await kanjiResponse.json() : [];

            const wordResponse = await fetch(`http://localhost:3000/api/words?keywords=${wordList.join(',')}`);
            const wordData = wordResponse.ok ? await wordResponse.json() : [];

            const foundKanjis = kanjiData.map((item: KanjiData) => item.kanji);
            const foundWords = wordData.map((item: WordData) => item.word);
            const missingTags = validTags.filter(tag => !foundKanjis.includes(tag) && !foundWords.includes(tag));
            setNoResults([...invalidTags, ...missingTags]);

            setKanjiResults(kanjiData);
            setWordResults(wordData);
            setError('');
        } catch (err) {
            setError(`Error fetching data: ${err}`);
            setKanjiResults(null);
            setWordResults(null);
        }
    };

    const handleClear = () => {
        setTags([]);
        setInputValue('');
        setNoResults([]);
        setKanjiResults(null);
        setWordResults(null);
    };

    return (
        <div className="flex h-screen w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="text-center w-full max-w-md">
                    <h1 className="text-3xl font-bold mb-4">Let's 探します</h1>
                    <SearchBar
                        tags={tags}
                        setTags={setTags}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        noResults={noResults}
                        handleClear={handleClear}
                    />
                    <SearchButton onClick={handleSearch} />
                </div>

                <div className="mt-8 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
                    {error && <p className="text-red-500 col-span-full">{error}</p>}
                    {kanjiResults && kanjiResults.map((kanjiData, index) => (
                        <KanjiBox key={index} result={kanjiData} />
                    ))}
                    {wordResults && wordResults.map((wordData, index) => (
                        <WordBox key={index} result={wordData} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;