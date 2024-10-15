import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import DeleteButton from "./DeleteButton";
import AddContentButton from "./AddContentButton.tsx";
import { MembershipRole } from "../data/MembershipData.ts";
import { CollectionTypes } from "../data/CollectionTypes.tsx";
import { useElements } from '../hooks/newHooks/useElements';
import CollapsibleSection from "./ui/containers/CollapsibleSection";
import { BaseDeckData } from "../data/DeckData.ts";

interface GenericDeckDisplayProps<T> {
    deck: BaseDeckData;
    lessonId: string;
    courseId: string;
    renderItem: (element: T, index: number) => JSX.Element;
    renderTable?: (deckElements: T[]) => JSX.Element;
    columns?: number;
    mobileColumns?: number;
    enableGeneration?: boolean;
    elementType: CollectionTypes;
    viewMode: "table" | "cards";
    viewerRole: MembershipRole;
}

const GenericDeckDisplay = <T,>({
                                    deck,
                                    lessonId,
                                    courseId,
                                    renderItem,
                                    renderTable,
                                    columns = 6,
                                    mobileColumns = 1,
                                    elementType,
                                    viewMode,
                                    viewerRole,
                                }: GenericDeckDisplayProps<T>) => {
    const [expanded, setExpanded] = useState(false);
    const { data: elements, isLoading, fetchElementsData } = useElements<T>(deck.elements, elementType);

    const handleExpand = () => {
        if (!expanded && !elements) {
            fetchElementsData();
        }
        setExpanded(!expanded);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center p-4">
                    <FaSpinner className="animate-spin text-gray-500" size={24} />
                </div>
            );
        }

        if (!elements || Object.keys(elements).length === 0) {
            return <p>No se encontraron elementos.</p>;
        }

        const elementList = Object.values(elements);

        if (viewMode === "cards" || !renderTable) {
            return (
                <div
                    className={`grid gap-2`}
                    style={{
                        gridTemplateColumns: `repeat(${window.innerWidth < 640 ? mobileColumns : columns}, minmax(0, 1fr))`,
                    }}
                >
                    {elementList.map((element, index) => renderItem(element, index))}
                </div>
            );
        } else if (viewMode === "table" && renderTable) {
            return (
                <div className={`grid columns-1 gap-2`}>
                    {renderTable(elementList)}
                </div>
            );
        }
    };

    return (
        <div className="w-full pl-3">
            <CollapsibleSection
                title={deck.name}
                label={`(${deck.elements.length} Items)`}
                onExpand={handleExpand}
                isEditable={true}
                documentId={deck._id}
                field="name"
                collectionType={elementType}
                canEdit={viewerRole === MembershipRole.Owner || viewerRole === MembershipRole.Sensei || viewerRole === MembershipRole.Staff}
                actions={(
                    <>
                        <AddContentButton
                            creatorId={deck.creatorId}
                            courseId={courseId}
                            courseName={courseId}
                            lessonName={lessonId}
                            deckName={deck.name}
                        />
                        <DeleteButton
                            creatorId={deck.creatorId}
                            elementId={deck._id}
                            elementType={elementType}
                        />
                    </>
                )}
            >
                {expanded && renderContent()}
            </CollapsibleSection>
        </div>
    );
};

export default GenericDeckDisplay;