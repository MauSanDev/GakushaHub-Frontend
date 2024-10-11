import React, { useState, useEffect } from 'react';
import { FaCheckSquare, FaSquare } from 'react-icons/fa';
import SecondaryButton from "../../components/ui/buttons/SecondaryButton.tsx";
import ShowSelectionToggle from "../../components/ui/toggles/ShowSelectionToggle.tsx";

interface SearchPageContainerProps<T> {
    items: T[];
    renderItem: (item: T, isSelected: boolean, onSelect: (isSelected: boolean) => void) => React.ReactNode;
    onSelectionChange: (selectedItemIds: string[]) => void;
    maxColumns?: number;
}

const SearchPageContainer = <T extends { _id: string }>({
                                                            items,
                                                            renderItem,
                                                            onSelectionChange,
                                                            maxColumns = 3,
                                                        }: SearchPageContainerProps<T>) => {
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]); // Almacena solo los _id
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);

    useEffect(() => {
        onSelectionChange(selectedItemIds); // Notifica los _id seleccionados
    }, [selectedItemIds, onSelectionChange]);

    const toggleSelected = (item: T, isSelected: boolean) => {
        setSelectedItemIds(prevSelected =>
            isSelected ? [...prevSelected, item._id] : prevSelected.filter(selectedId => selectedId !== item._id)
        );
    };

    const selectAll = () => {
        setSelectedItemIds(items.map(item => item._id)); // Selecciona todos los _id
    };

    const deselectAll = () => {
        setSelectedItemIds([]); // Deselecciona todo
    };

    const itemsToShow = showSelectedOnly
        ? items.filter(item => selectedItemIds.includes(item._id)) // Muestra solo los seleccionados
        : items;

    const gridClass = `grid gap-4 ${maxColumns === 1 ? 'md:grid-cols-1' : maxColumns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`;

    return (
        <div className="w-full max-w-4xl gap-2 flex flex-col justify-center items-center px-2">
            <div className="w-full flex justify-center items-center">
                <div className="flex gap-2">
                    <ShowSelectionToggle onToggle={() => setShowSelectedOnly(!showSelectedOnly)} isSelected={showSelectedOnly} />
                    <SecondaryButton iconComponent={<FaCheckSquare />} label={"selectAll"} onClick={selectAll} />
                    <SecondaryButton iconComponent={<FaSquare />} label={"deselectAll"} onClick={deselectAll} />
                </div>
            </div>

            <div className={`mt-4 ${gridClass}`}>
                {itemsToShow.map(item =>
                    renderItem(item, selectedItemIds.includes(item._id), isSelected => toggleSelected(item, isSelected))
                )}
            </div>
        </div>
    );
};

export default SearchPageContainer;