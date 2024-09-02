import React from 'react';
import Sidebar from '../components/Sidebar';
import {Outlet} from "react-router-dom";

const MainLayout: React.FC = () => {
    return (
        <div className="flex h-screen w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col items-center justify-center">
                <Outlet/>
            </div>
        </div>
    );
};

export default MainLayout;