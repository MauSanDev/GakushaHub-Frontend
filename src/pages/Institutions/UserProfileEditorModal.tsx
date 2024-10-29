import React, { useRef } from 'react';
import ModalWrapper from '../ModalWrapper';
import Container from "../../components/ui/containers/Container.tsx";
import { FaCamera, FaSpinner } from 'react-icons/fa';
import { useCachedImage } from '../../hooks/newHooks/Resources/useCachedImage.ts';
import { useAuth } from "../../context/AuthContext.tsx";
import Editable from "../../components/ui/text/Editable.tsx";
import LocSpan from "../../components/LocSpan.tsx";
import ModalTitle from "../../components/ui/text/ModalTitle.tsx";

interface UserProfileEditorModalProps {
    onClose: () => void;
    userId: string;
}

const UserProfileEditorModal: React.FC<UserProfileEditorModalProps> = ({ onClose, userId }) => {
    const { userData } = useAuth();
    const profileInputRef = useRef<HTMLInputElement>(null);

    const { imageUrl: profileImage, isUploading, uploadImage: uploadProfileImage } = useCachedImage({
        path: `users/${userId}/profileImage`,});

    const handleProfileImageUpload = () => {
        if (profileInputRef.current?.files && profileInputRef.current.files[0]) {
            uploadProfileImage(profileInputRef.current.files[0]);
            profileInputRef.current.value = '';
        }
    };

    return (
        <ModalWrapper onClose={onClose}>
            <Container className={"w-full"}>
                <ModalTitle title={"profileKeys.editProfile"} className="text-center pb-4"/>

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

                <LocSpan textKey={"profileKeys.name"} className={`text-gray-500 dark:text-gray-500 text-xs`} />
                <Editable
                    initialValue={userData?.name || ''}
                    collection="auth/userInfo"
                    documentId={userId}
                    field="name"
                    placeholder="profileKeys.name"
                    className="text-lg font-medium text-gray-800 dark:text-white mb-4"
                />

                <LocSpan textKey={"profileKeys.nickname"} className={`text-gray-500 dark:text-gray-500 text-xs`} />
                <Editable
                    initialValue={userData?.nickname || ''}
                    collection="auth/userInfo"
                    documentId={userId}
                    field="nickname"
                    placeholder="profileKeys.nickname"
                    className="font-medium text-gray-800 dark:text-white"
                    canBeNull={true}
                />
                <LocSpan textKey={"profileKeys.nicknameFooter"} className={`text-gray-500 dark:text-gray-500 text-xs`} />

            </Container>
        </ModalWrapper>
    );
};

export default UserProfileEditorModal;