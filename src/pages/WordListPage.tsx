import { useState, useEffect } from 'react';
import WordBox from '../components/WordBox';
import loadingIcon from '../assets/loading-icon.svg';
import { WordData } from "../data/WordData.ts";


const WordListPage: React.FC = () => {
    const [wordResults, setWordResults] = useState<WordData[]>([]);
    const [filteredResults, setFilteredResults] = useState<WordData[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState(''); // Para almacenar el valor de búsqueda

    const fetchWords = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/words/paginated?page=${page}&limit=20`);
            if (!response.ok) {
                throw new Error('Failed to fetch word data.');
            }
            const data = await response.json();

            setWordResults(prevResults => {
                // Evita agregar palabras duplicadas
                const newResults = data.words.filter(
                    word => !prevResults.some(prevWord => prevWord.word === word.word)
                );
                return [...prevResults, ...newResults];
            });
            setHasMore(data.page < data.totalPages);
            setError('');
        } catch (err) {
            setError(`Error fetching data: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWords();
    }, [page]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore]);

    useEffect(() => {
        filterResults();
    }, [searchQuery, wordResults]);

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const filterResults = () => {
        if (!searchQuery.trim()) {
            setFilteredResults(wordResults);
        } else {
            const filtered = wordResults.filter(word => {
                const { word: wordText, readings } = word;
                const readingMatches = readings.some(reading => reading.includes(searchQuery));
                return wordText.includes(searchQuery) || readingMatches;
            });
            setFilteredResults(filtered);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">
            <div className="text-center w-full max-w-md mt-20">
                <input
                    type="text"
                    placeholder="検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border rounded px-4 py-2 w-full mb-4"
                />
            </div>

            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80 z-10 transition-opacity duration-500">
                    <img src={loadingIcon} alt="Loading..." className="w-16 h-16" />
                </div>
            )}

            {error && <p className="text-red-500">{error}</p>}

            <div className="mt-8 w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-left transition-opacity duration-500">
                {filteredResults.length > 0 ? (
                    filteredResults.map((wordData, index) => (
                        <WordBox key={index} result={wordData} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">何もない</p>
                )}
            </div>
        </div>
    );
};

export default WordListPage;