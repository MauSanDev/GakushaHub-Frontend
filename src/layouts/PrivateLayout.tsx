import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserMenu from "../components/UserMenu.tsx";
import Sidebar from "../components/Sidebar";

const PrivateRoute: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/signin" replace />;
    }
    return (
        <div className="flex h-screen w-full">
            <UserMenu/>
            <Sidebar/>
            <div className="flex-1 flex flex-col items-center justify-center">
                <Outlet/>
            </div>
        </div>
    );
};

export default PrivateRoute;