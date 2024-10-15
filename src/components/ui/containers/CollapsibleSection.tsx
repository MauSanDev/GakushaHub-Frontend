import React, { useState, MouseEvent } from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import LocSpan from "../../LocSpan.tsx";
import Editable from "../text/Editable.tsx";  // Asumo que tienes este componente disponible

interface CollapsibleSectionProps {
    title: string;
    onExpand?: () => void;
    isEditable?: boolean;
    label?: string;
    documentId?: string;
    field?: string;
    collectionType?: string;
    canEdit?: boolean;
    children: React.ReactNode;
    actions?: React.ReactNode;  // Nueva prop para pasar los botones o acciones adicionales
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
                                                                   title,
                                                                   onExpand,
                                                                   isEditable = false,
                                                                   label,
                                                                   documentId,
                                                                   field,
                                                                   collectionType,
                                                                   canEdit = false,
                                                                   children,
                                                                   actions  // Pasamos los botones o acciones adicionales aquí
                                                               }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setIsOpen((prevIsOpen) => {
            const nextIsOpen = !prevIsOpen;
            if (nextIsOpen && onExpand) {
                onExpand();  // Llamamos a onExpand cuando se abre el colapsable
            }
            return nextIsOpen;
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center w-full cursor-pointer dark:text-white font-semibold">
                <div onClick={handleToggle} className="flex items-center w-auto">
                    <span className="mr-2">
                        {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                    </span>

                    {isEditable ? (
                        <Editable
                            initialValue={title}
                            documentId={documentId || ''}
                            field={field || ''}
                            collection={collectionType || ''}
                            canEdit={canEdit}
                            className="font-bold"
                            maxChar={40}
                        />
                    ) : (
                        <LocSpan textKey={title} />
                    )}

                    {label && <span className="ml-2 text-sm text-gray-500 font-normal whitespace-nowrap">{label}</span>}
                </div>

                {/* Se renderizan las acciones como botones al lado derecho del header */}
                <div className="flex items-center gap-2">
                    {actions}
                </div>
            </div>

            <div className={`overflow-hidden transition-max-height duration-500 ease-in-out ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
                {children}
            </div>
        </div>
    );
};

export default CollapsibleSection;