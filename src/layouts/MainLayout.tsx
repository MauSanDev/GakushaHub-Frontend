import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
    return (
        <div className="flex h-screen w-full overflow-hidden"> {/* Cambié overflow-visible a overflow-hidden */}
            <Sidebar />
            <div className="flex-1 flex flex-col items-center px-1 justify-center h-full"> {/* Asegurar que el contenido ocupe todo el alto */}
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;