import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useInstitutionById } from '../../hooks/institutionHooks/useInstitutionById.ts';
import SectionContainer from "../../components/ui/containers/SectionContainer.tsx";
import SecondaryButton from "../../components/ui/buttons/SecondaryButton.tsx";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton.tsx";
import { FaCamera, FaCheck, FaSpinner } from "react-icons/fa";
import { useUpdateDocument } from '../../hooks/updateHooks/useUpdateDocument';

const EditProfilePage: React.FC = () => {
    const { institutionId } = useParams<{ institutionId: string }>();
    const { data, error, isLoading } = useInstitutionById(institutionId || "");

    const [profileImage, setProfileImage] = useState<string>('https://via.placeholder.com/150');
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const [isSaving, setIsSaving] = useState(false); 
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: updateInstitution } = useUpdateDocument<Partial<{ name: string; description: string }>>(); 

    const initialData = useRef({ name: '', description: '' }); 

    useEffect(() => {
        if (data && data.name && data.description) {
            setName(data.name);
            setDescription(data.description || '');
            initialData.current = { name: data.name, description: data.description || '' }; 
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
        
        const updatedData: Partial<{ name: string; description: string }> = {};

        if (name !== initialData.current.name) {
            updatedData.name = name;
        }

        if (description !== initialData.current.description) {
            updatedData.description = description;
        }
        
        if (Object.keys(updatedData).length === 0) {
            return;
        }
        
        setIsSaving(true);

        updateInstitution({
            collection: 'institution',
            documentId: institutionId || '',
            updateData: updatedData
        }, {
            onSuccess: () => {
                setIsSaving(false); 
            },
            onError: (error) => {
                console.error("Error updating institution:", error);
                setIsSaving(false); 
            }
        });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading institution data.</div>;
    }

    return (
        <SectionContainer title={"学校のプロファイル"}>
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

                <SecondaryButton label={"changeProfilePicture"} iconComponent={<FaCamera />} onClick={() => fileInputRef.current?.click()} />
            </div>

            <div className="mb-4 w-full max-w-md">
                <label className="block text-gray-700 dark:text-gray-300 mb-2 text-xs" htmlFor="name">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="transparent-input-field font-bold"
                />
            </div>

            <div className="mb-6 w-full max-w-md">
                <label className="block text-gray-700 dark:text-gray-300 mb-2 text-xs" htmlFor="description">
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field"
                    rows={4}
                />
            </div>

            <PrimaryButton
                onClick={handleSaveChanges}
                label={isSaving ? "" : "saveChanges"} 
                iconComponent={isSaving ? <FaSpinner className="animate-spin" /> : <FaCheck />} 
                className={"w-40"}
                disabled={isSaving} 
            />
        </SectionContainer>
    );
};

export default EditProfilePage;