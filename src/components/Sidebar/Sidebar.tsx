import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext.tsx";
import UserMenu from '../UserMenu'; // Importa el UserMenu

const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    const menuItems = [
        { label: 'Search', path: '/search' },
        { label: 'Grammar', path: '/grammar' },
        { label: 'Courses', path: '/courses', requiresAuth: true },
        { label: 'Texts', path: '/generations' },
        { label: 'Generate', path: '/generate', requiresAuth: true },
    ];

    return (
        <>
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-black dark:text-white rounded text-3xl"
                onClick={() => setIsOpen(!isOpen)}
            >
                ☰
            </button>

            {/* Sidebar */}
            <div
                className={`pt-24 fixed lg:left-0 lg:top-1/2 lg:transform lg:-translate-y-1/2 lg:w-32 hover:lg:w-64 lg:h-auto w-full h-full top-0 left-0 z-40 transition-all ${
                    isOpen ? 'translate-x-0 bg-white dark:bg-black ' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="flex flex-col p-4 space-y-4">

                    {menuItems.map((item, index) =>
                            (!item.requiresAuth || isAuthenticated) && (
                                <Link
                                    key={index}
                                    to={item.path}
                                    className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-blue-400 hover:dark:text-white py-2 border-b border-gray-300 dark:border-gray-700 text-left hover:pl-2 transition-all"
                                    onClick={() => setIsOpen(false)} // Cierra el menú en responsive
                                >
                                    {item.label}
                                </Link>
                            )
                    )}

                    {/* Mostrar UserMenu en responsive dentro del Sidebar */}
                    <div className="lg:hidden">
                        <UserMenu />
                    </div>

                </div>
            </div>

            {/* Overlay para cerrar el sidebar */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            {/* Mostrar UserMenu en pantallas grandes fuera del Sidebar */}
            <div className="hidden lg:block">
                <UserMenu />
            </div>
        </>
    );
};

export default Sidebar;