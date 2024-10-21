import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import NewsDataElement from "./Components/NewsDataElement.tsx";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import PaginatedContainer from "../../components/ui/containers/PaginatedContainer.tsx";
import SearchBar from '../../components/ui/inputs/SearchBar.tsx';
import SectionContainer from "../../components/ui/containers/SectionContainer.tsx";
import CreateNewsModal from "./CreateNewsModal.tsx";
import { useNews } from "../../hooks/newHooks/News/useNews";
import {NewsData} from "../../data/NewsData.ts";
import {useParams} from "react-router-dom";

const NewsPage: React.FC = () => {
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
        if (news) {
            setSelectedNews(news); 
        } else {
            setSelectedNews(null); 
        }
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedNews(null); 
    };

    return (
        <SectionContainer title={"ニュース"}>
            <div className="w-full max-w-4xl mx-auto mt-6">
                {/* Contenedor de búsqueda y botón */}
                <div className="flex justify-between items-center mb-4">
                    {/* SearchBar */}
                    <div className="w-3/4">
                        <SearchBar
                            placeholder="Search news..."
                            onSearch={handleSearch}
                        />
                    </div>

                    {/* Botón al lado derecho */}
                    <div className="w-1/4 flex justify-end">
                        <PrimaryButton
                            label="Add News"
                            iconComponent={<FaPlus />}
                            className="ml-2"
                            onClick={() => handleOpenModal()} 
                        />
                    </div>
                </div>

                {/* PaginatedContainer con los datos de noticias filtradas */}
                {!isLoading && (
                    <PaginatedContainer
                        documents={filteredNews}
                        currentPage={page}
                        totalPages={newsData?.totalPages || 1}
                        onPageChange={setPage}
                        RenderComponent={({ document }) => (
                            <NewsDataElement
                                key={document._id}
                                newsData={document}
                                canDelete={true}
                                onClick={handleOpenModal} 
                            />
                        )}
                    />
                )}

                {isLoading && <p>Loading news...</p>}
            </div>

            {isModalOpen && (
                <CreateNewsModal
                    onClose={handleCloseModal}
                    newsData={selectedNews} 
                    onCreateSuccess={() => {
                        handleCloseModal();
                        fetchNews(); 
                    }}
                />
            )}
        </SectionContainer>
    );
};

export default NewsPage;