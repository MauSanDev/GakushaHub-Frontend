import React, { useState, useRef } from 'react';
import ModalWrapper from '../ModalWrapper';
import SectionTitle from "../../components/ui/text/SectionTitle";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import { FaPlus, FaFileImport, FaLink } from 'react-icons/fa';
import FileResourceComponent from './Components/FileResourceComponent';
import LinkTextResourceComponent from './Components/LinkTextResourceComponent';

export interface NewResourceData {
    _id: string;
    file?: File;
}

interface CreateResourceModalProps {
    onClose: () => void;
}

const CreateResourceModal: React.FC<CreateResourceModalProps> = ({ onClose }) => {
    const [resources, setResources] = useState<NewResourceData[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const MAX_FILE_SIZE = 1.5 * 1024 * 1024 * 1024;

    const PROHIBITED_EXTENSIONS = [
        'exe', 'bat', 'com', 'cmd', 'msi', 'jar', 'bin', 'apk', 'aab', 'dmg', 'app', 'run', 'iso', 'deb', 'rpm', 'sh',
        'js', 'py', 'rb', 'pl', 'php', 'vbs', 'wsf', 'html', 'css', 'ts',
        'ipa', 'img', 'cue', 'toast'
    ];

    const isFileExtensionAllowed = (file: File) => {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        return fileExtension && !PROHIBITED_EXTENSIONS.includes(fileExtension);
    };

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            const newResources = filesArray.map(file => {
                if (!isFileExtensionAllowed(file)) {
                    setError(`File type not supported: ${file.name}`);
                    return null;
                }
                if (file.size > MAX_FILE_SIZE) {
                    setError(`File is too large: ${file.name}`);
                    return null;
                }

                return {
                    _id: file.name,
                    title: file.name,
                    description: '',
                    type: 'File',
                    readyForSave: false,
                    file
                };
            }).filter(Boolean) as NewResourceData[];

            setResources(prev => [...prev, ...newResources]);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleAddLinkOrText = () => {
        const newResource: NewResourceData = {
            _id: Math.random().toString(),
        };
        setResources(prev => [...prev, newResource]);
    };

    const handleDeleteResource = (id: string) => {
        setResources(prev => prev.filter(resource => resource._id !== id));
    };


    return (
        <ModalWrapper onClose={onClose}>
            <div className={`w-full flex-col relative min-h-[300px] flex items-center justify-center rounded-lg p-4 ${isDragging ? 'border-dashed border-2 border-green-500' : ''}`}
                 onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                 onDragLeave={() => setIsDragging(false)}
                 onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileImport(e as any); }}>

                <SectionTitle title="Add New Resources" className="text-center pb-4" />

                <div className="flex justify-between items-center mb-4 w-full">
                    <div className="relative">
                        <PrimaryButton label="Add Resource" iconComponent={<FaPlus />} className="mr-2" onClick={() => setShowDropdown(!showDropdown)} />
                        {showDropdown && (
                            <div className="flex flex-col items-start justify-center text-wrap text-xs absolute bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded shadow-lg p-2 z-10">
                                <button className="w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => { setShowDropdown(false); fileInputRef.current?.click(); }}>
                                    <FaFileImport className="mr-2" /> <span>Import Files</span>
                                </button>
                                <button className="w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => { setShowDropdown(false); handleAddLinkOrText(); }}>
                                    <FaLink className="mr-2" /> <span>Link or Text</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <input id="fileInput" ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileImport} />
                </div>

                {isDragging && (
                    <div className="absolute top-0 left-0 w-full h-full bg-white dark:bg-black bg-opacity-50 flex items-center justify-center z-20">
                        <p className="text-green-500 font-semibold text-lg">Drag items here to import</p>
                    </div>
                )}

                {resources.length === 0 ? (
                    <p className="text-center text-gray-500 mt-6">Add or Drag and Drop Resources to upload them</p>
                ) : (
                    <div className="flex-col w-full">
                        {resources.map(resource => (
                            resource.file ? (
                                <FileResourceComponent key={resource._id} file={resource.file} instanceId={resource._id} onDelete={() => handleDeleteResource(resource._id)} />
                            ) : (
                                <LinkTextResourceComponent key={resource._id} instanceId={resource._id} onDelete={() => handleDeleteResource(resource._id)} />
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