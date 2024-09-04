import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {useAuth} from "../../context/AuthContext.tsx";

const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();


    const menuItems = [
        { label: 'Search', path: '/search'},
        // { label: 'Kanji', path: '/kanji' },
        // { label: 'Words', path: '/words' },
        { label: 'Grammar', path: '/grammar' },
        { label: 'Generations', path: '/generations' },
        { label: 'Courses', path: '/courses', requiresAuth: true },
        { label: 'Generate', path: '/generate', requiresAuth: true },
    ];

    return (
        <>

            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-500 dark:bg-gray-700 text-white rounded"
                onClick={() => setIsOpen(!isOpen)}
            >
                ☰
            </button>

            <div
                className={`fixed lg:left-0 lg:top-1/2 lg:transform lg:-translate-y-1/2 lg:w-64 lg:h-auto w-full h-full top-0 left-0 z-40 transition-transform ${
                    isOpen ? 'translate-x-0 bg-white dark:bg-black ' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="flex flex-col p-4 space-y-4">
                    {menuItems.map((item, index) =>
                        (!item.requiresAuth || user) && (
                            <Link
                            key={index}
                            to={item.path}
                            className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-blue-400 dark:text-white py-2 border-b border-gray-300 dark:border-gray-700 text-left"
                            onClick={() => setIsOpen(false)} // Cierra el menú en modo responsive
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </>
    );
};

export default Sidebar;