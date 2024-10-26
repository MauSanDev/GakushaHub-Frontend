import React, {useEffect, useState} from 'react';
import {FaClock, FaEdit, FaFileAlt, FaFileArchive, FaFilm, FaFolderOpen, FaImage, FaLink, FaMusic, FaSave, FaStickyNote, FaTags, FaTimes, FaTrash, FaYoutube} from 'react-icons/fa';
import {CollectionTypes} from "../../../data/CollectionTypes";
import RoundedTag from "../../../components/ui/text/RoundedTag.tsx";
import {ResourceData, ResourceTypes} from "../../../data/Institutions/ResourceData.ts";
import useUploadFile from "../../../hooks/newHooks/Resources/useUploadFile.ts";
import {useUpdateData} from '../../../hooks/updateHooks/useUpdateData';
import TertiaryButton from "../../../components/ui/buttons/TertiaryButton.tsx";
import {useDeleteElement} from "../../../hooks/useDeleteElement.ts";
import ResourceDisplayModal from "../ResourceDisplayModal.tsx";

interface ResourceDataElementProps {
    resourceData: ResourceData;
    canEdit?: boolean;
    onDelete?: () => void;
}

export const getResourceIcon = (type: ResourceTypes, url: string = "") => {
    switch (type) {
        case ResourceTypes.Audio: return <FaMusic className="text-purple-500" />;
        case ResourceTypes.Video: return <FaFilm className="text-red-500" />;
        case ResourceTypes.Image: return <FaImage className="text-green-500" />;
        case ResourceTypes.Document: return <FaFileAlt className="text-orange-500" />;
        case ResourceTypes.Compressed: return <FaFileArchive className="text-yellow-500" />;
        case ResourceTypes.LinkText: {
            if (url)
            {
                if (url.includes('youtube'))
                {
                    return <FaYoutube className="text-red-600" />
                }
                return <FaLink className="text-blue-500" />
            }
            return <FaStickyNote className="text-teal-500"/>;
        }
        default: return <FaFileAlt className="text-gray-500" />;
    }
};

