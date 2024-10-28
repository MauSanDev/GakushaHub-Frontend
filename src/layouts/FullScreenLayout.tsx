import React, { useEffect } from 'react';
import { Outlet } from "react-router-dom";

const FullScreenLayout: React.FC = () => {
    useEffect(() => {
        // Desactivar el scroll y fijar la posición
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

    return (
        <div className="flex h-screen w-full">
            <Outlet />
        </div>
    );
};

export default FullScreenLayout;