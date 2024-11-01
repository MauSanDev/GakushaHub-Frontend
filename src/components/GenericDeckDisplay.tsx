/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import {ReactNode, useState} from "react";
import {FaPen, FaPlayCircle, FaSpinner, FaTimes} from "react-icons/fa";
import DeleteButton from "./DeleteButton";
import AddContentButton from "./AddContentButton.tsx";
import {MembershipRole} from "../data/MembershipData.ts";
import {CollectionTypes} from "../data/CollectionTypes.tsx";
import {useElements} from '../hooks/newHooks/useElements';
import CollapsibleSection from "./ui/containers/CollapsibleSection";
import {BaseDeckData} from "../data/DeckData.ts";
import GenericTable from "../components/Tables/GenericTable";
import { convertArrayToFlashcardDeck } from "../data/FlashcardData.ts";
import TertiaryButton from "./ui/buttons/TertiaryButton.tsx";
import FlashcardsModal from "./FlashcardsPage";
import GenerationButton from "./Modals/GenerationButton.tsx";
import NoDataMessage from "./NoDataMessage.tsx";
import GrammarPracticeModal from "./GrammarPracticeModal/GrammarPracticeModal.tsx";
import {GrammarData} from "../data/GrammarData.ts";

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
    renderItem: (deckId: string,  element: T, index: number, canEdit: boolean) => JSX.Element;
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
    hasSelectedItems: boolean;
    onRemoveElements: (deckId: string, collectionType: CollectionTypes) => void;
    onDelete?: (elementId: string, collectionType: CollectionTypes) => void;
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
                                    hasSelectedItems,
                                    onRemoveElements,
                                    onDelete
                                }: GenericDeckDisplayProps<T>) => {
    const { data: elements, isLoading, fetchElementsData } = useElements<T>(deck.elements, elementType);
    const [isFlashcardLoading, setIsFlashcardLoading] = useState(false); 
    const [flashcardModeEnabled, setFlashcardModeEnabled] = useState(false);
    const [isGrammarLoading, setIsGrammarLoading] = useState(false); 
    const [grammarModeEnabled, setGrammarModeEnabled] = useState(false);

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
    
    const handleGrammarPracticeClick = async () => {
        if (!elements) {
            setIsGrammarLoading(true); 
            await fetchElementsData(); 
            setIsGrammarLoading(false); 
        }
        
        setGrammarModeEnabled(true)
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
            return <NoDataMessage />;
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
                    {elementList.map((element, index) => renderItem(deck._id,element, index, canEdit))}
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
    
    const canEdit = viewerRole === MembershipRole.Owner || viewerRole === MembershipRole.Sensei || viewerRole === MembershipRole.Staff;

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
                canEdit={canEdit}
                actions={(
                    <>

                        {canEdit && hasSelectedItems && <TertiaryButton
                            iconComponent={isFlashcardLoading ?  <FaSpinner className="animate-spin text-gray-500" /> : <FaTimes />}
                            onClick={() => onRemoveElements(deck._id, deckType)}
                            className={"bg-transparent dark:bg-transparent description-red-600 dark:description-red-800"}
                            label={"Remove Selected"}
                        />}

                        {deckType === CollectionTypes.GrammarDeck &&
                            <TertiaryButton
                                iconComponent={isGrammarLoading ?  <FaSpinner className="animate-spin text-gray-500" /> : <FaPen />}
                                onClick={handleGrammarPracticeClick}
                            />}
                        
                        {showFlashcards && 
                        <TertiaryButton 
                            iconComponent={isFlashcardLoading ?  <FaSpinner className="animate-spin text-gray-500" /> : <FaPlayCircle />}
                            onClick={handleFlashcardClick} 
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
                            onDelete={onDelete}
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

            {grammarModeEnabled && elements &&
                <GrammarPracticeModal
                    onClose={() => {setGrammarModeEnabled(false)}}
                    elements={Object.values(elements) as GrammarData[]}
                />
            }
            </CollapsibleSection>
        </div>
    );
};

export default GenericDeckDisplay;