import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import PaginatedContainer from "../../components/ui/containers/PaginatedContainer";
import SearchBar from '../../components/ui/inputs/SearchBar';
import SectionContainer from "../../components/ui/containers/SectionContainer";
import CreateResourceModal from "./CreateResourceModal";
import ResourceDataElement from "./Components/ResourceDataElement.tsx";

const InstitutionResourcesPage: React.FC = () => {
    // Ejemplo de recursos
    const resourcesData = [
        {
            _id: '1',
            title: 'JavaScript Audio',
            type: 'Audio',
            url: 'https://example.com/audio.mp3',
            tags: ['Audio', 'JavaScript'],
            creatorId: 'admin123',
            createdAt: '2023-10-20T10:30:00Z',
        },
        {
            _id: '2',
            title: 'React Video',
            type: 'Video',
            url: 'https://example.com/video.mp4',
            tags: ['Video', 'React'],
            creatorId: 'admin456',
            createdAt: '2023-10-18T09:00:00Z',
        },
        {
            _id: '3',
            title: 'CSS Notes',
            type: 'Notes/Text',
            text: 'These are some CSS notes for beginners...',
            tags: ['Notes', 'CSS'],
            creatorId: 'admin789',
            createdAt: '2023-10-15T12:00:00Z',
        },
        {
            _id: '4',
            title: 'GitHub Link',
            type: 'Link',
            url: 'https://github.com/example/repo',
            tags: ['Link', 'GitHub'],
            creatorId: 'admin654',
            createdAt: '2023-10-22T08:00:00Z',
        },
        {
            _id: '5',
            title: 'YouTube Tutorial',
            type: 'YouTube Links',
            url: 'https://www.youtube.com/watch?v=example',
            tags: ['YouTube', 'Tutorial'],
            creatorId: 'admin321',
            createdAt: '2023-10-19T14:30:00Z',
        },
        {
            _id: '6',
            title: 'HTML Basics Image',
            type: 'Images',
            url: 'https://example.com/image.png',
            tags: ['Image', 'HTML'],
            creatorId: 'admin789',
            createdAt: '2023-10-12T10:15:00Z',
        },
        {
            _id: '7',
            title: 'Advanced JavaScript Document',
            type: 'Documents',
            path: '/documents/advanced-js.pdf',
            extension: 'pdf',
            size: '1.5MB',
            tags: ['Documents', 'JavaScript'],
            creatorId: 'admin987',
            createdAt: '2023-10-10T11:45:00Z',
        },
        {
            _id: '8',
            title: 'Project Files Archive',
            type: 'Files (rar)',
            path: '/files/project-files.rar',
            extension: 'rar',
            size: '500MB',
            tags: ['Archive', 'Project'],
            creatorId: 'admin654',
            createdAt: '2023-10-08T09:20:00Z',
        }
    ];

    const [page, setPage] = useState(1);
    const totalPages = 1; // Páginas simuladas
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const filteredResources = resourcesData.filter((resource) =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (resource.text || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <SectionContainer title={"Institution Resources"}>
            <div className="w-full max-w-4xl mx-auto mt-6">
                <div className="flex justify-between items-center mb-4">
                    <PrimaryButton
                        label="Add Resource"
                        iconComponent={<FaPlus />}
                        className="ml-2"
                        onClick={handleOpenModal}
                    />
                </div>

                <div className="mb-4">
                    <SearchBar
                        placeholder="Search resources..."
                        onSearch={handleSearch}
                    />
                </div>

                <PaginatedContainer
                    documents={filteredResources}
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    RenderComponent={({ document }) => (
                        <ResourceDataElement key={document._id} resourceData={document} canDelete={true} />
                    )}
                />
            </div>

            {isModalOpen && (
                <CreateResourceModal
                    onClose={handleCloseModal}
                    onSaveSuccess={() => {
                        handleCloseModal();
                    }}
                />
            )}
        </SectionContainer>
    );
};

export default InstitutionResourcesPage;