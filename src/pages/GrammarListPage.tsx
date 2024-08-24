import { useState, useEffect } from 'react';
import GrammarStructureBox from '../components/GrammarStructureBox';
import loadingIcon from '../assets/loading-icon.svg';
import { GrammarStructureData } from "../data/data-structures.tsx";

const GrammarListPage: React.FC = () => {
    const [grammarResults, setGrammarResults] = useState<GrammarStructureData[]>([]);
    const [filteredResults, setFilteredResults] = useState<GrammarStructureData[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [selectedJLPTLevels, setSelectedJLPTLevels] = useState<number[]>([5, 4, 3, 2, 1]); // Niveles JLPT seleccionados

    const fetchGrammarStructures = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/grammar?page=${page}&limit=20`);
            if (!response.ok) {
                throw new Error('Failed to fetch grammar data.');
            }
            const data = await response.json();

            setGrammarResults(prevResults => {
                // Evita agregar estructuras duplicadas
                const newResults = data.structures.filter(
                    (structure: GrammarStructureData) => !prevResults.some(prevStructure => prevStructure._id === structure._id)
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
        fetchGrammarStructures();
    }, [page]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore]);

    useEffect(() => {
        filterResults();
    }, [selectedJLPTLevels, grammarResults]);

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const filterResults = () => {
        if (selectedJLPTLevels.length === 0) {
            // Si todos los botones están apagados, reactiva todos los niveles
            setSelectedJLPTLevels([5, 4, 3, 2, 1]);
        } else {
            const filtered = grammarResults.filter(grammar => selectedJLPTLevels.includes(grammar.jlpt));
            setFilteredResults(filtered);
        }
    };

    const toggleJLPTLevel = (level: number) => {
        if (selectedJLPTLevels.includes(level)) {
            // Si el nivel ya está seleccionado, se desactiva
            setSelectedJLPTLevels(selectedJLPTLevels.filter(l => l !== level));
        } else {
            // Si no está seleccionado, se activa
            setSelectedJLPTLevels([...selectedJLPTLevels, level]);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">
            {/* Botones de filtrado JLPT */}
            <div className="flex justify-center w-full max-w-md mt-20 gap-4">
                {[5, 4, 3, 2, 1].map(level => (
                    <button
                        key={level}
                        onClick={() => toggleJLPTLevel(level)}
                        className={`border rounded-full px-4 py-2 transition-all duration-300 transform hover:scale-105 hover:shadow-md ${
                            selectedJLPTLevels.includes(level)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-blue-300 hover:text-white'
                        }`}
                    >
                        JLPT{level}
                    </button>
                ))}
            </div>

            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80 z-10 transition-opacity duration-500">
                    <img src={loadingIcon} alt="Loading..." className="w-16 h-16" />
                </div>
            )}

            {error && <p className="text-red-500">{error}</p>}

            <div className="mt-8 w-full max-w-4xl flex flex-col gap-6 text-left">
                {filteredResults.length > 0 ? (
                    filteredResults.map((grammarData, index) => (
                        <div
                            key={index}
                            className="page-fade-enter page-fade-enter-active"
                        >
                            <GrammarStructureBox result={grammarData} />
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">何もない</p>
                )}
            </div>
        </div>
    );
};

export default GrammarListPage;