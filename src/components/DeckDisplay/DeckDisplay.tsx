import { useState } from "react";
import SmallKanjiBox from "../SmallKanjiBox";
import SmallWordBox from "../SmallWordBox";
import DeckTable from "../DeckTable";
import { KanjiDeck, WordDeck } from "../../data/data-structures";
import { FaTable, FaThLarge } from "react-icons/fa";

interface DeckDisplayProps<T extends "kanji" | "word"> {
    deckType: T;
    decks: T extends "kanji" ? KanjiDeck[] : WordDeck[];
}

const DeckDisplay = <T extends "kanji" | "word">({ deckType, decks }: DeckDisplayProps<T>) => {
    // Manejamos el estado de cada deck individualmente
    const [viewModes, setViewModes] = useState<Record<string, "table" | "cards">>(
        decks.reduce((acc, deck) => {
            acc[deck._id] = "cards"; // Por defecto, todos los decks inician en modo "cards"
            return acc;
        }, {} as Record<string, "table" | "cards">)
    );

    const toggleViewMode = (deckId: string) => {
        setViewModes((prevModes) => ({
            ...prevModes,
            [deckId]: prevModes[deckId] === "cards" ? "table" : "cards",
        }));
    };

    const renderContent = (deck: KanjiDeck | WordDeck) => {
        const viewMode = viewModes[deck._id];
        if (viewMode === "cards") {
            return (
                <div className="grid grid-cols-6 gap-2">
                    {deck.elements.map((element, elemIndex) =>
                        deckType === "kanji" ? (
                            <SmallKanjiBox key={`${element._id}-${elemIndex}`} result={element._id} />
                        ) : (
                            <SmallWordBox key={`${element._id}-${elemIndex}`} result={element._id} />
                        )
                    )}
                </div>
            );
        } else {
            return <DeckTable deckType={deckType} decks={[deck]} />;
        }
    };

    return (
        <div className="w-full">
            {decks.map((deck) => (
                <div key={deck._id} className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <div className="font-bold text-gray-600">{deck.name}</div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => toggleViewMode(deck._id)}
                                className={`p-2 rounded-l-md ${
                                    viewModes[deck._id] === "cards"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                }`}
                            >
                                <FaThLarge />
                            </button>
                            <button
                                onClick={() => toggleViewMode(deck._id)}
                                className={`p-2 rounded-r-md ${
                                    viewModes[deck._id] === "table"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                }`}
                            >
                                <FaTable />
                            </button>
                        </div>
                    </div>
                    {renderContent(deck)}
                </div>
            ))}
        </div>
    );
};

export default DeckDisplay;