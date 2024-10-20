import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import PrimaryButton from "../../../components/ui/buttons/PrimaryButton";
import PaginatedContainer from "../../../components/ui/containers/PaginatedContainer";
import SearchBar from '../../../components/ui/inputs/SearchBar';
// import CreateGroupModal from "./CreateGroupModal"; // Asumiendo que tienes un modal similar para crear grupos
import ResourceGroupComponent from './ResourceGroupComponent';

const InstitutionResourcesGroupTab: React.FC<{ onOpenModal: () => void, isModalOpen: boolean, handleCloseModal: () => void }> = ({ onOpenModal, isModalOpen, handleCloseModal }) => {
    const [page, setPage] = useState(1);
    const totalPages = 1; // Páginas simuladas
    const [searchQuery, setSearchQuery] = useState('');

    // Placeholder para un grupo de recursos
    const resourceGroups = [
        {
            _id: 'group1',
            name: 'Frontend Resources',
            institutionId: 'institution123',
            creatorId: 'admin123',
            resources: [
                { _id: '1', title: 'JavaScript Audio', type: 'Audio', url: 'https://example.com/audio.mp3' },
                { _id: '2', title: 'React Video', type: 'Video', url: 'https://example.com/video.mp4' },
                { _id: '3', title: 'CSS Notes', type: 'Notes/Text', text: 'CSS notes for beginners...' }
            ]
        },
        {
            _id: 'group2',
            name: 'Backend Resources',
            institutionId: 'institution123',
            creatorId: 'admin456',
            resources: [
                { _id: '4', title: 'Node.js Tutorial', type: 'Video', url: 'https://example.com/nodejs.mp4' },
                { _id: '5', title: 'Database PDF', type: 'Documents', url: '/documents/database.pdf' }
            ]
        }
    ];

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    // Filtrar los grupos de recursos según la búsqueda
    const filteredGroups = resourceGroups.filter((group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <SearchBar
                    placeholder="Search resource groups..."
                    onSearch={handleSearch}
                />
                <PrimaryButton
                    label="Create Group"
                    iconComponent={<FaPlus />}
                    className="ml-4"
                    onClick={onOpenModal}
                />
            </div>

            <PaginatedContainer
                documents={filteredGroups}
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                RenderComponent={({ document }) => (
                    <ResourceGroupComponent key={document._id} resourceGroup={document} />
                )}
            />

            {/*{isModalOpen && (*/}
            {/*    <CreateGroupModal*/}
            {/*        onClose={handleCloseModal}*/}
            {/*        onSaveSuccess={() => {*/}
            {/*            handleCloseModal();*/}
            {/*        }}*/}
            {/*    />*/}
            {/*)}*/}
        </>
    );
};

export default InstitutionResourcesGroupTab;