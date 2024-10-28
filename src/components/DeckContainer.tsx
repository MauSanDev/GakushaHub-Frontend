/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, {useEffect, useCallback, useState} from 'react';
import { CollectionTypes } from '../data/CollectionTypes';
import { useDecks } from '../hooks/newHooks/Courses/useDecks.ts';
import GenericDeckDisplay from './GenericDeckDisplay';
import SmallKanjiBox from './SmallKanjiBox';
import SmallWordBox from './SmallWordBox';
import SmallGrammarBox from './SmallGrammarBox';
import DeckReadingDataElement from './DeckReadingDataElement';
import { MembershipRole } from "../data/MembershipData.ts";
import { KanjiData } from "../data/KanjiData.ts";
import { WordData } from "../data/WordData.ts";
import { GrammarData } from "../data/GrammarData.ts";
import { GeneratedData } from "../data/GenerationData.ts";
import LocSpan from './LocSpan';
import NoDataMessage from "./NoDataMessage.tsx";
import LoadingScreen from "./LoadingScreen.tsx";
import {useUpdateList} from "../hooks/updateHooks/useUpdateList.ts";
import {useNavigate} from "react-router-dom";

interface DeckContainerProps {
    ids: string[];
    collectionType: CollectionTypes.KanjiDeck | CollectionTypes.WordDeck | CollectionTypes.GrammarDeck | CollectionTypes.ReadingDeck;
    viewMode: "table" | "cards";
    viewerRole: MembershipRole;
    lessonName: string;
    courseName: string;
    courseId: string;
    sectionTitle: string;
    FaIcon: React.ComponentType<{ size?: number }>;
    iconColor?: string;
    onFetchComplete?: (fetchedElements: Record<CollectionTypes, string[]>) => void;
    onDelete?: (elementId: string, collectionType: CollectionTypes) => void;
}

