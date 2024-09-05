import React from 'react';
import { Outlet } from "react-router-dom";

const FullScreenLayout: React.FC = () => {
    return (
        <div className="flex h-screen w-full">
            <div className="flex-1 flex flex-col items-center justify-center w-full">
                <Outlet />
            </div>
        </div>
    );
};

export default FullScreenLayout;