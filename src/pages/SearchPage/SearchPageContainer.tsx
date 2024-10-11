import React, { useState } from 'react';
import { FaCheckSquare, FaSquare } from 'react-icons/fa';
import SecondaryButton from "../../components/ui/buttons/SecondaryButton.tsx";
import ShowSelectionToggle from "../../components/ui/toggles/ShowSelectionToggle.tsx";

interface SearchPageContainerProps<T> {
    items: T[];
    selectedItems: string[]; 
    renderItem: (item: T, isSelected: boolean, onSelect: (isSelected: boolean) => void) => React.ReactNode;
    onSelectionChange: (selectedItemIds: string[]) => void;
    maxColumns?: number;
}

const SearchPageContainer = <T extends { _id: string }>({
                                                            items,
                                                            selectedItems, 
                                                            renderItem,
                                                            onSelectionChange,
                                                            maxColumns = 3,
                                                        }: SearchPageContainerProps<T>) => {
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);

    // useEffect(() => {
    //     onSelectionChange(selectedItemIds); 
    // }, [selectedItemIds, onSelectionChange]);


    const toggleSelected = (item: T, isSelected: boolean) => {
        onSelectionChange(
            isSelected ? [...selectedItems, item._id] : selectedItems.filter(selectedId => selectedId !== item._id)
        );
    };


    const selectAll = () => {
        onSelectionChange(items.map(item => item._id)); 
    };

    const deselectAll = () => {
        onSelectionChange([]); 
    };

    const itemsToShow = showSelectedOnly
        ? items.filter(item => selectedItems.includes(item._id)) 
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
                    renderItem(item, selectedItems.includes(item._id), isSelected => toggleSelected(item, isSelected))
                )}
            </div>
        </div>
    );
};

export default SearchPageContainer;