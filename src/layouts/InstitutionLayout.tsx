import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InstitutionSidebar from "../pages/Institutions/InstitutionSidebar.tsx";

const InstitutionRoute: React.FC = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    return (
        <div className="flex h-screen w-full px-2 overflow-visible">
            <InstitutionSidebar/>
            <div className="flex-1 flex flex-col items-center justify-center">
                <Outlet/>
            </div>
        </div>
    );
};

export default InstitutionRoute;