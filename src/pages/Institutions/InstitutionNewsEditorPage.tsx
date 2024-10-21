import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import NewsDataElement from "./Components/NewsDataElement.tsx";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import PaginatedContainer from "../../components/ui/containers/PaginatedContainer.tsx";
import SearchBar from '../../components/ui/inputs/SearchBar.tsx';
import SectionContainer from "../../components/ui/containers/SectionContainer.tsx";
import CreateNewsModal from "./CreateNewsModal.tsx";
import { useNews } from "../../hooks/newHooks/News/useNews";

const NewsPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState(''); // Para manejar la búsqueda
    const [isModalOpen, setIsModalOpen] = useState(false); // Para manejar el modal

    // Usamos el hook personalizado useNews
    const { fetchNews, isLoading, data: newsData } = useNews(page, 10, searchQuery, []);

    // Llamamos la función fetchNews cuando cambie la página o el query de búsqueda
    useEffect(() => {
        fetchNews();
    }, [page, searchQuery]);

    // Filtrado de noticias basado en la búsqueda (si es necesario, aunque ya lo manejamos con el hook)
    const filteredNews = newsData?.documents || [];

    // Función de búsqueda
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    // Función para abrir y cerrar el modal
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

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
                            onClick={handleOpenModal} // Abre el modal al hacer clic
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
                            <NewsDataElement key={document._id} newsData={document} canDelete={true} />
                        )}
                    />
                )}

                {isLoading && <p>Loading news...</p>}
            </div>

            {/* Modal para crear noticias */}
            {isModalOpen && (
                <CreateNewsModal
                    onClose={handleCloseModal}
                    onCreateSuccess={() => {
                        handleCloseModal();
                        fetchNews(); // Actualizamos las noticias después de crear una nueva
                    }}
                />
            )}
        </SectionContainer>
    );
};

export default NewsPage;