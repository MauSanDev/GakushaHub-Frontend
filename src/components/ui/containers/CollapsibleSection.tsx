import React, { useState, MouseEvent } from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import LocSpan from "../../LocSpan.tsx";
import Editable from "../text/Editable.tsx";  

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
    actions?: React.ReactNode;  
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
                                                                   actions  
                                                               }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setIsOpen((prevIsOpen) => {
            const nextIsOpen = !prevIsOpen;
            if (nextIsOpen && onExpand) {
                onExpand();  
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

                <div className="flex items-center gap-0.5">
                    {actions}
                </div>
            </div>

            <div className={`overflow-hidden transition-max-height duration-300 ease-in-out ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
                {children}
            </div>
        </div>
    );
};

export default CollapsibleSection;