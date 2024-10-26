import React, { useEffect, useState } from 'react';
import { FaClock, FaDownload, FaTags } from 'react-icons/fa';
import {ResourceData, ResourceTypes} from "../../data/Institutions/ResourceData.ts";
import useUploadFile from "../../hooks/newHooks/Resources/useUploadFile.ts";
import ModalWrapper from "../ModalWrapper.tsx";
import RoundedTag from "../../components/ui/text/RoundedTag.tsx";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";


interface ResourceDisplayModalProps {
    resourceData: ResourceData;
    onClose: () => void;
}

const ResourceDisplayModal: React.FC<ResourceDisplayModalProps> = ({ resourceData, onClose }) => {
    const [resourceUrl, setResourceUrl] = useState<string | null>(null);
    const [loadingUrl, setLoadingUrl] = useState(false);
    const { getTemporaryURL, error: uploadError } = useUploadFile({ path: resourceData.url || '' });

    useEffect(() => {
        if ( resourceData.url) {
            fetchResourceUrl();
        }
    }, [resourceData]);

    const fetchResourceUrl = async () => {
        setLoadingUrl(true);
        try {
            const tempUrl = await getTemporaryURL();
            setResourceUrl(tempUrl);
        } catch (err) {
            console.error('Error fetching resource URL:', err);
        }
        setLoadingUrl(false);
    };

    return (
        <ModalWrapper onClose={onClose}>
            <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">{resourceData.title}</h2>

            {resourceData.type === ResourceTypes.Audio && resourceUrl && (
                <audio controls className="w-full mb-4">
                    <source src={resourceUrl} />
                    Your browser does not support the audio element.
                </audio>
            )}

            {resourceData.type === ResourceTypes.Video && resourceUrl && (
                <video controls className="w-full mb-4">
                    <source src={resourceUrl} />
                    Your browser does not support the video tag.
                </video>
            )}

            {resourceData.type === ResourceTypes.Image && resourceUrl && (
                <div className="flex flex-col items-center">
                    <img src={resourceUrl} alt={resourceData.title} className="mb-4 max-w-full h-auto" />
                </div>
            )}

            {resourceData.type === ResourceTypes.LinkText && resourceData.description && (
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                    <p>{resourceData.description}</p>
                </div>
            )}

            {(resourceData.type === ResourceTypes.Compressed || resourceData.type === ResourceTypes.Document) && (
                <div className="text-sm text-gray-700 dark:text-gray-300">
                    <p><strong>File Name:</strong> {resourceData.title}</p>
                    <p><strong>Size:</strong> {resourceData.size}</p>
                </div>
            )}

            {(resourceData.type !== ResourceTypes.LinkText && resourceUrl) && (
                <PrimaryButton
                    label="Download"
                    iconComponent={<FaDownload />}
                    className="mt-4"
                    onClick={() => window.open(resourceUrl, '_blank')}
                />
            )}

            <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 gap-4">
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
            </div>

            {loadingUrl && <p>Loading resource...</p>}
            {uploadError && <p>Error fetching URL: {uploadError}</p>}
        </ModalWrapper>
    );
};

export default ResourceDisplayModal;