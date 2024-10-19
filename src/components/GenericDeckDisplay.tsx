import { useState } from "react";
import { ReactNode } from "react";
import {FaPlayCircle, FaSpinner} from "react-icons/fa";
import DeleteButton from "./DeleteButton";
import AddContentButton from "./AddContentButton.tsx";
import { MembershipRole } from "../data/MembershipData.ts";
import { CollectionTypes } from "../data/CollectionTypes.tsx";
import { useElements } from '../hooks/newHooks/useElements';
import CollapsibleSection from "./ui/containers/CollapsibleSection";
import { BaseDeckData } from "../data/DeckData.ts";
import GenericTable from "../components/Tables/GenericTable";
import { convertArrayToFlashcardDeck } from "../data/FlashcardData.ts";
import TertiaryButton from "./ui/buttons/TertiaryButton.tsx";
import FlashcardsModal from "./FlashcardsPage";
import GenerationButton from "./Modals/GenerationButton.tsx";

interface ColumnConfig<T> {
    header: string;
    key: keyof T;
    formatter?: (value: T[keyof T], element: T) => ReactNode;
}

interface GenericDeckDisplayProps<T> {
    deck: BaseDeckData;
    lessonName: string;
    courseName: string;
    courseId: string;
    renderItem: (element: T, index: number) => JSX.Element;
    columns?: number;
    mobileColumns?: number;
    columnConfig?: ColumnConfig<T>[];
    enableGeneration?: boolean;
    deckType: CollectionTypes;
    elementType: CollectionTypes;
    viewMode: "table" | "cards";
    viewerRole: MembershipRole;
    showGeneration: boolean;
    showFlashcards: boolean;
}

const GenericDeckDisplay = <T,>({
                                    deck,
                                    lessonName,
                                    courseName,
                                    courseId,
                                    renderItem,
                                    columns = 6,
                                    mobileColumns = 1,
                                    columnConfig,
                                    deckType,
                                    elementType,
                                    viewMode,
                                    viewerRole,
                                    showGeneration,
                                    showFlashcards,
                                }: GenericDeckDisplayProps<T>) => {
    const { data: elements, isLoading, fetchElementsData } = useElements<T>(deck.elements, elementType);
    const [isFlashcardLoading, setIsFlashcardLoading] = useState(false); 
    const [flashcardModeEnabled, setFlashcardModeEnabled] = useState(false);

    const handleExpand = () => {
        if (!elements) {
            fetchElementsData();
        }
    };

    const handleFlashcardClick = async () => {
        if (!elements) {
            setIsFlashcardLoading(true); 
            await fetchElementsData(); 
            setIsFlashcardLoading(false); 
        }
        
        setFlashcardModeEnabled(true)
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

        if (viewMode === "cards" || !columnConfig) {
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
        } else if (viewMode === "table" && columnConfig) {
            return (
                <div className="grid columns-1 gap-2">
                    <GenericTable data={elementList} columns={columnConfig} />
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
                collectionType={deckType}
                canEdit={viewerRole === MembershipRole.Owner || viewerRole === MembershipRole.Sensei || viewerRole === MembershipRole.Staff}
                actions={(
                    <>

                        {showFlashcards && 
                        <TertiaryButton 
                            iconComponent={isFlashcardLoading ?  <FaSpinner className="animate-spin text-gray-500" /> : <FaPlayCircle />}
                            onClick={handleFlashcardClick} 
                            className={"hover:bg-green-600 hover:dark:bg-green-600"}
                        />}

                        {showGeneration && 
                        <GenerationButton
                            termsDictionary={{[elementType]: deck.elements,}}
                            deckName={deck.name}
                            courseName={''}
                            courseId={''}
                            lessonName={''}
                        />}

                        <AddContentButton
                            creatorId={deck.creatorId}
                            courseId={courseId}
                            courseName={courseName}
                            lessonName={lessonName}
                            deckName={deck.name}
                        />
                        <DeleteButton
                            creatorId={deck.creatorId}
                            elementId={deck._id}
                            elementType={deckType}
                        />
                    </>
                )}
            >
                {renderContent()}


            {flashcardModeEnabled && elements &&
                <FlashcardsModal
                    onClose={() => {setFlashcardModeEnabled(false)}}
                    deck={convertArrayToFlashcardDeck<T>(Object.values(elements), deck.name, elementType)}
                />
            }
                
            </CollapsibleSection>
        </div>
    );
};

export default GenericDeckDisplay;