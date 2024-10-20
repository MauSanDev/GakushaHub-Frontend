import React, { useState } from 'react';
import ModalWrapper from '../ModalWrapper';
import SectionTitle from "../../components/ui/text/SectionTitle";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import { FaPlus, FaFileImport, FaLink } from 'react-icons/fa';
import FileResourceComponent from './Components/FileResourceComponent';
import LinkTextResourceComponent, { LinkTextResourceData } from './Components/LinkTextResourceComponent';

interface ResourceData {
    _id: string;
    type: string;
    file?: File;
    linkTextData?: LinkTextResourceData;
}

interface CreateResourceModalProps {
    onClose: () => void;
    onSaveSuccess?: () => void;
}

const CreateResourceModal: React.FC<CreateResourceModalProps> = ({ onClose, onSaveSuccess }) => {
    const [resources, setResources] = useState<ResourceData[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            const newResources = filesArray.map(file => ({
                _id: Math.random().toString(),
                type: 'File',
                file,
            }));
            setResources([...resources, ...newResources]);
        }
    };

    const handleAddLinkOrText = () => {
        const newResource: ResourceData = {
            _id: Math.random().toString(),
            type: 'LinkOrText',
            linkTextData: {
                _id: Math.random().toString(),
                title: '',
                url: '',
                text: '',
            }
        };
        setResources([...resources, newResource]);
    };

    const handleDeleteResource = (id: string) => {
        setResources(resources.filter(resource => resource._id !== id));
    };

    const handleResourceChange = (id: string, field: keyof LinkTextResourceData, value: string) => {
        const updatedResources = resources.map(resource =>
            resource._id === id && resource.linkTextData
                ? { ...resource, linkTextData: { ...resource.linkTextData, [field]: value } }
                : resource
        );
        setResources(updatedResources);
    };

    const handleSaveResources = () => {
        if (resources.length === 0) {
            setError("No resources to save.");
            return;
        }

        setError(null);
        if (onSaveSuccess) {
            onSaveSuccess();
        }
        onClose();
    };

    // Drag and Drop handlers
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        const files = Array.from(event.dataTransfer.files);
        const newResources = files.map(file => ({
            _id: Math.random().toString(),
            type: 'File',
            file,
        }));
        setResources([...resources, ...newResources]);
    };

    return (
        <ModalWrapper onClose={onClose}>
            <div
                className={`w-full flex-col relative min-h-[300px] flex items-center justify-center rounded-lg p-4 
                    ${isDragging ? 'border-dashed border-2 border-green-500' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <SectionTitle title="Add New Resources" className="text-center pb-4" />

                {/* Display the Add Resource and Save buttons */}
                <div className="flex justify-between items-center mb-4 w-full">
                    <div className="relative">
                        <PrimaryButton
                            label="Add Resource"
                            iconComponent={<FaPlus />}
                            className="mr-2"
                            onClick={() => setShowDropdown(!showDropdown)}
                        />
                        {showDropdown && (<div
                                className="flex flex-col items-start justify-center text-wrap text-xs absolute bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded shadow-lg p-2 z-10">
                                <button
                                    className="w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    onClick={() => {
                                        setShowDropdown(false);
                                        document.getElementById('fileInput')?.click();
                                    }}
                                >
                                    <FaFileImport className="mr-2"/> <span>Import Files</span>
                                </button>
                                <button
                                    className="w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                                    onClick={() => {
                                        setShowDropdown(false);
                                        handleAddLinkOrText();
                                    }}
                                >
                                    <FaLink className="mr-2"/> <span>Link or Text</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <input
                        id="fileInput"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileImport}
                    />

                    <PrimaryButton
                        label="Save Resources"
                        onClick={handleSaveResources}
                        disabled={resources.length === 0}
                    />
                </div>

                {isDragging && (
                    <div
                        className="absolute top-0 left-0 w-full h-full bg-white dark:bg-black bg-opacity-50 flex items-center justify-center z-20">
                        <p className="text-green-500 font-semibold text-lg">Drag items here to import</p>
                    </div>
                )}

                {/* List of resources or empty state */}
                {resources.length === 0 ? (
                    <p className="text-center text-gray-500 mt-6">Add or Drag and Drop Resources to upload them</p>
                ) : (
                    <div className="flex-col w-full">
                        {resources.map((resource) => (
                            resource.type === 'File' ? (
                                <FileResourceComponent
                                    key={resource._id}
                                    file={resource.file!}
                                    onDelete={() => handleDeleteResource(resource._id)}
                                />
                            ) : (
                                <LinkTextResourceComponent
                                    key={resource._id}
                                    title={resource.linkTextData!.title}
                                    url={resource.linkTextData!.url}
                                    text={resource.linkTextData!.text}
                                    onDelete={() => handleDeleteResource(resource._id)}
                                    onChange={(field, value) => handleResourceChange(resource._id, field, value)}
                                />
                            )
                        ))}
                    </div>
                )}

                {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
        </ModalWrapper>
    );
};

export default CreateResourceModal;