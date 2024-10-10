import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ReadingDataElement from '../components/ReadingDataElement.tsx';
import loadingIcon from '../assets/loading-icon.svg';
import { usePaginatedGenerations } from '../hooks/usePaginatedGenerations';
import { GeneratedData } from "../data/GenerationData";

const ReadingListPage: React.FC = () => {
    const [generatedTexts, setGeneratedTexts] = useState<GeneratedData[]>([]);
    const [page, setPage] = useState(1);
    const [resetPage, setResetPage] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, error } = usePaginatedGenerations(page, 20);

    const hasMore = data ? page < (data.totalPages ?? 1) : false;

    useEffect(() => {
        setGeneratedTexts([]);
        setPage(1);
        setResetPage(true);
    }, []);

    useEffect(() => {
        if (data && resetPage) {
            setGeneratedTexts(data.documents);
            setResetPage(false);
        } else if (data && !resetPage) {
            const newTexts = data.documents.filter(newText =>
                !generatedTexts.some(existingText => existingText._id === newText._id)
            );
            setGeneratedTexts(prevTexts => [...prevTexts, ...newTexts]);
        }
    }, [data]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollContainer = scrollContainerRef.current;
            if (scrollContainer) {
                const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
                if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore) {
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
    }, [hasMore]);

    return (
        <div ref={scrollContainerRef}
             className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">
            {isLoading && (
                <div
                    className="absolute inset-0 flex justify-center items-center bg-white dark:bg-black bg-opacity-80 z-10 transition-opacity duration-500">
                    <img src={loadingIcon} alt="Loading..." className="w-16 h-16"/>
                </div>
            )}

            {error && <p className="text-red-500">{String(error)}</p>}

            <div
                className="lg:pl-0 pl-20 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full max-w-4xl mt-8 lg:mb-2 px-4">
                <div className="flex items-start mb-4 sm:mb-0">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 capitalize">
                        読みましょう
                    </h1>
                </div>
            </div>

            <div className="mt-4 w-full max-w-4xl flex flex-col gap-4 text-left pb-24">
                {generatedTexts.length > 0 ? (
                    generatedTexts.map((generatedText) => (
                        <div
                            key={generatedText._id}
                            className="page-fade-enter page-fade-enter-active"
                        >
                            <Link key={generatedText._id} to={`/generation/${generatedText._id}`}
                                  className="page-fade-enter page-fade-enter-active">
                                <ReadingDataElement
                                    data={generatedText}
                                />
                            </Link>
                        </div>
                    ))
                ) : (
                    !isLoading && <p className="text-center text-gray-500">No generated texts available</p>
                )}
            </div>
        </div>
    );
};

export default ReadingListPage;