const ResourceDataElement: React.FC<ResourceDataElementProps> = ({ resourceData, onDelete, canEdit}) => {
    const { mutateAsync: updateResource } = useUpdateData<ResourceData>();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [localResource, setLocalResource] = useState<ResourceData>(resourceData);
    const [isValidUrl, setIsValidUrl] = useState<boolean>(true);
    const { mutate: deleteResource} = useDeleteElement();


    const { deleteFile } = useUploadFile({
        path: resourceData.url || ''
    });

    useEffect(() => {
        if (localResource?.url) {
            const urlPattern = new RegExp(
                '^(https?:\\/\\/)?' +
                '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|' +
                '((\\d{1,3}\\.){3}\\d{1,3}))' +
                '(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*' +
                '(\\?[;&a-zA-Z\\d%_.~+=-]*)?' +
                '(\\#[-a-zA-Z\\d_]*)?$', 'i'
            );
            setIsValidUrl(urlPattern.test(localResource.url));
        } else {
            setIsValidUrl(true);
        }
    }, [localResource?.url]);


    const handleSave = async () => {
        if (!localResource?.title.trim() || (localResource.type === ResourceTypes.LinkText && !isValidUrl)) {
            return;
        }

        try {
            await updateResource({
                collection: CollectionTypes.Resources,
                documentId: localResource._id,
                newData: {
                    title: localResource.title,
                    description: localResource.description,
                    url: localResource.url,
                    tags: localResource.tags,
                }
            });
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCancel = () => {
        setLocalResource(resourceData);
        setIsEditing(false);
    };

    const handleChange = (field: keyof ResourceData, value: string) => {
        setLocalResource((prev) => ({ ...prev, [field]: value }));
    };

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

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this resource?");

        if (confirmDelete) {
            if (resourceData.type !== ResourceTypes.LinkText)
            {
                await deleteFile();
            }
            
            deleteResource(
                {
                    elementIds: [resourceData._id],
                    elementType: CollectionTypes.Resources,
                    deleteRelations: true,
                },
                {
                    onSuccess: () => {
                        if (onDelete)
                        {
                            onDelete();
                        }
                    },
                    onError: (error) => {
                        console.error('Error deleting member:', error);
                    },
                }
            );
        }
    };

    return (
        <>
            <div>
                <div className="relative p-2 mb-0 rounded-lg shadow-sm text-left border-2 transition-all bg-white border-gray-200 hover:border-blue-300 dark:bg-gray-900 dark:border-gray-800 hover:dark:border-gray-700 w-full max-w-4xl flex justify-between gap-1">

                    <div className="flex items-center gap-2">
                        <div>{getResourceIcon(localResource.type, localResource.url)}</div>
                        <div className="flex flex-col">
                            {isEditing ? (
                                <>
                                    <input
                                        value={localResource.title}
                                        onChange={(e) => handleChange('title', e.target.value)}
                                        placeholder="Title"
                                        className="w-full p-1 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none text-lg font-semibold dark:text-white"
                                    />

                                    {localResource.type === ResourceTypes.LinkText && (
                                        <input
                                            value={localResource.url || ''}
                                            onChange={(e) => handleChange('url', e.target.value)}
                                            placeholder="URL"
                                            className={`w-full p-1 bg-transparent border-b focus:outline-none ${!isValidUrl ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} text-sm dark:text-white`}
                                        />
                                    )}
                                    
                                    <textarea
                                        value={localResource.description || ''}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        placeholder="Description"
                                        className="w-full p-1 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none text-sm dark:text-white resize-vertical"
                                        rows={2}
                                    />
                                </>
                            ) : (
                                <>
                                    <h2 className="text-md font-bold text-gray-600 dark:text-white">
                                        {localResource.title || 'Untitled'}
                                    </h2>
                                    
                                    {localResource.type === ResourceTypes.LinkText && localResource.url && (
                                        <a href={localResource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs underline">
                                            {localResource.url}
                                        </a>
                                    )}
                                    
                                    {localResource.description && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            {localResource.description}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 gap-4 ml-auto">
                        <span className="flex items-center">
                            <FaClock className="mr-1" />
                            <span>{new Date(resourceData.createdAt).toLocaleDateString()}</span>
                        </span>
                        {localResource.tags && localResource.tags.length > 0 && (
                            <div className="flex items-center gap-2">
                                <FaTags className="text-blue-300 dark:text-gray-700" />
                                <div className="flex flex-wrap gap-1">
                                    {localResource.tags.map((tag, index) => (
                                        <RoundedTag key={index} textKey={tag} className="text-xs text-gray-500 dark:text-gray-400 bg-blue-100 dark:bg-gray-950" />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="flex items-center space-x-0.5">
                            {isEditing ? (
                                <>
                                    <TertiaryButton iconComponent={<FaSave />} onClick={handleSave} className="hover:text-green-500"/>
                                    <TertiaryButton iconComponent={<FaTimes />} onClick={handleCancel} className="hover:text-red-500"/>

                                </>
                            ) : (
                                <>
                                    {canEdit && <TertiaryButton iconComponent={<FaEdit />} onClick={() => setIsEditing(true)} />}
                                    {canEdit && <TertiaryButton iconComponent={<FaTrash />} onClick={handleDelete} className="hover:text-red-500"/>}
                                    <TertiaryButton iconComponent={<FaFolderOpen />} label={"Open"} onClick={openModal} />
                                </>
                        )}

                            
                        </div>
                    </div>
                </div>
            </div>


            {isModalOpen && (
                <ResourceDisplayModal resourceData={resourceData} onClose={() => setIsModalOpen(false)}/>
            )}
        </>
    );
};

export default ResourceDataElement;