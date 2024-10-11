import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ReadingDataElement from '../components/ReadingDataElement.tsx';
import { usePaginatedGenerations } from '../hooks/usePaginatedGenerations';
import SectionContainer from "../components/ui/containers/SectionContainer.tsx";
import PaginatedContainer from '../components/ui/containers/PaginatedContainer.tsx';
import SearchBar from '../components/ui/inputs/SearchBar.tsx';

const ReadingListPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Pasamos el searchTerm al hook para que se utilice en la búsqueda
    const { data, isLoading, error, fetchGenerations } = usePaginatedGenerations(page, 20, searchTerm);

    const hasMore = data ? page < (data.totalPages ?? 1) : false;

    useEffect(() => {
        fetchGenerations();  // Llamamos a fetchGenerations con el searchTerm incluido
    }, [page, searchTerm]);

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
        <SectionContainer title={"読みましょう"} isLoading={isLoading} error={error?.message}>
            <div className="w-full lg:max-w-4xl flex flex-wrap gap-2 text-left px-14 lg:px-0 justify-center">
                <SearchBar onSearch={setSearchTerm} placeholder="Search Readings..." />
            </div>

            {!isLoading && data && (
                <PaginatedContainer
                    documents={data.documents}
                    currentPage={page}
                    totalPages={data.totalPages}
                    onPageChange={setPage}
                    RenderComponent={({ document }) => (
                        <Link to={`/generation/${document._id}`} className="page-fade-enter page-fade-enter-active">
                            <ReadingDataElement
                                data={document}
                            />
                        </Link>
                    )}
                />
            )}
        </SectionContainer>
    );
};

export default ReadingListPage;