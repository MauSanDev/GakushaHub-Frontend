import React, { useState, useEffect } from 'react';
import TextReader from '../components/TextReader';
import loadingIcon from '../assets/loading-icon.svg';

const GenerationsListPage: React.FC = () => {
    const [generatedTexts, setGeneratedTexts] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasMore, setHasMore] = useState(true);

    const fetchGeneratedTexts = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/generations/paginated?page=${page}&limit=20`);
            if (!response.ok) {
                throw new Error('Failed to fetch generated texts.');
            }
            const data = await response.json();

            setGeneratedTexts(prevTexts => {
                const newTexts = data.generations.filter(
                    (generation: string) => !prevTexts.includes(generation)
                );
                return [...prevTexts, ...newTexts];
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
        fetchGeneratedTexts();
    }, [page]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore]);

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">
            {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80 z-10 transition-opacity duration-500">
                    <img src={loadingIcon} alt="Loading..." className="w-16 h-16" />
                </div>
            )}

            {error && <p className="text-red-500">{error}</p>}

            <div className="mt-4 w-full max-w-4xl flex flex-col gap-4 text-left">
                {generatedTexts.length > 0 ? (
                    generatedTexts.map((generatedText, index) => (
                        <div
                            key={index}
                            className="page-fade-enter page-fade-enter-active"
                        >
                            <TextReader title={`Generated Text ${index + 1}`} content={generatedText.generatedText} />
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