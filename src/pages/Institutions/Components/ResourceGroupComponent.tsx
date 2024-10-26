import React, { useState, useEffect } from 'react';
import { FaSortAlphaDown, FaSortAlphaUp, FaSortAmountDown, FaPlus, FaTrash } from 'react-icons/fa';
import CollapsibleSection from '../../../components/ui/containers/CollapsibleSection';
import SearchBar from '../../../components/ui/inputs/SearchBar';
import { useElements } from '../../../hooks/newHooks/useElements';
import { useUpdateList } from '../../../hooks/updateHooks/useUpdateList';
import { BaseDeckData } from "../../../data/DeckData.ts";
import { CollectionTypes } from "../../../data/CollectionTypes";
import { ResourceData } from "../../../data/Institutions/ResourceData.ts";
import NoDataMessage from "../../../components/NoDataMessage.tsx";
import ResourceListElement from "./ResourceListElement.tsx";
import AddResourcesToGroupModal from "../AddResourcesToGroupModal.tsx";
import TertiaryButton from "../../../components/ui/buttons/TertiaryButton.tsx";
import LocSpan from "../../../components/LocSpan.tsx";
import {useTranslation} from "react-i18next";

interface ResourceGroupProps {
    resourceGroup: BaseDeckData;
    institutionId: string;
    isEditable: boolean;
    canDelete: boolean;
    onAdd: () => void;
    onDelete: () => void;
}

const ResourceGroupComponent: React.FC<ResourceGroupProps> = ({ resourceGroup, onAdd, onDelete, institutionId, isEditable, canDelete }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'az' | 'za' | 'type'>('az');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedResources, setSelectedResources] = useState<string[]>([]);

    const { data: elements, isLoading, fetchElementsData } = useElements<ResourceData>(resourceGroup.elements, CollectionTypes.Resources);
    const { mutate: updateList } = useUpdateList();
    const { t } = useTranslation();

    useEffect(() => {
        if (resourceGroup.elements && resourceGroup.elements.length > 0) {
            fetchElementsData();
        }
    }, [resourceGroup]);

    const handleSearch = (query: string) => setSearchQuery(query);

    const handleSortChange = () => {
        setSortOrder((prev) => (prev === 'az' ? 'za' : prev === 'za' ? 'type' : 'az'));
    };

    const handleAddResource = () => setIsAddModalOpen(true);

    const handleCloseModal = () => setIsAddModalOpen(false);

    const handleResourceSelect = (resourceId: string) => {
        if (!isEditable) return;
        setSelectedResources((prevSelected) =>
            prevSelected.includes(resourceId)
                ? prevSelected.filter((id) => id !== resourceId)
                : [...prevSelected, resourceId]
        );
    };

    const handleRemoveSelected = () => {
        const isConfirmed = window.confirm(t("resourcesKeys.removeSelectedConfirm"));
        if (isConfirmed && selectedResources.length > 0) {
            updateList(
                {
                    collection: CollectionTypes.ResourcesGroup,
                    documentId: resourceGroup._id,
                    field: "elements",
                    value: selectedResources,
                    action: "remove",
                },
                {
                    onSuccess: () => {
                        fetchElementsData();
                        setSelectedResources([]);
                    },
                }
            );
        }
    };

    const sortedAndFilteredResources = elements
        ? Object.values(elements)
            .filter((resource) => resource.title.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => {
                if (sortOrder === 'az') return a.title.localeCompare(b.title);
                if (sortOrder === 'za') return b.title.localeCompare(a.title);
                return a.type.localeCompare(b.type);
            })
        : [];

    const getSortIcon = () => {
        if (sortOrder === 'az') return <FaSortAlphaDown />;
        if (sortOrder === 'za') return <FaSortAlphaUp />;
        return <FaSortAmountDown />;
    };
    
    const onExpanded = () => 
    {
        setSelectedResources([])
    }

    return (
        <div className={'border-t border-gray-200 dark:border-gray-800 py-3 dark:text-white text-black'}>
        <CollapsibleSection
            className={'text-xl'}
            onExpand={onExpanded}
            title={`${resourceGroup.name}`}
            label={`(${resourceGroup.elements?.length || 0} Items)`}
            actions={(
                <>
                    {isEditable && (
                        <TertiaryButton label={"resourcesKeys.addResources"} iconComponent={<FaPlus />} onClick={handleAddResource} className={'text-black'}/>
                    )}

                    {canDelete && (
                        <TertiaryButton label={"resourcesKeys.deleteGroup"} iconComponent={<FaTrash />} onClick={onDelete} className={'text-black'} />
                    )}

                    {selectedResources.length > 0 && isEditable && (
                        <TertiaryButton label={"resourcesKeys.removeSelected"} iconComponent={<FaPlus />} onClick={handleRemoveSelected} />
                    )}
                </>
            )}
        >
            <div className="mt-2 ml-4 flex flex-col gap-2 border-l-4 border-gray-300 border-dotted dark:border-gray-800 pl-4 pb-16">

                {resourceGroup.elements && resourceGroup.elements.length > 0 ?
                
                (<>
                <div className="flex justify-between items-center mb-2">
                    <SearchBar placeholder="searchPlaceholder" onSearch={handleSearch} />

                    <button
                        className="flex items-center p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        onClick={handleSortChange}
                    >
                        {getSortIcon()}
                        <LocSpan textKey={"resourcesKeys.sort"} className="ml-1" />
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-center text-gray-500">Loading...</div>
                ) :  (
                    sortedAndFilteredResources.map((resource) => (
                        <ResourceListElement
                            key={resource._id}
                            resourceData={resource}
                            isSelected={selectedResources.includes(resource._id)}
                            onSelect={() => handleResourceSelect(resource._id)}
                            canOpen={true}
                        />
                    ))
                )}
                </>
                ) : (<NoDataMessage />)}
            </div>

            {isAddModalOpen && (
                <AddResourcesToGroupModal
                    groupId={resourceGroup._id}
                    institutionId={institutionId}
                    onClose={handleCloseModal}
                    onAddResourcesSuccess={() => {
                        onAdd();
                        handleCloseModal();
                    }}
                />
            )}
        </CollapsibleSection>
        </div>
    );
};

export default ResourceGroupComponent;