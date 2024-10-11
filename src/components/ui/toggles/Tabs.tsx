import React from 'react';
import TabToggle from './TabToggle.tsx';

interface Tab {
    label: string;
    view: string;
    icon?: React.ReactNode
}

interface TabsProps {
    tabs: Tab[];
    onTabChange: (view: string) => void;
    currentTab: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, onTabChange, currentTab }) => {
    return (
        <div className="flex gap-2">
            {tabs.map(tab => (
                <TabToggle
                    key={tab.view}
                    isSelected={currentTab === tab.view}
                    onToggle={() => onTabChange(tab.view)}
                    onSelected={{
                        text: tab.label,
                        icon: tab.icon,
                        className: 'bg-blue-500 dark:bg-gray-600 text-white dark:border-gray-800',
                    }}
                    onDeselected={{
                        text: tab.label,
                        icon: tab.icon,
                        className: 'text-gray-500 bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
                    }}
                />
            ))}
        </div>
    );
};

export default Tabs;