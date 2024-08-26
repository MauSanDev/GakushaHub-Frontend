import React from "react";
import SmallKanjiBox from "../SmallKanjiBox";
import SmallWordBox from "../SmallWordBox";
import KanjiTable from "../KanjiTable";
import WordTable from "../WordTable";
import { KanjiDeck, WordDeck } from "../../data/data-structures";

interface DeckDisplayProps<T extends "kanji" | "word"> {
    deckType: T;
    viewMode: "table" | "cards";
    decks: T extends "kanji" ? KanjiDeck[] : WordDeck[];
}

const DeckDisplay = <T extends "kanji" | "word">({ deckType, viewMode, decks }: DeckDisplayProps<T>) => {
    const renderContent = () => {
        if (viewMode === "cards") {
            return (
                <div className="grid grid-cols-6 gap-4 w-full">
                    {decks.map((deck, index) => (
                        <div key={`${deck._id}-${index}`} className="col-span-6">
                            <div className="font-bold text-gray-600 mb-2">{deck.name}</div>
                            <div className="grid grid-cols-6 gap-2">
                                {deck.elements.map((element, elemIndex) => (
                                    deckType === "kanji" ? (
                                        <SmallKanjiBox key={`${element._id}-${elemIndex}`} result={element._id} />
                                    ) : (
                                        <SmallWordBox key={`${element._id}-${elemIndex}`} result={element._id} />
                                    )
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            );
        } else if (deckType === "kanji") {
            return <KanjiTable decks={decks as KanjiDeck[]} />;
        } else {
            return <WordTable decks={decks as WordDeck[]} />;
        }
    };

    return <>{renderContent()}</>;
};

export default DeckDisplay;