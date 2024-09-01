import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SimpleTextReader from '../components/SimpleTextReader';
import loadingIcon from '../assets/loading-icon.svg';
import { usePaginatedGenerations } from '../hooks/usePaginatedGenerations';
import { GeneratedData } from "../data/GenerationData";

const GenerationsListPage: React.FC = () => {
    const [generatedTexts, setGeneratedTexts] = useState<GeneratedData[]>([]);
    const [page, setPage] = useState(1);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, error } = usePaginatedGenerations(page, 20);

    const hasMore = data ? page < (data.totalPages ?? 1) : false;

    useEffect(() => {
        if (data) {
            // Evitar duplicados basados en _id o cualquier identificador único
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
        <div ref={scrollContainerRef} className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">
            {isLoading && (
                <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80 z-10 transition-opacity duration-500">
                    <img src={loadingIcon} alt="Loading..." className="w-16 h-16" />
                </div>
            )}

            {error && <p className="text-red-500">{String(error)}</p>}

            <div className="mt-4 w-full max-w-4xl flex flex-col gap-4 text-left">
                {generatedTexts.length > 0 ? (
                    generatedTexts.map((generatedText) => (
                        <div
                            key={generatedText._id}
                            className="page-fade-enter page-fade-enter-active"
                        >
                            <Link key={generatedText._id} to={`/generation/${generatedText._id}`} className="page-fade-enter page-fade-enter-active">

                            <SimpleTextReader
                                data={generatedText}
                            />
                            </Link>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No generated texts available</p>
                )}
            </div>
        </div>
    );
};

export default GenerationsListPage;