import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext.tsx";
import UserMenu from '../UserMenu';
import LocSpan from "../LocSpan.tsx";

const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    const menuItems = [
        { label: 'search', path: '/search' },
        { label: 'grammar', path: '/grammar' },
        { label: 'texts', path: '/generations'},
        { label: 'courses', path: '/courses', requiresAuth: true },
        { label: 'studyGroups', path: '/groups', requiresAuth: true},
        { label: 'institutions', path: '/institutions' },
    ];

    return (
        <>
            <button
                className="lg:hidden fixed top-1 left-1 z-50 p-2 bg-white dark:bg-black dark:text-white rounded text-3xl"
                onClick={() => setIsOpen(!isOpen)}
            >
                ☰
            </button>

            <div
                className={`pt-24 fixed lg:left-0 lg:top-1/2 lg:transform lg:-translate-y-1/2 lg:w-32 hover:lg:w-64 lg:h-auto w-full h-full top-0 left-0 z-40 transition-all ${
                    isOpen ? 'translate-x-0 bg-white dark:bg-black ' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="flex flex-col p-4 space-y-4">

                    <div className="lg:hidden pl-2 ">
                        <UserMenu/>
                    </div>
                    
                    {menuItems.map((item, index) =>

                            (!item.requiresAuth || isAuthenticated) && (
                                <Link
                                    key={index}
                                    to={item.path}
                                    className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-blue-400 hover:dark:text-white py-2 border-b border-gray-300 dark:border-gray-700 text-left hover:pl-2 transition-all"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <LocSpan textKey={item.label}/>
                                </Link>
                            )
                    )}


                </div>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black dark:bg-black z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            <div className="hidden lg:block">
                <UserMenu />
            </div>
        </>
    );
};

export default Sidebar;