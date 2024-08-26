import { useState } from 'react';
import { KanjiData, WordData } from '../data/data-structures';
import SearchBar from '../components/SearchBar';
import SearchButton from '../components/SearchButton';
import KanjiBox from '../components/KanjiBox';
import WordBox from '../components/WordBox';
import SaveDeckInput from '../components/SaveDeckInput';
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
    const [showSaveInput, setShowSaveInput] = useState(false); // Controla si se muestra SaveDeckInput
    const [resetSaveComponent, setResetSaveComponent] = useState(false); // Controla el reset de SaveDeckInput

    const isValidJapaneseText = (text: string) => /^[\u3040-\u30FF\u4E00-\u9FFF\uFF66-\uFF9D\u3000-\u303F0-9]+$/.test(text);

    const handleSearch = async () => {
        const currentQuery = tags.join(',');
        if (currentQuery === lastQuery) return; // Evita repetir la misma búsqueda
        setLastQuery(currentQuery); // Actualiza la última búsqueda

        if (inputValue.trim()) {
            setTags([...new Set([...tags, inputValue.trim()])]);
            setInputValue('');
        }

        // Resetea el estado del componente SaveDeckInput
        setShowSaveInput(false);
        setResetSaveComponent(true);

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

            // Solo mostrar SaveDeckInput si hay resultados
            if (kanjiData.length > 0 || wordData.length > 0) {
                setShowSaveInput(true);
                setResetSaveComponent(false); // Evita que se siga reseteando una vez que se muestra
            }
        } catch (err) {
            setError(`Error fetching data: ${err}`);
            setKanjiResults(null);
            setWordResults(null);
        } finally {
            setLoading(false);
        }
    };
    const handleSaveDeck = async (courseName: string, lessonName: string, deckName: string) => {
        const kanjiIds = kanjiResults ? kanjiResults.map((kanji) => kanji._id) : [];
        const wordIds = wordResults ? wordResults.map((word) => word._id) : [];

        // Creamos la estructura de los decks a enviar
        const decks = [];

        if (kanjiIds.length > 0) {
            decks.push({
                deckName: `${deckName} - Kanji`,
                elements: kanjiIds,
                deckType: 'kanji',
            });
        }

        if (wordIds.length > 0) {
            decks.push({
                deckName: `${deckName} - Words`,
                elements: wordIds,
                deckType: 'word',
            });
        }

        // Aquí manejamos el request unificado para evitar múltiples llamadas.
        try {
            if (decks.length > 0) {
                await fetch('http://localhost:3000/api/course/build', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        courseName,
                        lessonName,
                        decks,
                        // TODO: creatorId: 'master'
                    }),
                });
            }
        } catch (error) {
            console.error('Error al guardar el deck:', error);
        }
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
                    handleClear={() => {
                        setTags([]);
                        setInputValue('');
                        setNoResults([]);
                        setKanjiResults(null);
                        setWordResults(null);
                        setLastQuery(''); // Resetea la última búsqueda
                        setShowSaveInput(false); // Oculta el SaveDeckInput cuando se limpia la búsqueda
                    }}
                />
                <SearchButton onClick={handleSearch} disabled={loading} />
            </div>

            {/* Save Deck Input */}
            {showSaveInput && (
                <div className="fixed top-4 right-4">
                    <SaveDeckInput
                        onSave={handleSaveDeck}
                        key={resetSaveComponent ? 'reset' : 'default'} // Fuerza el reset del componente
                    />
                </div>
            )}

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