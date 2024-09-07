import React, { useState, useEffect, useRef } from 'react';
import { FaCog } from 'react-icons/fa';
import { createPortal } from 'react-dom';

interface ConfigDropdownProps {
    items: React.ReactNode[];
    icon?: React.ReactNode;
    buttonSize?: string;
}

const ConfigDropdown: React.FC<ConfigDropdownProps> = ({ items, icon, buttonSize = 'text-lg' }) => {
    const [showConfig, setShowConfig] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [openDirection, setOpenDirection] = useState<'down' | 'up'>('down');
    const [align, setAlign] = useState<'right' | 'left'>('right');
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && !buttonRef.current?.contains(event.target as Node)) {
                setShowConfig(false); // Cierra el dropdown si se hace clic fuera
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (showConfig && buttonRef.current && dropdownRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const dropdownRect = dropdownRef.current.getBoundingClientRect();

            // Verificar si el dropdown se sale de la pantalla (hacia abajo)
            if (buttonRect.bottom + dropdownRect.height > window.innerHeight) {
                setOpenDirection('up'); // Si no hay espacio hacia abajo, abrir hacia arriba
                setPosition({
                    top: buttonRect.top + window.scrollY - dropdownRect.height,
                    left: buttonRect.left + window.scrollX,
                });
            } else {
                setOpenDirection('down');
                setPosition({
                    top: buttonRect.bottom + window.scrollY, // Abre hacia abajo por defecto
                    left: buttonRect.left + window.scrollX,
                });
            }

            // Verificar si el dropdown se sale de la pantalla (hacia la derecha)
            if (buttonRect.left + dropdownRect.width > window.innerWidth) {
                setAlign('left'); // Si no hay espacio a la derecha, alinear a la izquierda
                setPosition((prev) => ({
                    ...prev,
                    left: buttonRect.right + window.scrollX - dropdownRect.width,
                }));
            } else {
                setAlign('right'); // Por defecto, alinear a la derecha
            }
        }
    }, [showConfig]);

    const dropdownContent = (
        <div
            ref={dropdownRef}
            style={{
                position: 'absolute',
                top: `${position.top}px`,
                left: `${position.left}px`,
                zIndex: 9999,
            }}
            className="max-w-xs w-auto p-4 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg"
        >
            <div>
                {items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between mt-2">
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div>
            <button
                ref={buttonRef}
                className={`text-white bg-blue-500 dark:bg-gray-700 hover:bg-blue-600 dark:hover:bg-gray-600 p-2 rounded ${buttonSize}`}
                onClick={() => setShowConfig(!showConfig)}
            >
                {icon ?? <FaCog />}
            </button>
            {showConfig && createPortal(
                dropdownContent,
                document.getElementById("modal-root")!
            )}
        </div>
    );
};

export default ConfigDropdown;