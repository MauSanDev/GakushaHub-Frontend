import React, { useState, useEffect, useRef } from 'react';
import { FaCog } from 'react-icons/fa';
import { createPortal } from 'react-dom';

interface TooltipButtonProps {
    items: React.ReactNode[];
    icon?: React.ReactNode;
    buttonSize?: string;
    baseColor?: string;
    hoverColor?: string;
    autoClose?: boolean;
}

const TooltipButton: React.FC<TooltipButtonProps> = ({
                                                         items,
                                                         icon,
                                                         buttonSize = 'description-lg',
                                                         baseColor = 'bg-blue-500 dark:bg-gray-700',
                                                         hoverColor = 'hover:bg-blue-600 dark:hover:bg-gray-600',
                                                         autoClose = true,
                                                     }) => {
    const [showConfig, setShowConfig] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (autoClose) {
            const handleClickOutside = (event: MouseEvent) => {
                const target = event.target as Node;
                // Si el clic no está en el dropdown, ni en el botón, y no es un campo de entrada
                if (dropdownRef.current &&
                    !dropdownRef.current.contains(target) &&
                    !buttonRef.current?.contains(target) &&
                    !(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) {
                    setShowConfig(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [autoClose]);

    useEffect(() => {
        if (autoClose) {
            const handleScroll = () => {
                if (showConfig) {
                    setShowConfig(false);
                }
            };

            window.addEventListener('scroll', handleScroll);
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }
    }, [autoClose, showConfig]);

    useEffect(() => {
        if (showConfig && buttonRef.current && dropdownRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const dropdownRect = dropdownRef.current.getBoundingClientRect();

            if (buttonRect.bottom + dropdownRect.height > window.innerHeight) {
                setPosition({
                    top: buttonRect.top + window.scrollY - dropdownRect.height,
                    left: buttonRect.left + window.scrollX,
                });
            } else {
                setPosition({
                    top: buttonRect.bottom + window.scrollY,
                    left: buttonRect.left + window.scrollX,
                });
            }

            if (buttonRect.left + dropdownRect.width > window.innerWidth) {
                setPosition((prev) => ({
                    ...prev,
                    left: buttonRect.right + window.scrollX - dropdownRect.width,
                }));
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
                className={`text-white ${baseColor} ${hoverColor} p-2 rounded ${buttonSize}`}
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

export default TooltipButton;