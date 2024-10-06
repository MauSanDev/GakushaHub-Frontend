import React, { useState, useRef, useEffect } from 'react';
import { FaSignOutAlt, FaUser, FaEnvelope, FaRedoAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LanguageDropdown from './LanguageDropdown';
import DarkModeToggle from './DarkModeToggle';
import LocSpan from "./LocSpan.tsx";

const UserMenu: React.FC = () => {
    const { user, logout, isEmailVerified, resendEmailVerification } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleSignIn = () => {
        navigate('/signin');
    };

    const handleSignUp = () => {
        navigate('/signup');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="lg:fixed lg:top-0 lg:left-0 lg:p-1 z-50">
            <div ref={menuRef} className="relative">
                {user ? (
                    <>
                        <button
                            onClick={toggleMenu}
                            className="p-2 bg-white dark:bg-black text-gray-800 font-bold text-sm hover:text-blue-400 dark:text-white focus:outline-none"
                        >
                            <FaUser className="inline-block mr-2" />
                            {user.displayName || user.email}
                        </button>
                        {!isEmailVerified && (
                            <div className="text-red-500 text-sm mt-2 flex items-center">
                                <FaEnvelope className="mr-2" />
                                Please validate your account!
                                <button
                                    onClick={resendEmailVerification}
                                    className="ml-4 text-blue-500 hover:text-blue-700 flex items-center"
                                >
                                    <FaRedoAlt className="mr-1" />
                                    Resend email
                                </button>
                            </div>
                        )}
                        {isMenuOpen && (
                            <div className="lg:absolute transition-all left-0 mt-1 w-48 z-50 pl-3">
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-2 py-1 text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-800 hover:text-white rounded"
                                >
                                    <FaSignOutAlt className="inline-block mr-2" />
                                    <LocSpan textKey={"logout"} />
                                </button>
                                <div className="border-t border-gray-200 dark:border-gray-700 mt-2"></div>
                                <div className="px-4 py-2 inline">
                                    <LanguageDropdown />
                                </div>
                                <div className="px-2 py-2">
                                    <DarkModeToggle />
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="p-2 flex flex-col lg:flex-row justify-evenly lg:fixed lg:top-0 lg:left-0 lg:w-auto lg:z-50 lg:bg-transparent space-y-2 lg:space-y-0 lg:space-x-4 w-full">

                        <div className="flex space-x-2">
                            <button
                                onClick={handleSignIn}
                                className="px-4 py-2

 bg-white dark:bg-black text-gray-800 font-bold text-sm hover:text-blue-400 dark:text-white dark:hover:bg-gray-800 transition-all focus:outline-none rounded"
                            >
                                <LocSpan textKey={"loginFlow.logIn"} />
                            </button>
                            <button
                                onClick={handleSignUp}
                                className="px-4 py-2 bg-blue-500 dark:bg-gray-700 text-white font-bold text-sm hover:bg-blue-700 dark:hover:bg-gray-500 transition-all rounded focus:outline-none"
                            >
                                <LocSpan textKey={"loginFlow.signUp"} />
                            </button>
                        </div>

                        {/* Dropdown y DarkModeToggle */}
                        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-2 lg:space-y-0 lg:space-x-4 ">
                            <DarkModeToggle />
                            <LanguageDropdown />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserMenu;