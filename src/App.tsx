import { useState } from 'react';
import './App.css';
import { KanjiData } from './data/data-structures';
import SearchBar from './components/SearchBar';
import SearchButton from './components/SearchButton';
import KanjiBox from './components/KanjiBox';

function App() {
    const [searchQuery, setSearchQuery] = useState('');
    const [result, setResult] = useState<KanjiData | null>(null);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!searchQuery) return;
        try {
            const response = await fetch(`http://localhost:3000/api/kanji?l=${searchQuery}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setResult(data[0]);
            setError('');
        } catch (err) {
            setError(`Error fetching data: ${err}`);
            setResult(null);
        }
    };

    return (
        <div className="flex items-center justify-center flex-col h-screen p-4">
            <div className="text-center w-full max-w-md">
                <h1 className="text-3xl font-bold mb-4">Let's 探します</h1>
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <SearchButton onClick={handleSearch} />
            </div>

            <div className="mt-8 w-full max-w-md text-left">
                {error && <p className="text-red-500">{error}</p>}
                <KanjiBox result={result} />
            </div>
        </div>
    );
}

export default App;