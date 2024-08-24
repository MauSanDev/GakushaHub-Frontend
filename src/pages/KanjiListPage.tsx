import { useState, useEffect } from 'react';
import KanjiBox from '../components/KanjiBox';
import loadingIcon from '../assets/loading-icon.svg';
import { KanjiData } from "../data/data-structures.tsx";

const KanjiListPage: React.FC = () => {
    const [kanjiResults, setKanjiResults] = useState<KanjiData[]>([]);
    const [filteredResults, setFilteredResults] = useState<KanjiData[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState(''); // Para almacenar el valor de búsqueda

    const fetchKanjis = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/kanji/paginated?page=${page}&limit=20`);
            if (!response.ok) {
                throw new Error('Failed to fetch kanji data.');
            }
            const data = await response.json();

            setKanjiResults(prevResults => {
                // Evita agregar kanjis duplicados
                const newResults = data.kanjis.filter(
                    kanji => !prevResults.some(prevKanji => prevKanji.kanji === kanji.kanji)
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
        fetchKanjis();
    }, [page]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore]);

    useEffect(() => {
        filterResults();
    }, [searchQuery, kanjiResults]);

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const filterResults = () => {
        if (!searchQuery.trim()) {
            setFilteredResults(kanjiResults);
        } else {
            const filtered = kanjiResults.filter(kanji => {
                const { kanji: kanjiChar, readings } = kanji;
                const onyomiMatches = readings.onyomi.some(reading => reading.includes(searchQuery));
                const kunyomiMatches = readings.kunyomi.some(reading => reading.includes(searchQuery));
                return kanjiChar.includes(searchQuery) || onyomiMatches || kunyomiMatches;
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
                    filteredResults.map((kanjiData, index) => (
                        <KanjiBox key={index} result={kanjiData} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">何もない</p>
                )}
            </div>
        </div>
    );
};

export default KanjiListPage;