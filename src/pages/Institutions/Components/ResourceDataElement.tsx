import React, { useState } from 'react';
import { FaFileAlt, FaMusic, FaFilm, FaLink, FaYoutube, FaImage, FaFileArchive, FaStickyNote, FaClock, FaUser, FaTags } from 'react-icons/fa';
import Container from "../../../components/ui/containers/Container";
import DeleteButton from "../../../components/DeleteButton";
import RoundedTag from "../../../components/ui/text/RoundedTag";
import { CollectionTypes } from "../../../data/CollectionTypes";

export interface ResourceData {
    _id: string;
    title: string;
    type: string;
    path: string;
    extension: string;
    size: string;
    url?: string;
    text?: string;
    tags: string[];
    creatorId: string;
    createdAt: string;
}

interface ResourceDataElementProps {
    resourceData: ResourceData;
    canDelete?: boolean;
}

const ResourceDataElement: React.FC<ResourceDataElementProps> = ({ resourceData, canDelete = false }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Asignar íconos y colores según el tipo de recurso
    const getResourceIcon = (type: string) => {
        switch (type) {
            case 'Audio': return <FaMusic className="text-purple-500" />;
            case 'Video': return <FaFilm className="text-red-500" />;
            case 'Link': return <FaLink className="text-blue-500" />;
            case 'YouTube Links': return <FaYoutube className="text-red-600" />;
            case 'Images': return <FaImage className="text-green-500" />;
            case 'Documents': return <FaFileAlt className="text-orange-500" />;
            case 'Files (rar)': return <FaFileArchive className="text-yellow-500" />;
            case 'Notes/Text': return <FaStickyNote className="text-teal-500" />;
            default: return <FaFileAlt className="text-gray-500" />;
        }
    };

    return (
        <>
            <div onClick={openModal} className="cursor-pointer">
                <Container className="w-full max-w-4xl relative">
                    {canDelete && (
                        <div className="absolute top-2 right-2">
                            <DeleteButton
                                creatorId={resourceData.creatorId}
                                elementId={resourceData._id}
                                elementType={CollectionTypes.Resources}
                                deleteRelations={false}
                            />
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        {/* Icono del recurso */}
                        <div>
                            {getResourceIcon(resourceData.type)}
                        </div>
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                            {resourceData.title || 'Resource Title'}
                        </h2>
                    </div>

                    {/* Metadata: Creator, Date, Tags - Debajo del título */}
                    <div className="flex flex-wrap justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center">
                                <FaUser className="mr-1" />
                                <span>{resourceData.creatorId || 'Unknown Creator'}</span>
                            </span>
                            <span className="flex items-center">
                                <FaClock className="mr-1" />
                                <span>{new Date(resourceData.createdAt).toLocaleDateString()}</span>
                            </span>
                        </div>

                        {/* Tags */}
                        {resourceData.tags && resourceData.tags.length > 0 && (
                            <div className="flex items-center gap-2 mt-1">
                                <FaTags className="text-gray-500 dark:text-gray-400" />
                                <div className="flex flex-wrap gap-2">
                                    {resourceData.tags.map((tag, index) => (
                                        <RoundedTag key={index} textKey={tag} className="text-xs" />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Container>
            </div>

            {isModalOpen && (
                <div> {/* Modal de visualización o manejo del recurso */} </div>
            )}
        </>
    );
};

export default ResourceDataElement;