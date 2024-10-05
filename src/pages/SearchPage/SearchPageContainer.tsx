import React, { useState, useEffect } from 'react';
import { FaCheckSquare, FaSquare, FaEye, FaEyeSlash } from 'react-icons/fa';

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
                    <button
                        onClick={() => setShowSelectedOnly(!showSelectedOnly)}
                        className={`whitespace-nowrap text-xs border dark:border-gray-700 rounded-full px-3 py-2 transition-all duration-300 transform lg:hover:scale-105 hover:shadow-md flex items-center gap-2 ${
                            showSelectedOnly
                                ? 'bg-blue-500 dark:bg-green-900 text-white'
                                : 'bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-blue-300 hover:text-white'
                        }`}
                    >
                        {showSelectedOnly ? <FaEyeSlash /> : <FaEye />}
                        {showSelectedOnly ? 'Show All' : 'Show Selected'}
                    </button>
                    <button
                        onClick={selectAll}
                        className="whitespace-nowrap text-xs border dark:border-gray-700 rounded-full px-3 py-2 transition-all duration-300 transform lg:hover:scale-105 hover:shadow-md flex items-center gap-2 bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-blue-300 hover:text-white"
                    >
                        <FaCheckSquare />
                        Select All
                    </button>
                    <button
                        onClick={deselectAll}
                        className="whitespace-nowrap text-xs border dark:border-gray-700 rounded-full px-3 py-2 transition-all duration-300 transform lg:hover:scale-105 hover:shadow-md flex items-center gap-2 bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-blue-300 hover:text-white"
                    >
                        <FaSquare />
                        Deselect All
                    </button>
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