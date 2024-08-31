import { useState, useEffect } from 'react';
import GrammarStructureBox from '../components/GrammarStructureBox';
import loadingIcon from '../assets/loading-icon.svg';
import { GrammarData } from "../data/data-structures.tsx";
import SaveDeckInput from '../components/SaveDeckInput';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const GrammarListPage: React.FC = () => {
    const [grammarResults, setGrammarResults] = useState<GrammarData[]>([]);
    const [filteredResults, setFilteredResults] = useState<GrammarData[]>([]);
    const [selectedGrammar, setSelectedGrammar] = useState<GrammarData[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [selectedJLPTLevels, setSelectedJLPTLevels] = useState<number[]>([5, 4, 3, 2, 1]);
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);

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
                const newResults = data.structures.filter(
                    (structure: GrammarData) => !prevResults.some(prevStructure => prevStructure._id === structure._id)
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
    }, [selectedJLPTLevels, grammarResults, showSelectedOnly]);

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const filterResults = () => {
        let results = grammarResults.filter(grammar => selectedJLPTLevels.includes(grammar.jlpt));

        if (showSelectedOnly) {
            results = results.filter(grammar => selectedGrammar.some(selected => selected._id === grammar._id));
        }

        setFilteredResults(results);
    };

    const toggleJLPTLevel = (level: number) => {
        if (selectedJLPTLevels.includes(level)) {
            setSelectedJLPTLevels(selectedJLPTLevels.filter(l => l !== level));
        } else {
            setSelectedJLPTLevels([...selectedJLPTLevels, level]);
        }
    };

    const toggleSelectedGrammar = (grammar: GrammarData, isSelected: boolean) => {
        setSelectedGrammar(prevSelected => {
            if (isSelected) {
                return [...prevSelected, grammar];
            } else {
                return prevSelected.filter(item => item._id !== grammar._id);
            }
        });
    };

    const handleSaveDeck = async (
        courseId: string | null,
        courseName: string,
        lessonName: string,
        deckName: string,
        selectedGrammarIds: string[]
    ) => {
        const decks = [];

        if (selectedGrammarIds.length > 0) {
            decks.push({
                deckName: `${deckName} - Grammar`,
                elements: selectedGrammarIds,
                deckType: 'grammar',
            });
        }

        try {
            if (decks.length > 0) {
                await fetch('http://localhost:3000/api/course/build', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        courseId,
                        courseName,
                        lessonName,
                        decks,
                    }),
                });
            }
        } catch (error) {
            console.error('Error al guardar el deck:', error);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">
            {/* Componente SaveDeckInput en la parte superior derecha */}
            <div className="absolute top-8 right-8">
                <SaveDeckInput
                    onSave={(courseId, courseName, lessonName, deckName) =>
                        handleSaveDeck(courseId, courseName, lessonName, deckName, selectedGrammar.map(g => g._id))
                    }
                />
            </div>

            {/* Botones de filtrado JLPT */}
            <div className="flex justify-center w-full max-w-md mt-16 gap-4">
                {[5, 4, 3, 2, 1].map(level => (
                    <button
                        key={level}
                        onClick={() => toggleJLPTLevel(level)}
                        className={`border rounded-full px-4 py-2 transition-all duration-300 transform hover:scale-105 hover:shadow-md flex items-center gap-2 ${
                            selectedJLPTLevels.includes(level)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-blue-300 hover:text-white'
                        }`}
                    >
                        JLPT{level}
                    </button>
                ))}
                {/* Botón para mostrar solo seleccionados con ícono */}
                <button
                    onClick={() => setShowSelectedOnly(!showSelectedOnly)}
                    className={` text-xs border rounded-full px-4 py-2 transition-all duration-300 transform hover:scale-105 hover:shadow-md flex items-center gap-2 ${
                        showSelectedOnly ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-blue-300 hover:text-white'
                    }`}
                >
                    {showSelectedOnly ? <FaEyeSlash /> : <FaEye />}
                    {showSelectedOnly ? 'All' : 'Selected'}
                </button>
            </div>

            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80 z-10 transition-opacity duration-500">
                    <img src={loadingIcon} alt="Loading..." className="w-16 h-16" />
                </div>
            )}

            {error && <p className="text-red-500">{error}</p>}

            <div className="mt-4 w-full max-w-4xl flex flex-col gap-4 text-left">
                {filteredResults.length > 0 ? (
                    filteredResults.map((grammarData, index) => (
                        <div
                            key={index}
                            className="page-fade-enter page-fade-enter-active"
                        >
                            <GrammarStructureBox
                                result={grammarData}
                                isSelected={selectedGrammar.some(item => item._id === grammarData._id)}
                                onSelect={(selected) => toggleSelectedGrammar(grammarData, selected)}
                            />
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