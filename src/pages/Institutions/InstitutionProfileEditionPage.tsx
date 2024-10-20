import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {FaCamera, FaPlus, FaTimes, FaUpload} from 'react-icons/fa';
import SectionContainer from "../../components/ui/containers/SectionContainer.tsx";
import Editable from "../../components/ui/text/Editable.tsx";
import LinkInput from '../../components/ui/text/LinkInput.tsx'; // Nuevo componente importado
import { useInstitutionById } from "../../hooks/institutionHooks/useInstitutionById.ts";

const EditProfilePage: React.FC = () => {
    const { institutionId } = useParams<{ institutionId: string }>();
    const { data, isLoading, fetchInstitution } = useInstitutionById(institutionId || "");

    const [profileImage, setProfileImage] = useState<string>('https://via.placeholder.com/150');
    const [bannerImage, setBannerImage] = useState<string>('https://via.placeholder.com/600x200');
    const [links, setLinks] = useState<string[]>(['']);

    const profileInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchInstitution();
    }, [fetchInstitution]);

    const handleProfileImageUpload = () => {
        if (profileInputRef.current?.files && profileInputRef.current.files[0]) {
            const file = profileInputRef.current.files[0];
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }
    };

    const handleBannerImageUpload = () => {
        if (bannerInputRef.current?.files && bannerInputRef.current.files[0]) {
            const file = bannerInputRef.current.files[0];
            const imageUrl = URL.createObjectURL(file);
            setBannerImage(imageUrl);
        }
    };

    const handleAddLink = () => {
        setLinks([...links, '']);
    };

    const handleLinkChange = (index: number, value: string) => {
        const updatedLinks = [...links];
        updatedLinks[index] = value;
        setLinks(updatedLinks);
    };

    const handleRemoveLink = (index: number) => {
        const updatedLinks = links.filter((_, i) => i !== index);
        setLinks(updatedLinks);
    };

    // Ordenar los enlaces (primero enlaces, luego emails, teléfonos y direcciones)
    const sortLinks = (links: string[]) => {
        const urlLinks = links.filter(link => link.includes('.') && !link.includes('@') && !link.match(/^\+?[0-9\s\-()]+$/));
        const emailLinks = links.filter(link => link.includes('@'));
        const phoneLinks = links.filter(link => link.match(/^\+?[0-9\s\-()]+$/));
        const addressLinks = links.filter(link => !urlLinks.includes(link) && !emailLinks.includes(link) && !phoneLinks.includes(link));

        return [...urlLinks, ...emailLinks, ...phoneLinks, ...addressLinks];
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <SectionContainer title={"学校のプロファイル"}>
            {/* Banner */}
            <div className="relative w-full h-48 bg-gray-300 rounded-md mb-8 group">
                <img
                    src={bannerImage}
                    alt="Banner"
                    className="object-cover w-full h-full rounded-md"
                />
                <input
                    type="file"
                    ref={bannerInputRef}
                    onChange={handleBannerImageUpload}
                    className="hidden"
                    accept="image/*"
                />
                <button
                    className="absolute bottom-2 right-2 p-1 bg-gray-700 text-white rounded-full transition-opacity"
                    onClick={() => bannerInputRef.current?.click()}
                >
                    <FaCamera />
                </button>
                <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-md group-hover:opacity-100 opacity-0 transition-opacity cursor-pointer" onClick={() => bannerInputRef.current?.click()}>
                    <FaUpload className="text-white text-2xl" />
                </div>
            </div>

            {/* Profile Picture */}
            <div className="relative -mt-20 mb-8 group">
                <img
                    src={profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover shadow-lg border-4 dark:border-black border-white mx-auto"
                />
                <input
                    type="file"
                    ref={profileInputRef}
                    onChange={handleProfileImageUpload}
                    className="hidden"
                    accept="image/*"
                />
                <button
                    className="absolute bottom-0 right-0 p-1 bg-gray-700 text-white rounded-full transition-opacity"
                    onClick={() => profileInputRef.current?.click()}
                >
                    <FaCamera />
                </button>
                <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-full group-hover:opacity-100 opacity-0 transition-opacity cursor-pointer" onClick={() => profileInputRef.current?.click()}>
                    <FaUpload className="text-white text-2xl" />
                </div>
            </div>

            <Editable
                initialValue={data?.name ||''}
                collection="institution"
                documentId={institutionId || ''}
                field="name"
                className="text-left text-white text-3xl font-bold"
                placeholder="Enter School Name"
                canEdit={true}
                maxChar={400}
            />

            <div className="flex flex-col lg:flex-row justify-between w-full max-w-4xl mx-auto mt-6">

                {/* Left Column: Description */}
                <div className="flex-1 text-gray-800 dark:text-white px-10 pb-24">
                    <Editable
                        initialValue={data?.description ||''}
                        collection="institution"
                        documentId={institutionId || ''}
                        field="description"
                        className="text-left mt-2 text-gray-400 w-full"
                        placeholder="Enter a description"
                        canEdit={true}
                        maxChar={400}
                    />
                </div>

                {/* Right Column: Links */}
                <div className="flex-1 ml-8">
                    <h3 className="text-lg font-bold mb-4 text-white">Social Links</h3>
                    {sortLinks(links).map((link, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <LinkInput
                                initialValue={link}
                                canEdit={true}
                                placeholder="Add a link..."
                                onSave={(value) => handleLinkChange(index, value)}
                                className={"text-gray-300 text-sm"}
                            />
                            <button
                                onClick={() => handleRemoveLink(index)}
                                className="text-red-500 hover:text-red-700 ml-2"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={handleAddLink}
                        className="mt-2 flex items-center text-blue-500 hover:text-blue-700"
                    >
                        <FaPlus className="mr-1" /> Add Link
                    </button>
                </div>
            </div>
        </SectionContainer>
    );
};

export default EditProfilePage;