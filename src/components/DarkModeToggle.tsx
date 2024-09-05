import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

export const applyDarkMode = () => {
    const savedMode = localStorage.getItem('darkMode');
    const isDarkMode = savedMode ? JSON.parse(savedMode) : false;

    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};
const DarkModeToggle: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    return (
        <div className="flex items-center dark:text-gray-500 hover:dark:text-white text-gray-300 hover:text-blue-500 transition-all dark:group-hover:text-white dark:group-hover[bg-white] ">
            <FaSun />
            <div
                onClick={toggleDarkMode}
                className={`relative inline-block w-10 h-6 cursor-pointer rounded-full dark:border-gray-700 hover:dark:border-gray-500 border py-3 pr-3 bg-gray-300 dark:bg-black hover:bg-blue-500 ml-2 mr-2`}
            >
                <span
                    className={`absolute left-1 top-1 w-4 h-4 bg-white dark:bg-gray-500 hover:dark:bg-white rounded-full transition-all ${
                        isDarkMode ? 'transform translate-x-4' : ''
                    }`}
                ></span>
            </div>
            <FaMoon />
        </div>
    );
};

export default DarkModeToggle;