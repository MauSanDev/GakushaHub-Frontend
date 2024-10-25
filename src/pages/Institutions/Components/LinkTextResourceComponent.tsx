import React, { useState, useEffect } from 'react';
import { FaTrash, FaLink, FaYoutube, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import Container from "../../../components/ui/containers/Container.tsx";

export interface LinkTextResourceData {
    title: string;
    description?: string;
    type: string;
    url?: string;
    tags?: string[];
}

interface LinkTextResourceComponentProps {
    instanceId: string;
    onDelete: () => void;
}

const useFetchResourceData = (instanceId: string): LinkTextResourceData | null => {
    const [resource, setResource] = useState<LinkTextResourceData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const fakeData: LinkTextResourceData = {
                title: "",
                description: "",
                type: "Note",
                url: "",
                tags: []
            };
            setResource(fakeData);
        };

        fetchData();
    }, [instanceId]);

    return resource;
};

const LinkTextResourceComponent: React.FC<LinkTextResourceComponentProps> = ({ instanceId, onDelete }) => {
    const resource = useFetchResourceData(instanceId);

    const [localResource, setLocalResource] = useState<LinkTextResourceData | null>(resource);
    const [isEditing, setIsEditing] = useState<boolean>(true); // Empieza en modo de edición siempre
    const [error, setError] = useState<string | null>(null);
    const [isValidUrl, setIsValidUrl] = useState<boolean>(true);

    useEffect(() => {
        if (resource) {
            setLocalResource(resource);
        }
    }, [resource]);

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

    const handleSave = () => {
        if (!localResource?.title.trim()) {
            setError("Title cannot be empty");
            return;
        }
        if (!isValidUrl) {
            setError("Url format is invalid");
            return;
        }
        setError(null);

        console.log("Recurso guardado:", localResource);

        setIsEditing(false);
    };

    const handleCancel = () => {
        if (!localResource?.title.trim()) {
            setError("Title cannot be empty to cancel");
            return;
        }
        setLocalResource(resource); // Revertimos los cambios al original
        setIsEditing(false);
        setError(null);
    };

    const handleChange = (field: keyof LinkTextResourceData, value: string) => {
        if (localResource) {
            setLocalResource((prev) => prev ? { ...prev, [field]: value } : null);
        }
    };

    if (!localResource) {
        return <div>Loading...</div>;
    }

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