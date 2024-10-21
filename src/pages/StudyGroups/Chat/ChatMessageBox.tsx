import React, { useEffect, useState, useRef } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { useAuth } from "../../../context/AuthContext.tsx";
import { useUserInfo } from "../../../hooks/newHooks/Courses/useUserInfo.ts";
import { MembershipRole } from "../../../data/MembershipData.ts";

interface ChatMessageBoxProps {
    userId: string;
    avatarUrl: string;
    message: string;
    timestamp: string;
    viewerRole: MembershipRole;
}

const ChatMessageBox: React.FC<ChatMessageBoxProps> = ({ userId, avatarUrl, message, timestamp, viewerRole }) => {
    const { userData } = useAuth();
    const { fetchUserInfo, data: userInfo } = useUserInfo([userId]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null); // Referencia para el dropdown

    useEffect(() => {
        fetchUserInfo();
    }, [userId]);

    const isFromUser = userId === userData?._id;

    // Determinar si mostrar el dropdown
    const canEditOrDelete = viewerRole !== MembershipRole.None && viewerRole !== MembershipRole.Student;

    // Cierra el dropdown si se hace clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        // Agrega el evento
        document.addEventListener('mousedown', handleClickOutside);

        // Elimina el evento al desmontar
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <div className={`flex justify-start ${isFromUser ? `justify-end` : ``}`}>
            <div className={`flex items-start gap-1 ${isFromUser ? `flex-row-reverse` : ``}`}>
                <img
                    src={avatarUrl}
                    alt="avatar"
                    className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-800"
                />
                <div className={`px-3 py-2 rounded-lg relative ${isFromUser ? `dark:bg-blue-700 dark:bg-opacity-40 text-right bg-blue-500` : `dark:bg-gray-800 dark:text-gray-300 bg-gray-100 text-gray-500`}`}>
                    <div className={`flex gap-2 items-center ${isFromUser ? `flex-row-reverse` : ``}`}>
                        <span className="font-bold text-sm">{isFromUser ? userData?.name : userInfo?.[userId].name}</span>
                        <span className="text-xs text-gray-400 mt-1">
                            {new Date(timestamp).getHours().toString().padStart(2, '0')}:
                            {new Date(timestamp).getMinutes().toString().padStart(2, '0')}
                        </span>

                        {/* Botón de 3 puntos al costado de la fecha */}
                        {canEditOrDelete && (
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                            >
                                ⋮
                            </button>
                        )}
                    </div>

                    <div className="text-sm">{message}</div>

                    {/* Dropdown de acciones si el rol es permitido */}
                    {canEditOrDelete && showDropdown && (
                        <div
                            ref={dropdownRef} // Asignamos la referencia al dropdown
                            className={`absolute top-0 mt-2 bg-white border rounded shadow-md dark:bg-gray-700 dark:border-gray-600 text-xs ${
                                isFromUser ? '-left-10' : '-right-10'
                            }`} // Dependiendo si es user o guest el menú se abre a la derecha o izquierda
                        >
                            <button
                                className="flex items-center w-full px-2 py-1 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                                onClick={() => console.log('Edit message')}
                            >
                                <FaEdit />
                            </button>
                            <button
                                className="flex items-center w-full px-2 py-1 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                                onClick={() => console.log('Delete message')}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatMessageBox;