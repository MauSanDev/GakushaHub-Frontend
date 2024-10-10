import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useInstitutionById } from '../../hooks/institutionHooks/useInstitutionById.ts';
import SectionContainer from "../../components/ui/containers/SectionContainer.tsx";

const EditProfilePage: React.FC = () => {
    const { institutionId } = useParams<{ institutionId: string }>();
    const { data, error, isLoading } = useInstitutionById(institutionId || "");

    const [profileImage, setProfileImage] = useState<string>('https://via.placeholder.com/150');
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (data && data.name && data.description) {
            setName(data.name);
            setDescription(data.description || '');
        }
    }, [data]);

    const handleImageUpload = () => {
        if (fileInputRef.current?.files && fileInputRef.current.files[0]) {
            const file = fileInputRef.current.files[0];
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }
    };

    const handleSaveChanges = () => {
        console.log('Nombre:', name);
        console.log('Descripción:', description);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading institution data.</div>;
    }

    return (
        <SectionContainer title={"学校のプロファイル"} >
            <div className="mb-6 flex flex-col items-center">
                <img
                    src={profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover mb-4 shadow-md"
                />
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-full hover:bg-blue-300 hover:text-white transition-all"
                >
                    Change Profile Picture
                </button>
            </div>

            <div className="mb-4 w-full max-w-md">
                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="name">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
                />
            </div>

            <div className="mb-6 w-full max-w-md">
                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="description">
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
                    rows={4}
                />
            </div>

            <button
                onClick={handleSaveChanges}
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all"
            >
                Save Changes
            </button>
        </SectionContainer>
    );
};

export default EditProfilePage;