/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useEffect } from 'react';
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

interface DeckContainerProps {
    ids: string[];
    collectionType: CollectionTypes.KanjiDeck | CollectionTypes.WordDeck | CollectionTypes.GrammarDeck | CollectionTypes.ReadingDeck;
    viewMode: "table" | "cards";
    viewerRole: MembershipRole;
    lessonId: string;
    courseId: string;
    sectionTitle: string;
    FaIcon: React.ComponentType<{ size?: number }>;
    iconColor?: string;
}

const DeckContainer: React.FC<DeckContainerProps> = ({
                                                         ids,
                                                         collectionType,
                                                         viewMode,
                                                         viewerRole,
                                                         lessonId,
                                                         courseId,
                                                         sectionTitle,
                                                         FaIcon,
                                                         iconColor = "text-gray-500"
                                                     }) => {
    const { data, isLoading, fetchDecks } = useDecks(ids, collectionType);

    useEffect(() => {
        fetchDecks();
    }, [fetchDecks]);

    if (isLoading) {
        return <p>Cargando decks...</p>;
    }

    if (!data || Object.keys(data).length === 0) {
        return <p>No se encontraron decks.</p>;
    }

    const config = {
        [CollectionTypes.KanjiDeck]: {
            renderItem: (element: KanjiData, index: number) => <SmallKanjiBox key={index} result={element} />,
            elementType: CollectionTypes.Kanji as CollectionTypes.Kanji,
            deckType: CollectionTypes.KanjiDeck,
            columns: 6,
            mobileColumns: 2,
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
            renderItem: (element: WordData, index: number) => <SmallWordBox key={index} result={element} />,
            elementType: CollectionTypes.Word as CollectionTypes.Word,
            deckType: CollectionTypes.WordDeck,
            columns: 6,
            mobileColumns: 2,
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
            renderItem: (element: GrammarData, index: number) => <SmallGrammarBox key={index} result={element} />,
            elementType: CollectionTypes.Grammar as CollectionTypes.Grammar,
            deckType: CollectionTypes.GrammarDeck,
            columns: 2,
            mobileColumns: 1,
            columnConfig: [ 
                { header: "Estructura", key: "structure" },
                { header: "Descripción", key: "description" },
                { header: "JLPT", key: "jlpt" }
            ],
        },
        [CollectionTypes.ReadingDeck]: {
            renderItem: (element: GeneratedData, index: number) => <DeckReadingDataElement key={index} result={element} />,
            elementType: CollectionTypes.Generation as CollectionTypes.Generation,
            deckType: CollectionTypes.ReadingDeck,
            columns: 1,
            mobileColumns: 1,
            columnConfig: [ 
                { header: "Texto", key: "text" },
                { header: "Tipo", key: "type" }
            ],
        },
    };

    const { renderItem, elementType, columns, mobileColumns, columnConfig, deckType } = config[collectionType];

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
                    lessonId={lessonId}
                    courseId={courseId}
                    renderItem={renderItem}
                    elementType={elementType}
                    deckType={deckType}
                    viewMode={viewMode}
                    viewerRole={viewerRole}
                    columns={columns}
                    mobileColumns={mobileColumns}
                    columnConfig={columnConfig} 
                />
            ))}
        </div>
    );
};

export default DeckContainer;