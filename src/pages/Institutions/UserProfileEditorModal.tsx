import React, { useRef } from 'react';
import ModalWrapper from '../ModalWrapper';
import Container from "../../components/ui/containers/Container.tsx";
import SectionTitle from "../../components/ui/text/SectionTitle.tsx";
import { FaCamera, FaSpinner } from 'react-icons/fa';
import { useCachedImage } from '../../hooks/newHooks/Resources/useCachedImage.ts';
import { useAuth } from "../../context/AuthContext.tsx";
import Editable from "../../components/ui/text/Editable.tsx";

const DEFAULT_PROFILE_IMAGE = 'https://via.placeholder.com/150';

interface UserProfileEditorModalProps {
    onClose: () => void;
    userId: string;
}

const UserProfileEditorModal: React.FC<UserProfileEditorModalProps> = ({ onClose, userId }) => {
    const { userData } = useAuth();
    const profileInputRef = useRef<HTMLInputElement>(null);

    const { imageUrl: profileImage, isUploading, uploadImage: uploadProfileImage } = useCachedImage({
        path: `users/${userId}/profileImage`,
        defaultImage: DEFAULT_PROFILE_IMAGE,
    });

    const handleProfileImageUpload = () => {
        if (profileInputRef.current?.files && profileInputRef.current.files[0]) {
            uploadProfileImage(profileInputRef.current.files[0]);
            profileInputRef.current.value = '';
        }
    };

    return (
        <ModalWrapper onClose={onClose}>
            <Container className={"w-full"}>
                <SectionTitle title={"Edit Profile"} className="text-center pb-4"/>

                <div className="relative w-48 h-48 mx-auto mb-4">
                    <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover shadow-md"
                    />
                    {isUploading && (
                        <div
                            className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-full">
                            <FaSpinner className="text-white text-2xl animate-spin"/>
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
                        className="absolute bottom-1 right-1 p-1 bg-gray-700 text-white rounded-full transition-opacity"
                        onClick={() => profileInputRef.current?.click()}
                    >
                        <FaCamera/>
                    </button>
                </div>

                <span className={`text-gray-500 dark:text-gray-500 text-xs`}>Name</span>
                <Editable
                    initialValue={userData?.name || ''}
                    collection="auth/userInfo"
                    documentId={userId}
                    field="name"
                    placeholder="User name"
                    className="text-lg font-medium text-gray-800 dark:text-white mb-4"
                />

                <span className={`text-gray-500 dark:text-gray-500 text-xs`}>Nickname</span>
                <Editable
                    initialValue={userData?.nickname || ''}
                    collection="auth/userInfo"
                    documentId={userId}
                    field="nickname"
                    placeholder="Nickname"
                    className="font-medium text-gray-800 dark:text-white"
                    canBeNull={true}
                />
                <span className={`text-gray-500 dark:text-gray-500 text-xs`}>Write it in Japanese so other users know how to call you!</span>

            </Container>
        </ModalWrapper>
    );
};

export default UserProfileEditorModal;