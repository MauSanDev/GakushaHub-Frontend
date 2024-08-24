import { useState } from 'react';
import './App.css';
import { KanjiData } from './data-structures';

function App() {
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [result, setResult] = useState<KanjiData | null>(null);

    const handleSearch = async () => {
        if (!searchQuery) return;
        try {
            const response = await fetch(`http://localhost:3000/api/kanji?l=${searchQuery}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setResult(data[0]); // Asumiendo que siempre quieres el primer resultado del array
            setError('');
        } catch (err) {
            setError(`Error fetching data: ${err}`);
            setResult(null);
        }
    };

    return (
        <div className="flex items-center justify-center flex-col h-screen bg-gray-100 p-4">
            <div className="text-center w-full max-w-md">
                <h1 className="text-3xl font-bold mb-4">Let's 探します</h1>
                <input
                    type="text"
                    placeholder="Enter text to search"
                    className="border border-gray-300 rounded p-2 mb-4 w-full max-h-16 overflow-y-auto"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white rounded p-2 w-full hover:bg-blue-600"
                    onClick={handleSearch}
                >
                    Search
                </button>
            </div>

            <div className="mt-8 w-full max-w-md text-center">
                {error && <p className="text-red-500">{error}</p>}
                {result && (
                    <div className="bg-white p-4 rounded shadow">
                        {/* Kanji */}
                        <h1 className="text-4xl font-bold mb-2">{result.kanji}</h1>
                        {/* Lecturas */}
                        <h3 className="text-2xl mb-2">
                            {result.readings.onyomi.join(', ')} - {result.readings.kunyomi.join(', ')}
                        </h3>
                        {/* Significado */}
                        <h2 className="text-xl capitalize">
                            {result.related.length > 0 && result.related[0].meaning}
                        </h2>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;