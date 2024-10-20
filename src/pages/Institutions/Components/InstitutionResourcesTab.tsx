import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import PrimaryButton from "../../../components/ui/buttons/PrimaryButton";
import PaginatedContainer from "../../../components/ui/containers/PaginatedContainer";
import SearchBar from '../../../components/ui/inputs/SearchBar';
import CreateResourceModal from "./../CreateResourceModal";
import ResourceDataElement from "./../Components/ResourceDataElement";

const InstitutionResourcesTab: React.FC<{ onOpenModal: () => void, isModalOpen: boolean, handleCloseModal: () => void }> = ({ onOpenModal, isModalOpen, handleCloseModal }) => {
    // Ejemplo de recursos
    const resourcesData = [
        {
            _id: '1',
            title: 'JavaScript Audio',
            type: 'Audio',
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Enlace correcto de MP3
            tags: ['Audio', 'JavaScript'],
            creatorId: 'admin123',
            createdAt: '2023-10-20T10:30:00Z',
        },
        {
            _id: '2',
            title: 'React Video',
            type: 'Video',
            url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4', // Enlace correcto de MP4
            tags: ['Video', 'React'],
            creatorId: 'admin456',
            createdAt: '2023-10-18T09:00:00Z',
        },
        {
            _id: '3',
            title: 'CSS Notes',
            type: 'Notes/Text',
            text: 'These are some CSS notes for beginners. CSS is used for styling HTML documents.',
            tags: ['Notes', 'CSS'],
            creatorId: 'admin789',
            createdAt: '2023-10-15T12:00:00Z',
        },
        {
            _id: '4',
            title: 'GitHub Link',
            type: 'Link',
            url: 'https://github.com/',
            tags: ['Link', 'GitHub'],
            creatorId: 'admin654',
            createdAt: '2023-10-22T08:00:00Z',
        },
        {
            _id: '5',
            title: 'YouTube Tutorial',
            type: 'YouTube Links',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            tags: ['YouTube', 'Tutorial'],
            creatorId: 'admin321',
            createdAt: '2023-10-19T14:30:00Z',
        },
        {
            _id: '6',
            title: 'HTML Basics Image',
            type: 'Images',
            url: 'https://www.w3schools.com/html/pic_trulli.jpg',
            tags: ['Image', 'HTML'],
            creatorId: 'admin789',
            createdAt: '2023-10-12T10:15:00Z',
        },
        {
            _id: '7',
            title: 'Advanced JavaScript Document',
            type: 'Documents',
            path: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
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
            path: 'https://file-examples-com.github.io/uploads/2017/02/zip_10MB.zip',
            extension: 'zip',
            size: '10MB',
            tags: ['Archive', 'Project'],
            creatorId: 'admin654',
            createdAt: '2023-10-08T09:20:00Z',
        }
    ];

    const [page, setPage] = useState(1);
    const totalPages = 1; // Páginas simuladas
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const filteredResources = resourcesData.filter((resource) =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (resource.text || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <SearchBar
                    placeholder="Search resources..."
                    onSearch={handleSearch}
                />
                <PrimaryButton
                    label="Add Resource"
                    iconComponent={<FaPlus />}
                    className="ml-4"
                    onClick={onOpenModal}
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

            {isModalOpen && (
                <CreateResourceModal
                    onClose={handleCloseModal}
                    onSaveSuccess={() => {
                        handleCloseModal();
                    }}
                />
            )}
        </>
    );
};

export default InstitutionResourcesTab;