import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InstitutionSidebar from "../pages/Institutions/InstitutionSidebar.tsx";

const InstitutionRoute: React.FC = () => {
    const { isAuthenticated } = useAuth();

    // Evitar que la página se scrollee o se mueva en mobile
    useEffect(() => {
        // Desactivar el scroll en el cuerpo de la página
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';

        return () => {
            // Rehabilitar el scroll cuando el componente se desmonta
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        };
    }, []);

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    return (
        <div className="flex h-screen w-full px-2 overflow-visible">
            <InstitutionSidebar />
            <div className="flex-1 flex flex-col items-center justify-center">
                <Outlet />
            </div>
        </div>
    );
};

export default InstitutionRoute;