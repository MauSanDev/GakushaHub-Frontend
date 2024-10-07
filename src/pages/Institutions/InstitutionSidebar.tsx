import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext.tsx";
import UserMenu from '../../components/UserMenu';
import LocSpan from "../../components/LocSpan.tsx";

const InstitutionSidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    const menuItems = [
        { label: 'profile', path: '/institution/editProfile' },
        { label: 'studyGroups', path: '/institution/studyGroups' },
        { label: 'members', path: '/institution/members' },
        { label: 'courses', path: '/institution/courses' },
        { label: 'resources', path: '/institution/resources' },
    ];

    return (
        <>
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-black dark:text-white rounded text-3xl"
                onClick={() => setIsOpen(!isOpen)}
            >
                ☰
            </button>

            <div
                className={`pt-24 fixed lg:left-0 lg:top-1/2 lg:transform lg:-translate-y-1/2 lg:w-32 hover:lg:w-64 lg:h-auto w-full h-full top-0 left-0 z-40 transition-all ${
                    isOpen ? 'translate-x-0 bg-white dark:bg-black ' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="flex items-center space-x-4 p-4 dark:hover:text-white dark:text-gray-300 bg-white dark:bg-black lg:w-64 w-full">
                    <div className="w-8 h-8 border-2 border-blue-400 dark:border-gray-600 rounded-md"></div>
                    <div className="flex flex-col items-start">
                        <span className="text-sm font-bold">Institution Name</span>
                        <Link to={"/institutions"} className="text-xs text-gray-400 hover:text-blue-400 hover:underline self-start">
                            Go back
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col p-4 space-y-4">
                    {menuItems.map((item, index) =>
                            (!item || isAuthenticated) && (
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

                    <div className="lg:hidden">
                        <UserMenu />
                    </div>
                </div>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            <div className="hidden lg:block">
                <UserMenu />
            </div>
        </>
    );
};

export default InstitutionSidebar;