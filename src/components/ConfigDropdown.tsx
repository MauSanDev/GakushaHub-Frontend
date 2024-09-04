import React, { useState } from 'react';
import { FaCog } from 'react-icons/fa';

interface ConfigDropdownProps {
    items: React.ReactNode[];
    icon?: React.ReactNode;
}

const ConfigDropdown: React.FC<ConfigDropdownProps> = ({items, icon,}) => {
    const [showConfig, setShowConfig] = useState(false);

    return (
        <div className="relative">
            <button
                className="text-white bg-blue-500 dark:bg-gray-700 hover:bg-blue-600 dark:hover:bg-gray-600 p-1 rounded"
                onClick={() => setShowConfig(!showConfig)}
            >
                {icon ?? <FaCog />}
            </button>
            {showConfig && (
                <div className="absolute right-0 w-56 p-4 bg-white dark:bg-black border border-gray-300 rounded-md shadow-lg z-50">
                    <div>
                        {items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between mt-2">
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConfigDropdown;