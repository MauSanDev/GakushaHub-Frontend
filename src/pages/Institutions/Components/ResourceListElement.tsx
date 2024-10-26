import React, { useState } from 'react';
import {FaClock, FaFolderOpen, FaTags, FaFileAlt, FaFileArchive, FaFilm, FaImage, FaLink, FaMusic, FaStickyNote, FaYoutube, FaCheck } from 'react-icons/fa';
import RoundedTag from "../../../components/ui/text/RoundedTag.tsx";
import { ResourceData, ResourceTypes } from "../../../data/Institutions/ResourceData.ts";
import TertiaryButton from "../../../components/ui/buttons/TertiaryButton.tsx";
import ResourceDisplayModal from "../ResourceDisplayModal.tsx";

interface ResourceListElementProps {
    resourceData: ResourceData;
    canOpen: boolean;
    onSelect?: () => void;
    isSelected?: boolean;
}

export const getResourceIcon = (type: ResourceTypes, url: string = "") => {
    switch (type) {
        case ResourceTypes.Audio: return <FaMusic className="text-purple-500" />;
        case ResourceTypes.Video: return <FaFilm className="text-red-500" />;
        case ResourceTypes.Image: return <FaImage className="text-green-500" />;
        case ResourceTypes.Document: return <FaFileAlt className="text-orange-500" />;
        case ResourceTypes.Compressed: return <FaFileArchive className="text-yellow-500" />;
        case ResourceTypes.LinkText: {
            if (url) {
                return url.includes('youtube') ? <FaYoutube className="text-red-600" /> : <FaLink className="text-blue-500" />;
            }
            return <FaStickyNote className="text-teal-500" />;
        }
        default: return <FaFileAlt className="text-gray-500" />;
    }
};

const ResourceListElement: React.FC<ResourceListElementProps> = ({ resourceData, onSelect, isSelected = false, canOpen }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const openModal = () => {
        if (resourceData.type === ResourceTypes.LinkText && resourceData.url) {
            const parsedUrl = resourceData.url.startsWith('http://') || resourceData.url.startsWith('https://')
                ? resourceData.url
                : `http://${resourceData.url}`;
            window.open(parsedUrl, '_blank');
            return;
        }
        setIsModalOpen(true);
    };
    
    return (
        <>
            <div
                onClick={onSelect}
                className={`relative p-2 mb-0 rounded-lg shadow-sm text-left border-2 transition-all bg-white border-gray-200 hover:border-blue-300 dark:bg-gray-900 dark:border-gray-800 hover:dark:border-gray-700 w-full max-w-4xl flex justify-between gap-1 ${isSelected ? 'dark:border-green-800 dark:hover:border-green-600 border-green-500 hover:border-green-300' : ''}`}
            >
                <div className="flex items-center gap-2">
                    <div>{getResourceIcon(resourceData.type, resourceData.url)}</div>
                    <div className="flex flex-col">
                        <h2 className="text-md font-bold text-gray-600 dark:text-white">
                            {resourceData.title || 'Untitled'}
                        </h2>
                        {resourceData.type === ResourceTypes.LinkText && resourceData.url && (
                            <a href={resourceData.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs underline">
                                {resourceData.url}
                            </a>
                        )}
                        {resourceData.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {resourceData.description}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 gap-4 ml-auto">
                    <span className="flex items-center">
                        <FaClock className="mr-1" />
                        <span>{new Date(resourceData.createdAt).toLocaleDateString()}</span>
                    </span>
                    {resourceData.tags && resourceData.tags.length > 0 && (
                        <div className="flex items-center gap-2">
                            <FaTags className="text-blue-300 dark:text-gray-700" />
                            <div className="flex flex-wrap gap-1">
                                {resourceData.tags.map((tag, index) => (
                                    <RoundedTag key={index} textKey={tag} className="text-xs text-gray-500 dark:text-gray-400 bg-blue-100 dark:bg-gray-950" />
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="flex items-center space-x-0.5">
                        {canOpen && <TertiaryButton iconComponent={<FaFolderOpen />} label="Open" onClick={openModal} />}
                        {isSelected && (
                            <FaCheck className="text-green-500 ml-2" />
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <ResourceDisplayModal resourceData={resourceData} onClose={() => setIsModalOpen(false)}/>
            )}
        </>
    );
};

export default ResourceListElement;