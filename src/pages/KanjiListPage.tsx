import React, { useState, useEffect, useRef } from 'react';
import KanjiBox from '../components/KanjiBox';
import { KanjiData } from "../data/KanjiData.ts";
import { usePaginatedKanji } from "../hooks/usePaginatedKanji.ts";
import LoadingScreen from "../components/LoadingScreen";

const KanjiListPage: React.FC = () => {
    const [kanjiResults, setKanjiResults] = useState<KanjiData[]>([]);
    const [filteredResults, setFilteredResults] = useState<KanjiData[]>([]);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, error } = usePaginatedKanji(page, 20);

    useEffect(() => {
        if (data) {
            setKanjiResults(prev => {
                // Evita agregar kanjis duplicados
                const newResults = data.documents.filter(
                    kanji => !prev.some(prevKanji => prevKanji.kanji === kanji.kanji)
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
    }, [searchQuery, kanjiResults]);

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