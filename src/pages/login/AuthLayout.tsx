import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import lightBg from '../../assets/bg-light-mode.jpg';
import darkBg from '../../assets/bg-dark-mode.jpg';
import LanguageDropdown from '../../components/LanguageDropdown';
import DarkModeToggle from '../../components/DarkModeToggle';
import LocSpan from "../../components/LocSpan.tsx";

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="relative flex h-screen w-full bg-black">
            <div
                className="dark:hidden absolute flex h-screen w-full opacity-50 bg-cover"
                style={{ backgroundImage: `url(${lightBg})` }}
            />
            <div
                className="hidden absolute dark:flex h-screen w-full opacity-50 bg-cover"
                style={{ backgroundImage: `url(${darkBg})` }}
            />
            <div className="absolute inset-0 z-0 bg-cover bg-center dark:bg-none"></div>

            <div className="absolute top-4 left-4 z-20">
                <Link
                    to="/"
                    className="flex items-center text-white font-medium py-2 px-4 rounded-md shadow"
                >
                    <FaArrowLeft className="mr-2" />
                    <LocSpan textKey={"loginFlow.backToApp"} />
                </Link>
            </div>

            <div className="relative z-10 flex flex-1 justify-center items-center p-4">
                <div className="bg-white dark:bg-gray-900 dark:text-white p-6 space-y-8 shadow-lg rounded-lg">
                    {children}
                    <div className="flex gap-6 items-center px-4 mb-4">
                        <LanguageDropdown />
                        <DarkModeToggle />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;