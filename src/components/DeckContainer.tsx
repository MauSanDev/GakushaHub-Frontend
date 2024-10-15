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
import LocSpan from './LocSpan'; // Importar LocSpan para el título

interface DeckContainerProps {
    ids: string[];
    collectionType: CollectionTypes.KanjiDeck | CollectionTypes.WordDeck | CollectionTypes.GrammarDeck | CollectionTypes.ReadingDeck;
    viewMode: "table" | "cards";
    viewerRole: MembershipRole;
    lessonId: string;
    courseId: string;
    sectionTitle: string; // Nuevo: Título de la sección
    FaIcon: React.ComponentType<{ size?: number }>; // Nuevo: Componente del ícono
    iconColor?: string; // Nuevo: Color del ícono (string de clases CSS como text-blue-500)
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

    // Diccionario de configuración basado en el tipo de `collectionType`
    const config = {
        [CollectionTypes.KanjiDeck]: {
            renderItem: (element: KanjiData, index: number) => <SmallKanjiBox key={index} result={element} />,
            elementType: CollectionTypes.Kanji as CollectionTypes.Kanji,
            columns: 6,
            mobileColumns: 2,
        },
        [CollectionTypes.WordDeck]: {
            renderItem: (element: WordData, index: number) => <SmallWordBox key={index} result={element} />,
            elementType: CollectionTypes.Word as CollectionTypes.Word,
            columns: 6,
            mobileColumns: 2,
        },
        [CollectionTypes.GrammarDeck]: {
            renderItem: (element: GrammarData, index: number) => <SmallGrammarBox key={index} result={element} />,
            elementType: CollectionTypes.Grammar as CollectionTypes.Grammar,
            columns: 2,
            mobileColumns: 1,
        },
        [CollectionTypes.ReadingDeck]: {
            renderItem: (element: GeneratedData, index: number) => <DeckReadingDataElement key={index} result={element} />,
            elementType: CollectionTypes.Generation as CollectionTypes.Generation,
            columns: 1,
            mobileColumns: 1,
        },
    };

    const { renderItem, elementType, columns, mobileColumns } = config[collectionType];

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
                    viewMode={viewMode}
                    viewerRole={viewerRole}
                    columns={columns}
                    mobileColumns={mobileColumns}
                />
            ))}
        </div>
    );
};

export default DeckContainer;