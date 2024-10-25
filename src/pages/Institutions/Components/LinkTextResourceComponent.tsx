import React, { useState, useEffect } from 'react';
import { FaTrash, FaLink, FaYoutube, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import Container from "../../../components/ui/containers/Container.tsx";
import { useResources } from '../../../hooks/newHooks/useResources';
import { useUpdateData } from '../../../hooks/updateHooks/useUpdateData';
import {CollectionTypes} from "../../../data/CollectionTypes.tsx";

interface LinkTextResourceComponentProps {
    instanceId: string;
    institutionId: string;
    onDelete: () => void;
}

export interface LinkTextResourceData {
    _id?: string, 
    title: string;
    description?: string;
    type: string;
    url?: string;
    tags?: string[];
}


const LinkTextResourceComponent: React.FC<LinkTextResourceComponentProps> = ({institutionId, onDelete}) => {
    const { createResource } = useResources(institutionId, 1, 10); 
    const { mutateAsync: updateResource } = useUpdateData<LinkTextResourceData>(); 

    const [localResource, setLocalResource] = useState<LinkTextResourceData>({
        title: '',
        description: '',
        type: 'Note',
        url: '',
        tags: [],
    });
    const [isEditing, setIsEditing] = useState<boolean>(true); 
    const [error, setError] = useState<string | null>(null);
    const [isValidUrl, setIsValidUrl] = useState<boolean>(true);
    const [isCreated, setIsCreated] = useState<boolean>(false); 

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
        if (!localResource?.title.trim()) {
            setError("Title cannot be empty");
            return;
        }
        if (!isValidUrl) {
            setError("Url format is invalid");
            return;
        }
        setError(null);

        try {
            if (!isCreated) {
                
                const createdResource = await createResource({
                    title: localResource.title,
                    description: localResource.description,
                    type: localResource.type,
                    url: localResource.url,
                    tags: localResource.tags,
                    institutionId,
                });
                setLocalResource((prev) => ({ ...prev, _id: createdResource._id }));
                setIsCreated(true);
            } else {
                
                console.log("update");
                await updateResource({
                    collection: CollectionTypes.Resources,
                    documentId: localResource._id as string,
                    newData: {
                        title: localResource.title,
                        description: localResource.description,
                        url: localResource.url,
                        tags: localResource.tags,
                    }
                });
            }

            setIsEditing(false);
        } catch (err) {
            setError("Error saving resource");
            console.error(err);
        }
    };

    const handleCancel = () => {
        if (!localResource?.title.trim()) {
            setError("Title cannot be empty to cancel");
            return;
        }
        
        setIsEditing(false);
        setError(null);
    };

    const handleChange = (field: keyof LinkTextResourceData, value: string) => {
        setLocalResource((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Container className="relative p-4 mb-4 flex flex-col border border-gray-300 dark:border-gray-600 bg-transparent rounded-lg my-2">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    {localResource.url?.includes('youtube') ? <FaYoutube className="text-red-600" /> : <FaLink className="text-blue-500" />}
                    {isEditing ? (
                        <input
                            value={localResource.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="Title"
                            className="w-full p-1 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none text-lg font-semibold dark:text-white"
                        />
                    ) : (
                        <h2 className="text-md font-bold text-gray-600 dark:text-white">
                            {localResource.title || 'Untitled'}
                        </h2>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <button onClick={handleSave} className="text-green-500 hover:text-green-700">
                                <FaSave />
                            </button>
                            <button onClick={handleCancel} className="text-red-500 hover:text-red-700">
                                <FaTimes />
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-700">
                            <FaEdit />
                        </button>
                    )}
                    <button onClick={onDelete} className="text-red-500 hover:text-red-700">
                        <FaTrash />
                    </button>
                </div>
            </div>

            {isEditing ? (
                <>
                    <input
                        value={localResource.url || ''}
                        onChange={(e) => handleChange('url', e.target.value)}
                        placeholder="URL"
                        className={`w-full p-1 bg-transparent border-b focus:outline-none ${!isValidUrl ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} text-sm dark:text-white`}
                    />
                    {!isValidUrl && <p className="text-red-500 text-xs mt-1">Invalid URL format</p>}

                    <textarea
                        value={localResource.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Description (optional)"
                        className="w-full p-1 bg-transparent border-b border-gray-200 dark:border-gray-200 focus:outline-none text-sm dark:text-white resize-vertical overflow-hidden"
                        rows={1}
                    />
                </>
            ) : (
                <>
                    {localResource.url && (
                        <a href={localResource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                            {localResource.url}
                        </a>
                    )}
                    {localResource.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{localResource.description}</p>}
                </>
            )}

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </Container>
    );
};

export default LinkTextResourceComponent;