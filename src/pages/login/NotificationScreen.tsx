import React, {useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import AuthLayout from './AuthLayout';
import {useAuth} from "../../context/AuthContext.tsx";

const NotificationScreen: React.FC<{ message: string }> = ({ message }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated)
            navigate("/search", { replace: true})
    }, [isAuthenticated]);
    
    return (
        <AuthLayout>
            <div className="max-w-md">
                <div className="w-full max-w-md p-8 space-y-8 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">{message}</h2>
                    <Link
                        to="/signin"
                        className="mt-8 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Back to Sign in
                    </Link>
                </div>
            </div>
        </AuthLayout>
);
};

export default NotificationScreen;