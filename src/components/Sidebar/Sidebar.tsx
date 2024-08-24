import React, { useState } from 'react';

const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { label: 'Search', href: '#search' },
        { label: 'Kanjis', href: '#kanjis' },
        { label: 'Words', href: '#words' },
        { label: 'Grammar', href: '#grammar' }
    ];

    return (
        <>
            {/* Botón de Menú para Móviles */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-500 text-white rounded"
                onClick={() => setIsOpen(!isOpen)}
            >
                ☰
            </button>

            {/* Sidebar Flotante */}
            <div
                className={`fixed left-0 top-1/2 transform -translate-y-1/2 h-auto bg-white lg:translate-x-0 z-40 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                } lg:w-64 w-64`}
            >
                <div className="flex flex-col p-4 space-y-4">
                    {menuItems.map((item, index) => (
                        <a
                            key={index}
                            href={item.href}
                            className="text-sm font-bold text-gray-600 hover:text-blue-400 py-2 border-b border-gray-300 text-left"
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>

            {/* Background Overlay for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </>
    );
};

export default Sidebar;