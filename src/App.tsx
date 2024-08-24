import { useState } from 'react';
import './App.css';
import { KanjiData } from './data/data-structures';
import SearchBar from './components/SearchBar';
import SearchButton from './components/SearchButton';
import KanjiBox from './components/KanjiBox';

function App() {
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState<KanjiData[] | null>(null);
    const [error, setError] = useState('');
    const [noResults, setNoResults] = useState<string[]>([]); // Palabras sin resultado

    const handleSearch = async () => {
        // Encapsular el último término si no está encapsulado
        if (inputValue.trim()) {
            setTags([...new Set([...tags, inputValue.trim()])]); // Usamos Set para eliminar duplicados
            setInputValue('');
        }

        const uniqueTags = [...new Set([...tags, inputValue.trim()].filter(tag => tag !== ''))];

        if (uniqueTags.length === 0) return; // Asegúrate de no enviar una solicitud vacía

        try {
            const response = await fetch(`http://localhost:3000/api/kanji?l=${uniqueTags.join(',')}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            // Determinar qué términos no tienen resultados
            const foundKanjis = data.map((item: KanjiData) => item.kanji);
            const missingTags = uniqueTags.filter(tag => !foundKanjis.includes(tag));
            setNoResults(missingTags);

            setResult(data); // Asumimos que `data` es un array de objetos kanji
            setError('');
            setTags(uniqueTags); // Actualiza las etiquetas después de la solicitud
        } catch (err) {
            setError(`Error fetching data: ${err}`);
            setResult(null);
        }
    };

    const handleClear = () => {
        setTags([]);
        setInputValue('');
        setNoResults([]);
    };

    return (
        <div className="flex items-center justify-center flex-col h-screen p-4">
            <div className="text-center w-full max-w-md relative">
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
                {result && result.map((kanjiData, index) => (
                    <KanjiBox key={index} result={kanjiData} />
                ))}
            </div>
        </div>
    );
}

export default App;