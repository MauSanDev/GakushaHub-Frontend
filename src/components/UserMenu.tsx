import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserMenu: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

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

    return (
        <div className="fixed top-0 p-4 flex items-center space-x-4 z-50">
            {user ? (
                <>
                    <span className="text-gray-800 font-bold text-sm">
                        {user.displayName || user.email}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="p-2 bg-white text-gray-800 font-bold text-sm hover:text-blue-500 focus:outline-none"
                        aria-label="Logout"
                    >
                        <FaSignOutAlt />
                    </button>
                </>
            ) : (
                <>
                    <button
                        onClick={handleSignIn}
                        className="p-2 bg-white text-gray-600 font-bold text-sm hover:text-blue-500 focus:outline-none"
                    >
                        Log In
                    </button>
                    <button
                        onClick={handleSignUp}
                        className="p-2 bg-blue-500 text-white font-bold text-sm hover:bg-blue-700 rounded focus:outline-none"
                    >
                        Sign Up
                    </button>
                </>
            )}
        </div>
    );
};

export default UserMenu;