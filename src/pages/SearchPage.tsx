import { useState } from 'react';
import { KanjiData, WordData } from '../data/data-structures';
import SearchBar from '../components/SearchBar';
import SearchButton from '../components/SearchButton';
import KanjiBox from '../components/KanjiBox';
import WordBox from '../components/WordBox';
import loadingIcon from '../assets/loading-icon.svg';

interface SearchPageProps {
    tags: string[];
    setTags: (tags: string[]) => void;
    inputValue: string;
    setInputValue: (value: string) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ tags, setTags, inputValue, setInputValue }) => {
    const [kanjiResults, setKanjiResults] = useState<KanjiData[] | null>(null);
    const [wordResults, setWordResults] = useState<WordData[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [noResults, setNoResults] = useState<string[]>([]);
    const [lastQuery, setLastQuery] = useState<string>(''); // Para evitar búsquedas repetidas

    const isValidJapaneseText = (text: string) => {
        return /^[\u3040-\u30FF\u4E00-\u9FFF\uFF66-\uFF9D\u3000-\u303F0-9]+$/.test(text);
    };

    const handleSearch = async () => {
        const currentQuery = tags.join(',');
        if (currentQuery === lastQuery) return; // Evita repetir la misma búsqueda
        setLastQuery(currentQuery); // Actualiza la última búsqueda

        if (inputValue.trim()) {
            setTags([...new Set([...tags, inputValue.trim()])]);
            setInputValue('');
        }

        setLoading(true);

        const invalidTags = tags.filter(tag => !isValidJapaneseText(tag));
        setNoResults(invalidTags);

        const validTags = tags.filter(tag => isValidJapaneseText(tag));

        const kanjiList = validTags.filter(tag => tag.length === 1);
        const wordList = validTags;

        if (wordList.length === 0) {
            setLoading(false);
            return;
        }

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
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setTags([]);
        setInputValue('');
        setNoResults([]);
        setKanjiResults(null);
        setWordResults(null);
        setLastQuery(''); // Resetea la última búsqueda
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">
            <div className="text-center w-full max-w-md mt-40">
                <h1 className="text-3xl font-bold mb-4">Let's 探します</h1>
                <SearchBar
                    tags={tags}
                    setTags={setTags}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    noResults={noResults}
                    handleClear={handleClear}
                />
                <SearchButton
                    onClick={handleSearch}
                    disabled={loading} // Bloquea el botón mientras está cargando
                />
            </div>

            {/* Loading Icon */}
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80 z-10 transition-opacity duration-500">
                    <img src={loadingIcon} alt="Loading..." className="w-16 h-16" />
                </div>
            )}

            {/* Results */}
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