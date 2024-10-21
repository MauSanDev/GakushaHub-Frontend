import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import NewsDataElement from "./Components/NewsDataElement.tsx";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import PaginatedContainer from "../../components/ui/containers/PaginatedContainer.tsx";
import SearchBar from '../../components/ui/inputs/SearchBar.tsx';
import SectionContainer from "../../components/ui/containers/SectionContainer.tsx";
import CreateNewsModal from "./CreateNewsModal.tsx";

const NewsPage: React.FC = () => {
    // Datos de ejemplo para las noticias
    const newsData = [
        {
            _id: '1',
            title: 'New Course Available',
            text: 'We have added a new course about advanced JavaScript techniques. Enroll now!',
            tags: ['Course', 'JavaScript', 'Advanced'],
            creatorId: 'admin123',
            createdAt: '2023-10-20T10:30:00Z',
        },
        {
            _id: '2',
            title: 'Upcoming Event: React Workshop',
            text: 'Join us for a hands-on workshop on React. Learn how to build modern web apps with React.',
            tags: ['Event', 'React', 'Workshop'],
            creatorId: 'admin456',
            createdAt: '2023-10-18T09:00:00Z',
        },
        {
            _id: '3',
            title: 'Monthly Newsletter',
            text: 'Catch up on all the latest news and updates from our institution in this month’s newsletter.',
            tags: ['Newsletter', 'Update'],
            creatorId: 'admin789',
            createdAt: '2023-10-15T12:00:00Z',
        },
    ];

    // Estado para la paginación y búsqueda
    const [page, setPage] = useState(1);
    const totalPages = 1; // Total de páginas simulado
    const [searchQuery, setSearchQuery] = useState(''); // Para manejar la búsqueda
    const [isModalOpen, setIsModalOpen] = useState(false); // Para manejar el modal

    // Función de búsqueda simulada
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    // Filtrado de noticias basado en la búsqueda
    const filteredNews = newsData.filter((news) =>
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                <PaginatedContainer
                    documents={filteredNews}
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    RenderComponent={({ document }) => (
                        <NewsDataElement key={document._id} newsData={document} canDelete={true} />
                    )}
                />
            </div>

            {/* Modal para crear noticias */}
            {isModalOpen && (
                <CreateNewsModal
                    onClose={handleCloseModal}
                    onCreateSuccess={() => {
                        handleCloseModal();
                    }}
                />
            )}
        </SectionContainer>
    );
};

export default NewsPage;