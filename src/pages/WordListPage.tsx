import React, { useState, useEffect, useRef } from 'react';
import WordBox from '../components/WordBox';
import { WordData } from "../data/WordData.ts";
import { usePaginatedWords } from "../hooks/usePaginatedWords.ts";
import LoadingScreen from "../components/LoadingScreen";

const WordListPage: React.FC = () => {
    const [wordResults, setWordResults] = useState<WordData[]>([]);
    const [filteredResults, setFilteredResults] = useState<WordData[]>([]);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, error } = usePaginatedWords(page, 20);

    useEffect(() => {
        if (data) {
            setWordResults(prev => {
                // Evita agregar palabras duplicadas
                const newResults = data.documents.filter(
                    word => !prev.some(prevWord => prevWord.word === word.word)
                );
                return [...prev, ...newResults];
            });
        }
    }, [data]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollContainer = scrollContainerRef.current;
            if (scrollContainer) {
                const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
                if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading && page < (data?.totalPages ?? 1)) {
                    setPage(prevPage => prevPage + 1);
                }
            }
        };

        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, [isLoading, page, data]);

    useEffect(() => {
        filterResults();
    }, [searchQuery, wordResults]);

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
        <div ref={scrollContainerRef} className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">
            <div className="text-center w-full max-w-md mt-20">
                <input
                    type="text"
                    placeholder="検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border rounded px-4 py-2 w-full mb-4"
                />
            </div>

            <LoadingScreen isLoading={isLoading} />

            {error && <p className="text-red-500">{error.message}</p>}

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