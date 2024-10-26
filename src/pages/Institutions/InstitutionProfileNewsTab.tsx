import React, { useEffect, useState } from 'react';
import NewsDataElement from "./Components/NewsDataElement.tsx";
import PaginatedContainer from "../../components/ui/containers/PaginatedContainer.tsx";
import SearchBar from '../../components/ui/inputs/SearchBar.tsx';
import { useNews } from "../../hooks/newHooks/News/useNews";
import { NewsData } from "../../data/NewsData.ts";
import { useParams } from "react-router-dom";
import NewsViewerModal from "./NewsViewerModal.tsx";
import SectionContainer from "../../components/ui/containers/SectionContainer.tsx";

const InstitutionProfileNewsTab: React.FC = () => {
    const { institutionId } = useParams<{ institutionId: string }>();
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState<NewsData | null>(null);

    const { fetchNews, isLoading, data: newsData } = useNews(page, 10, searchQuery, institutionId, []);

    useEffect(() => {
        fetchNews();
    }, [page, searchQuery]);

    const filteredNews = newsData?.documents || [];

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleOpenModal = (news?: NewsData) => {
        setSelectedNews(news || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedNews(null);
    };

    return (
        <SectionContainer isLoading={isLoading}>
        <div className="w-full max-w-4xl mx-auto">
            {/* Search and Button Container */}
            <div className="flex justify-between items-center mb-4">
                    <SearchBar
                        placeholder="Search news..."
                        onSearch={handleSearch}
                    />
            </div>

            <PaginatedContainer
                documents={filteredNews}
                currentPage={page}
                totalPages={newsData?.totalPages || 1}
                onPageChange={setPage}
                RenderComponent={({ document }) => (
                    <NewsDataElement
                        key={document._id}
                        newsData={document}
                        canDelete={false}
                        onClick={handleOpenModal}
                    />
                )}
            />
            
            {isModalOpen && selectedNews && (
                <NewsViewerModal
                    onClose={handleCloseModal}
                    newsData={selectedNews}
                />
            )}
        </div>
    </SectionContainer>
    );
};

export default InstitutionProfileNewsTab;