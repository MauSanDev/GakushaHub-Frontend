import React, { useState } from 'react';
import CollapsibleSection from '../../../components/ui/containers/CollapsibleSection';
import ResourceDataElement from './../Components/ResourceDataElement';
import SearchBar from '../../../components/ui/inputs/SearchBar';
import { FaSortAlphaDown, FaSortAlphaUp, FaSortAmountDown } from 'react-icons/fa';

interface Resource {
    _id: string;
    title: string;
    type: string;
    url?: string;
    text?: string;
}

interface ResourceGroupProps {
    resourceGroup: {
        _id: string;
        name: string;
        resources: Resource[];
    };
}

const ResourceGroupComponent: React.FC<ResourceGroupProps> = ({ resourceGroup }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'az' | 'za' | 'type'>('az'); // Orden predeterminado: A -> Z

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleSortChange = () => {
        if (sortOrder === 'az') setSortOrder('za');
        else if (sortOrder === 'za') setSortOrder('type');
        else setSortOrder('az');
    };

    const sortedAndFilteredResources = resourceGroup.resources
        .filter((resource) =>
            resource.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortOrder === 'az') {
                return a.title.localeCompare(b.title);
            } else if (sortOrder === 'za') {
                return b.title.localeCompare(a.title);
            } else {
                return a.type.localeCompare(b.type);
            }
        });

    const getSortIcon = () => {
        if (sortOrder === 'az') return <FaSortAlphaDown />;
        if (sortOrder === 'za') return <FaSortAlphaUp />;
        return <FaSortAmountDown />;
    };

    return (
        <CollapsibleSection title={`${resourceGroup.name} (${resourceGroup.resources.length})`}>
            <div className="mt-2 ml-4 flex flex-col gap-2 border-l-4 border-gray-300 border-dotted dark:border-gray-800 pl-4">
                <div className="flex justify-between items-center mb-2">
                    <SearchBar
                        placeholder="Search in group..."
                        onSearch={handleSearch}
                    />

                    <button
                        className="flex items-center p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        onClick={handleSortChange}
                    >
                        {getSortIcon()}
                        <span className="ml-1">Sort</span>
                    </button>
                </div>

                {sortedAndFilteredResources.map((resource) => (
                    <ResourceDataElement key={resource._id} resourceData={resource} canDelete={true} />
                ))}
            </div>
        </CollapsibleSection>
    );
};

export default ResourceGroupComponent;