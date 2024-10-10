import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ReadingDataElement from '../components/ReadingDataElement.tsx';
import { usePaginatedGenerations } from '../hooks/usePaginatedGenerations';
import { GeneratedData } from "../data/GenerationData";
import SectionContainer from "../components/ui/containers/SectionContainer.tsx";

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
        <SectionContainer title={"読みましょう"} isLoading={isLoading} error={error?.message} >
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
        </SectionContainer>
    );
};

export default ReadingListPage;