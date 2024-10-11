import React, { useState, useEffect } from 'react';
import { FaCheckSquare, FaSquare } from 'react-icons/fa';
import SecondaryButton from "../../components/ui/buttons/SecondaryButton.tsx";
import ShowSelectionToggle from "../../components/ui/toggles/ShowSelectionToggle.tsx";

interface SearchPageContainerProps<T> {
    items: T[];
    renderItem: (item: T, isSelected: boolean, onSelect: (isSelected: boolean) => void) => React.ReactNode;
    onSelectionChange: (selectedItems: T[]) => void;
    maxColumns?: number; 
}

const SearchPageContainer = <T extends { _id: string }>({
                                                            items,
                                                            renderItem,
                                                            onSelectionChange,
                                                            maxColumns = 3, 
                                                        }: SearchPageContainerProps<T>) => {
    const [selectedItems, setSelectedItems] = useState<T[]>(items); 
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);

    useEffect(() => {
        onSelectionChange(selectedItems);
    }, [selectedItems, onSelectionChange]);

    const toggleSelected = (item: T, isSelected: boolean) => {
        setSelectedItems(prevSelected =>
            isSelected ? [...prevSelected, item] : prevSelected.filter(selectedItem => selectedItem._id !== item._id)
        );
    };

    const selectAll = () => {
        setSelectedItems(items);
    };

    const deselectAll = () => {
        setSelectedItems([]);
    };

    const itemsToShow = showSelectedOnly ? selectedItems : items;

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
                    renderItem(item, selectedItems.includes(item), isSelected => toggleSelected(item, isSelected))
                )}
            </div>
        </div>
    );
};

export default SearchPageContainer;