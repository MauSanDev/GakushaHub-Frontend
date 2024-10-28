import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaTh } from 'react-icons/fa';
import TabToggle from './TabToggle.tsx';
import LocSpan from "../../LocSpan.tsx";

interface Tab {
    label: string;
    view: string;
    icon?: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    onTabChange: (view: string) => void;
    currentTab: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, onTabChange, currentTab }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleMenu = () => setIsExpanded(!isExpanded);

    // Find the label of the currently selected tab
    const selectedTab = tabs.find(tab => tab.view === currentTab);

    return (
        <div className="relative flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            {/* Discreet Menu Button for Mobile */}
            <button
                className="sm:hidden flex items-center px-4 py-2 text-sm font-semibold text-gray-100 bg-gray-800 rounded-md"
                onClick={toggleMenu}
            >
                <FaTh />
                <LocSpan textKey={selectedTab?.label || ''} className="ml-2" />
                <span className="ml-2">
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </span>
            </button>

            {/* Dropdown Menu - positioned absolutely and inline */}
            {isExpanded && (
                <div className="absolute top-10 bg-gray-800 shadow-lg rounded-md z-10 p-2 w-full flex flex-wrap gap-2">
                    {tabs.map((tab, index) => (
                        <TabToggle
                            key={index}
                            isSelected={currentTab === tab.view}
                            onToggle={() => {
                                onTabChange(tab.view);
                                setIsExpanded(false); // Collapse menu after selection
                            }}
                            onSelected={{
                                text: tab.label,
                                icon: tab.icon,
                                className: 'bg-blue-500 text-gray-200 dark:bg-gray-600 description-white dark:border-gray-800',
                            }}
                            onDeselected={{
                                text: tab.label,
                                icon: tab.icon,
                                className: 'description-gray-500 text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-800 dark:description-gray-400 dark:border-gray-700',
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Regular Tabs display for larger screens */}
            <div className="hidden sm:flex flex-wrap gap-2">
                {tabs.map((tab, index) => (
                    <TabToggle
                        key={index}
                        isSelected={currentTab === tab.view}
                        onToggle={() => onTabChange(tab.view)}
                        onSelected={{
                            text: tab.label,
                            icon: tab.icon,
                            className: 'bg-blue-500 text-gray-200 dark:bg-gray-600 description-white dark:border-gray-800',
                        }}
                        onDeselected={{
                            text: tab.label,
                            icon: tab.icon,
                            className: 'description-gray-500 text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-800 dark:description-gray-400 dark:border-gray-700',
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Tabs;