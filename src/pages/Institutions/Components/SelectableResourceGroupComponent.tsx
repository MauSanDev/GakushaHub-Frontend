import React, { useEffect } from 'react';
import { FaSortAlphaDown, FaSortAmountDown } from 'react-icons/fa';
import CollapsibleSection from '../../../components/ui/containers/CollapsibleSection';
import { useElements } from '../../../hooks/newHooks/useElements';
import { BaseDeckData } from "../../../data/DeckData.ts";
import { CollectionTypes } from "../../../data/CollectionTypes";
import { ResourceData } from "../../../data/Institutions/ResourceData.ts";
import NoDataMessage from "../../../components/NoDataMessage.tsx";
import ResourceListElement from "./ResourceListElement.tsx";
import TertiaryButton from "../../../components/ui/buttons/TertiaryButton.tsx";

interface SelectableResourceGroupProps {
    resourceGroup: BaseDeckData;
    isSelected: boolean;
    onSelected: (groupId: string) => void;
}

const SelectableResourceGroupComponent: React.FC<SelectableResourceGroupProps> = ({ resourceGroup, isSelected, onSelected }) => {
    const { data: elements, isLoading, fetchElementsData } = useElements<ResourceData>(resourceGroup.elements, CollectionTypes.Resources);

    useEffect(() => {
        if (resourceGroup.elements && resourceGroup.elements.length > 0) {
            fetchElementsData();
        }
    }, [resourceGroup]);

    return (
        <div className={'border-t border-gray-200 dark:border-gray-800 py-3'}>
            <CollapsibleSection
                title={`${resourceGroup.name} (${resourceGroup.elements?.length || 0} Items)`}
                actions={(
                    <TertiaryButton
                        label={isSelected ? "Deselect Group" : "Select Group"}
                        iconComponent={isSelected ? <FaSortAmountDown /> : <FaSortAlphaDown />}
                        onClick={() => onSelected(resourceGroup._id)}
                    />
                )}
            >
                <div className="mt-2 ml-4 flex flex-col gap-2 border-l-4 border-gray-300 border-dotted dark:border-gray-800 pl-4 pb-16">
                    {resourceGroup.elements && resourceGroup.elements.length > 0 ? (
                        <>

                            {isLoading ? (
                                <div className="text-center text-gray-500">Loading...</div>
                            ) : (
                                 elements && Object.values(elements).map((resource) => (
                                    <ResourceListElement
                                        key={resource._id}
                                        resourceData={resource}
                                        isSelected={isSelected}
                                        onSelect={() => onSelected(resource._id)}
                                        canOpen={true}
                                    />
                                ))
                            )}
                        </>
                    ) : (
                        <NoDataMessage />
                    )}
                </div>
            </CollapsibleSection>
        </div>
    );
};

export default SelectableResourceGroupComponent;