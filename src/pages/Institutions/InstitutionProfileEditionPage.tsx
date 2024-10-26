import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FaCamera, FaPlus, FaTimes, FaUpload, FaSpinner } from 'react-icons/fa';
import SectionContainer from "../../components/ui/containers/SectionContainer.tsx";
import Editable from "../../components/ui/text/Editable.tsx";
import LinkInput from '../../components/ui/text/LinkInput.tsx';
import { useInstitutionById } from "../../hooks/institutionHooks/useInstitutionById.ts";
import { useCachedImage } from "../../hooks/newHooks/Resources/useCachedImage.ts";
import { useUpdateData } from "../../hooks/updateHooks/useUpdateData.ts";

const DEFAULT_PROFILE_IMAGE = 'https://via.placeholder.com/150';
const DEFAULT_BANNER_IMAGE = 'https://via.placeholder.com/600x200';

const EditProfilePage: React.FC = () => {
    const { institutionId } = useParams<{ institutionId: string }>();
    const { data, isLoading, fetchInstitution } = useInstitutionById(institutionId || "");

    const [links, setLinks] = useState<string[]>([]);
    const profileInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    const { imageUrl: profileImage, isUploading: isProfileUploading, uploadImage: uploadProfileImage } = useCachedImage({
        path: `institutions/${institutionId}/profileImage`,
        defaultImage: DEFAULT_PROFILE_IMAGE,
    });

    const { imageUrl: bannerImage, isUploading: isBannerUploading, uploadImage: uploadBannerImage } = useCachedImage({
        path: `institutions/${institutionId}/bannerImage`,
        defaultImage: DEFAULT_BANNER_IMAGE,
    });

    const { mutate: updateLinks } = useUpdateData<{ links: string[] }>();

    useEffect(() => {
        fetchInstitution();
    }, [fetchInstitution]);

    useEffect(() => {
        if (data?.links) {
            setLinks([...data.links]);
        }
    }, [data?.links]);

    const handleProfileImageUpload = () => {
        if (profileInputRef.current?.files && profileInputRef.current.files[0]) {
            uploadProfileImage(profileInputRef.current.files[0]);
            profileInputRef.current.value = '';
        }
    };

    const handleBannerImageUpload = () => {
        if (bannerInputRef.current?.files && bannerInputRef.current.files[0]) {
            uploadBannerImage(bannerInputRef.current.files[0]);
            bannerInputRef.current.value = '';
        }
    };

    const handleAddLink = () => {
        const updatedLinks = [...links, ''];
        setLinksAndSync(updatedLinks);
    };

    const handleLinkChange = (index: number, value: string) => {
        const updatedLinks = [...links];
        updatedLinks[index] = value;
        setLinksAndSync(updatedLinks);
    };

    const handleRemoveLink = (index: number) => {
        const updatedLinks = links.slice(0, index).concat(links.slice(index + 1));
        setLinksAndSync(updatedLinks);
    };

    const setLinksAndSync = (updatedLinks: string[]) => {
        const filteredLinks = updatedLinks.filter(link => link.trim() !== '');

        const urlLinks = filteredLinks.filter(link => link.includes('.') && !link.includes('@') && !link.match(/^\+?[0-9\s\-()]+$/));
        const emailLinks = filteredLinks.filter(link => link.includes('@'));
        const phoneLinks = filteredLinks.filter(link => link.match(/^\+?[0-9\s\-()]+$/));
        const addressLinks = filteredLinks.filter(link => !urlLinks.includes(link) && !emailLinks.includes(link) && !phoneLinks.includes(link));

        const orderedLinks = [...urlLinks, ...emailLinks, ...phoneLinks, ...addressLinks];
        setLinks(orderedLinks);

        updateLinks({
            collection: 'institution',
            documentId: institutionId || '',
            newData: { links: filteredLinks }
        });
    };

    return (
        <SectionContainer title={"学校のプロファイル"} isLoading={isLoading}>
            {/* Banner */}
            <div className="relative w-full h-48 bg-gray-300 rounded-md mb-8 group">
                <img
                    src={bannerImage}
                    alt="Banner"
                    className="object-cover w-full h-full rounded-md"
                />
                {isBannerUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-md">
                        <FaSpinner className="text-white text-3xl animate-spin" />
                    </div>
                )}
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
                {isProfileUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-full">
                        <FaSpinner className="text-white text-3xl animate-spin" />
                    </div>
                )}
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
                initialValue={data?.name || 'Institution Name'}
                collection="institution"
                documentId={institutionId || ''}
                field="name"
                className="text-left text-white text-3xl font-bold"
                placeholder="Enter School Name"
                canEdit={true}
                maxChar={400}
            />

            <div className="flex flex-col lg:flex-row justify-between w-full max-w-4xl mx-auto mt-6">
                <div className="flex-1 text-gray-800 dark:text-white px-10 pb-24">
                    <Editable
                        initialValue={data?.description || 'Add a description'}
                        collection="institution"
                        documentId={institutionId || ''}
                        field="description"
                        className="text-left mt-2 text-gray-400 w-full"
                        placeholder="Enter a description"
                        canEdit={true}
                        maxChar={400}
                    />
                </div>

                <div className="flex-1 ml-8">
                    <h3 className="text-lg font-bold mb-4 text-white">Social Links</h3>
                    {links.map((link, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <LinkInput
                                initialValue={link}
                                canEdit={true}
                                placeholder="Add a link..."
                                onSave={(value) => handleLinkChange(index, value)}
                                className="text-gray-300 text-sm"
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