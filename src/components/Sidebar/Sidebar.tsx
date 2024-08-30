import React, { useState } from 'react';

interface SidebarProps {
    setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setActiveSection }) => {
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        { label: 'Search', href: '#search' },
        // { label: 'Kanjis', href: '#kanjis' },
        // { label: 'Words', href: '#words' },
        { label: 'Grammar', href: '#grammar' },
        { label: 'Courses', href: '#courses' },
        { label: 'Generate', href: '#generate' },
        { label: 'Generations', href: '#generations' },
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

            {/* Sidebar */}
            <div
                className={`fixed lg:left-0 lg:top-1/2 lg:transform lg:-translate-y-1/2 lg:w-64 lg:h-auto w-full h-full top-0 left-0 bg-white z-40 transition-transform ${
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="flex flex-col p-4 space-y-4">
                    {menuItems.map((item, index) => (
                        <a
                            key={index}
                            href={item.href}
                            className="text-sm font-bold text-gray-600 hover:text-blue-400 py-2 border-b border-gray-300 text-left"
                            onClick={() => {
                                setActiveSection(item.label);
                                setIsOpen(false); // Cierra el menú en modo responsive
                            }}
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