const DeckContainer: React.FC<DeckContainerProps> = ({
                                                         ids,
                                                         collectionType,
                                                         viewMode,
                                                         viewerRole,
                                                         lessonName,
                                                         courseName,
                                                         courseId,
                                                         sectionTitle,
                                                         FaIcon,
                                                         iconColor = "description-gray-500",
                                                         onFetchComplete,
                                                         onDelete
                                                     }) => {
    const { data, isLoading, fetchDecks } = useDecks(ids, collectionType);
    const [selectedItems, setSelectedItems] = useState<{ [deckId: string]: string[] }>({});
    const { mutate: removeElementsFromDeck } = useUpdateList();
    const navigate = useNavigate();


    useEffect(() => {
        fetchDecks();
    }, [fetchDecks]);
    
    const onRemoveElements = (deckId: string, collectionType: CollectionTypes) => {
        const confirmDelete = window.confirm("Are you sure you want to remove elements from the deck? There's no turning back.");
        if (confirmDelete) {
            removeElementsFromDeck({
                collection: collectionType,
                documentId: deckId,
                field: 'elements',
                value: selectedItems[deckId],
                action: 'remove'
            });

            navigate(0);
        }
    };
    
    const handleRemoveReading = (deckId: string,  readingId: string) => {
        removeElementsFromDeck({
            collection: CollectionTypes.ReadingDeck,
            documentId: deckId,
            field: 'elements',
            value: [readingId],
            action: 'remove'
        });
    }
    
    const handleItemClick = (deckId: string, elementId: string) => {
        setSelectedItems(prevSelected => {
            const deckItems = prevSelected[deckId] || [];

            const updatedDeckItems = deckItems.includes(elementId)
                ? deckItems.filter(id => id !== elementId)
                : [...deckItems, elementId];

            return {
                ...prevSelected,
                [deckId]: updatedDeckItems,
            };
        });
    };

    const handleFetchComplete = useCallback(() => {
        if (data && onFetchComplete) {
            //@ts-expect-error this is just for decks
            const fetchedElements: Record<CollectionTypes, string[]> = {
                [CollectionTypes.Kanji]: [],
                [CollectionTypes.Word]: [],
                [CollectionTypes.Grammar]: [],
                [CollectionTypes.ReadingDeck]: [],
            };

            Object.values(data).forEach(deck => {
                if (collectionType === CollectionTypes.KanjiDeck) {
                    fetchedElements[CollectionTypes.Kanji].push(...deck.elements);
                } else if (collectionType === CollectionTypes.WordDeck) {
                    fetchedElements[CollectionTypes.Word].push(...deck.elements);
                } else if (collectionType === CollectionTypes.GrammarDeck) {
                    fetchedElements[CollectionTypes.Grammar].push(...deck.elements);
                }
            });

            onFetchComplete(fetchedElements);
        }
    }, [data, collectionType, onFetchComplete]);

    useEffect(() => {
        // Solo llama a handleFetchComplete si hay datos
        if (data) {
            handleFetchComplete();
        }
    }, [data, handleFetchComplete]);

    if (isLoading) {
        return <LoadingScreen isLoading={isLoading} />;
    }

    if (!data || Object.keys(data).length === 0) {
        return <NoDataMessage />;
    }

    const config = {
        [CollectionTypes.KanjiDeck]: {
            renderItem: (deckId: string, element: KanjiData, index: number, canEdit: boolean) => <SmallKanjiBox 
                key={index} 
                result={element}
                onClick={() => handleItemClick(deckId, element._id)}
                isSelected={canEdit && selectedItems[deckId]?.includes(element._id) || false}
            />,
            elementType: CollectionTypes.Kanji as CollectionTypes.Kanji,
            deckType: CollectionTypes.KanjiDeck,
            columns: 6,
            mobileColumns: 2,
            showFlashcards: true,
            showGeneration: true,
            columnConfig: [
                { header: "漢字", key: "kanji" },
                {
                    header: "音読み",
                    key: "readings",
                    formatter: (readings: KanjiData['readings']) => Array.isArray(readings?.onyomi) ? readings.onyomi.join("; ") : ""
                },
                {
                    header: "訓読み",
                    key: "readings",
                    formatter: (readings: KanjiData['readings']) => Array.isArray(readings?.kunyomi) ? readings.kunyomi.join("; ") : ""
                },
                {
                    header: "意味",
                    key: "meanings",
                    formatter: (value: { en: string }[] | undefined) =>
                        Array.isArray(value) ? value.map(v => v.en).join("; ") : ""
                },
                { header: "JLPT", key: "jlpt" }
            ],
        },
        [CollectionTypes.WordDeck]: {
            renderItem: (deckId: string, element: WordData, index: number, canEdit: boolean) => <SmallWordBox key={index} result={element}
                                                                                            onClick={() => handleItemClick(deckId, element._id)}
                                                                                            isSelected={canEdit && selectedItems[deckId]?.includes(element._id) || false}/>,
            elementType: CollectionTypes.Word as CollectionTypes.Word,
            deckType: CollectionTypes.WordDeck,
            columns: 6,
            mobileColumns: 2,
            showFlashcards: true,
            showGeneration: true,
            columnConfig: [
                { header: "言葉", key: "word" },
                {
                    header: "読み方",
                    key: "readings",
                    formatter: (value: string[] | undefined) => Array.isArray(value) ? value.join("; ") : ""
                },
                {
                    header: "意味",
                    key: "meanings",
                    formatter: (value: { en: string }[] | undefined) =>
                        Array.isArray(value) ? value.map(v => v.en).join("; ") : ""
                },
                {
                    header: "Part of Speech",
                    key: "part_of_speech",
                    formatter: (value: string[] | undefined) => Array.isArray(value) ? value.join("; ") : ""
                }
            ],
        },
        [CollectionTypes.GrammarDeck]: {
            renderItem: (deckId: string, element: GrammarData, index: number, canEdit: boolean) => <SmallGrammarBox key={index} result={element}
                                                                                                  onClick={() => handleItemClick(deckId, element._id)}
                                                                                                  isSelected={canEdit && selectedItems[deckId]?.includes(element._id) || false} />,
            elementType: CollectionTypes.Grammar as CollectionTypes.Grammar,
            deckType: CollectionTypes.GrammarDeck,
            columns: 2,
            mobileColumns: 1,
            showFlashcards: false,
            showGeneration: true,
            columnConfig: [
                { header: "Estructura", key: "structure" },
                { header: "Descripción", key: "description" },
                { header: "JLPT", key: "jlpt" }
            ],
        },
        [CollectionTypes.ReadingDeck]: {
            renderItem: (deckId: string, element: GeneratedData, index: number, canEdit: boolean) => <DeckReadingDataElement key={index} result={element}
                                                                                                           onClick={() => handleItemClick(deckId, element._id)}
                                                                                                           isSelected={canEdit && selectedItems[deckId]?.includes(element._id) || false} 
                                                                                                           onDelete={(x) => handleRemoveReading(deckId, x)}/>,
            elementType: CollectionTypes.Generation as CollectionTypes.Generation,
            deckType: CollectionTypes.ReadingDeck,
            columns: 1,
            mobileColumns: 1,
            showFlashcards: false,
            showGeneration: true,
            columnConfig: [
                { header: "Texto", key: "text" },
                { header: "Tipo", key: "type" }
            ],
        },
    };

    const { renderItem, elementType, columns, mobileColumns, columnConfig, deckType, showGeneration, showFlashcards } = config[collectionType];

    return (
        <div className="mt-4 w-full">
            <div className="flex items-center mb-4 font-bold text-gray-800 dark:text-white">
                <div className={`mr-2 ${iconColor}`}>
                    <FaIcon />
                </div>
                <LocSpan textKey={sectionTitle} />
            </div>

            {Object.values(data).map((deck) => (
                <GenericDeckDisplay<typeof deck.elements[0]>
                    key={deck._id}
                    deck={deck}
                    lessonName={lessonName}
                    courseName={courseName}
                    courseId={courseId}
                    renderItem={renderItem}
                    elementType={elementType}
                    deckType={deckType}
                    viewMode={viewMode}
                    viewerRole={viewerRole}
                    columns={columns}
                    mobileColumns={mobileColumns}
                    columnConfig={columnConfig}
                    showGeneration={showGeneration}
                    showFlashcards={showFlashcards}
                    hasSelectedItems={selectedItems[deck._id]?.length > 0}
                    onRemoveElements={onRemoveElements}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default DeckContainer;