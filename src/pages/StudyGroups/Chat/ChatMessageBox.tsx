import React, { useEffect, useState, useRef } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useAuth } from "../../../context/AuthContext.tsx";
import { useUserInfo } from "../../../hooks/newHooks/Courses/useUserInfo.ts";
import { MembershipRole } from "../../../data/MembershipData.ts";
import { useUpdateData } from "../../../hooks/updateHooks/useUpdateData.ts";
import { CollectionTypes } from "../../../data/CollectionTypes.tsx";
import { ChatMessageData } from "../../../data/ChatMessageData.ts";
import { useCachedImage } from '../../../hooks/newHooks/Resources/useCachedImage.ts';

const DEFAULT_PROFILE_IMAGE = 'https://via.placeholder.com/150';

interface ChatMessageBoxProps {
    messageData: ChatMessageData;
    viewerRole: MembershipRole;
}

const ChatMessageBox: React.FC<ChatMessageBoxProps> = ({ messageData, viewerRole }) => {
    const { userData } = useAuth();
    const { fetchUserInfo, data: userInfo } = useUserInfo([messageData.userId]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedMessage, setEditedMessage] = useState(messageData.message);
    const [localMessageData, setLocalMessageData] = useState<ChatMessageData>(messageData);
    const messageInputRef = useRef<HTMLTextAreaElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { mutate: updateMessage } = useUpdateData();

    // Hook de imagen de perfil para el usuario del mensaje
    const { imageUrl: userImage } = useCachedImage({
        path: `users/${messageData.userId}/profileImage`,
        defaultImage: DEFAULT_PROFILE_IMAGE,
    });

    useEffect(() => {
        if (messageData.userId === userData?._id) {
            return;
        }
        fetchUserInfo();
    }, [messageData]);

    const isFromUser = messageData.userId === userData?._id;
    const canEditOrDelete = viewerRole !== MembershipRole.None && viewerRole !== MembershipRole.Student;

    const saveMessage = () => {
        if (editedMessage.trim() !== messageData.message.trim()) {
            updateMessage({
                collection: CollectionTypes.Chat,
                documentId: messageData._id,
                newData: { message: editedMessage, status: 'edited' },
            }, {
                onSuccess: () => {
                    setLocalMessageData((prevData) => ({
                        ...prevData,
                        message: editedMessage,
                        status: 'edited',
                    }));
                    setIsEditing(false);
                },
            });
        } else {
            setIsEditing(false);
        }
    };

    const handleDeleteMessage = () => {
        const confirmed = window.confirm("Are you sure you want to delete this message?");
        if (confirmed) {
            updateMessage({
                collection: CollectionTypes.Chat,
                documentId: messageData._id,
                newData: { status: 'deleted' },
            }, {
                onSuccess: () => {
                    setLocalMessageData((prevData) => ({
                        ...prevData,
                        message: "This message was deleted",
                        status: 'deleted',
                    }));
                    setShowDropdown(false);
                },
            });
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isEditing && messageInputRef.current && !messageInputRef.current.contains(event.target as Node)) {
                saveMessage();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isEditing, editedMessage]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveMessage();
        }
    };

    const message = localMessageData.status === 'edited' ? "(Edited)" : localMessageData.status === 'deleted' ? "This message was deleted" : '';

    return (
        <div className={`flex ${isFromUser ? 'justify-end' : 'justify-start'} items-start gap-2`}>
            {!isFromUser && (
                <img
                    src={userImage}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-800 object-cover"
                />
            )}

            <div className={`px-3 py-2 rounded-lg relative ${isFromUser ? `dark:bg-blue-700 dark:bg-opacity-40 text-right bg-blue-500` : `dark:bg-gray-800 dark:text-gray-300 bg-gray-100 text-gray-500`}`}>
                <div className={`flex gap-2 items-center ${isFromUser ? `flex-row-reverse` : ``}`}>
                    <span className="font-bold text-sm">{isFromUser ? userData?.name : userInfo?.[messageData.userId]?.name}</span>
                    <span className="text-xs text-gray-400 mt-1">
                        {new Date(localMessageData.timestamp).getHours().toString().padStart(2, '0')}:
                        {new Date(localMessageData.timestamp).getMinutes().toString().padStart(2, '0')}
                    </span>

                    {canEditOrDelete && localMessageData.status !== 'deleted' && (
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                        >
                            ⋮
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <textarea
                        ref={messageInputRef}
                        value={editedMessage}
                        onChange={(e) => setEditedMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full px-0 py-1 text-sm border-0 focus:outline-none focus:ring-0 dark:bg-transparent bg-transparent dark:text-gray-300"
                        rows={1}
                        style={{ resize: 'none' }}
                    />
                ) : (
                    <div className="text-sm">
                        <span>{messageData.status !== 'deleted' ? localMessageData.message : ''}</span> <span className="text-xs italic">{message}</span>
                    </div>
                )}

                {canEditOrDelete && showDropdown && (
                    <div
                        ref={dropdownRef}
                        className={`absolute top-0 mt-2 bg-white border rounded shadow-md dark:bg-gray-700 dark:border-gray-600 text-xs ${
                            isFromUser ? '-left-10' : '-right-10'
                        }`}
                    >
                        <button
                            className="flex items-center w-full px-2 py-1 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                            onClick={() => {
                                setIsEditing(true);
                                setShowDropdown(false);
                                setTimeout(() => messageInputRef.current?.focus(), 0);
                            }}
                        >
                            <FaEdit />
                        </button>
                        <button
                            className="flex items-center w-full px-2 py-1 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                            onClick={handleDeleteMessage}
                        >
                            <FaTrash />
                        </button>
                    </div>
                )}
            </div>

            {isFromUser && (
                <img
                    src={userImage}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-800 object-cover"
                />
            )}
        </div>
    );
};

export default ChatMessageBox;