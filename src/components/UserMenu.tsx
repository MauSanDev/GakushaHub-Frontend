import React, { useState, useRef, useEffect } from 'react';
import { FaSignOutAlt, FaUser, FaMoon, FaSun } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LanguageDropdown from './LanguageDropdown';

const UserMenu: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        await logout();
        navigate('/'); // Redirigir a la página principal
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

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
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

    // Toggle dark mode logic
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    return (
        <div className="fixed top-0 left-0 p-4 z-50 ">
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
                        {isMenuOpen && (
                            <div className="absolute left-0 mt-1 w-48 bg-white dark:bg-black z-50 pl-3">
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-2 py-1 text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-800 rounded"
                                >
                                    <FaSignOutAlt className="inline-block mr-2" />
                                    Logout
                                </button>
                                <div className="border-t border-gray-200 dark:border-gray-700 mt-2"></div>
                                <div className="px-4 py-2 inline">
                                    <LanguageDropdown /> {/* Uso de LanguageDropdown */}
                                </div>
                                <div className="px-2 gap-2 py-2 flex items-center  dark:text-white">
                                    <FaSun/>
                                    <div
                                        onClick={toggleDarkMode}
                                        className={`relative inline-block w-10 h-6 cursor-pointer rounded-full dark:border-gray-700 border py-3 pr-3 bg-black`}
                                    >
                                        <span
                                            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                                isDarkMode ? 'transform translate-x-4' : ''
                                            }`}
                                        ></span>
                                    </div>
                                    <FaMoon />
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center space-x-2">
                        <LanguageDropdown />
                        <button
                            onClick={handleSignIn}
                            className=" border-l p-2 pl-4 bg-white dark:bg-black text-gray-800 font-bold text-sm hover:text-blue-400 dark:text-white focus:outline-none"
                        >
                            Log In
                        </button>
                        <button
                            onClick={handleSignUp}
                            className="p-2 bg-blue-500 dark:bg-gray-700 text-white font-bold text-sm hover:bg-blue-700 rounded focus:outline-none"
                        >
                            Sign Up
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserMenu;