import { useState } from "react";
import { FaTable, FaThLarge, FaPlay, FaChevronRight, FaChevronDown } from "react-icons/fa";
import SmallKanjiBox from "../SmallKanjiBox";
import SmallWordBox from "../SmallWordBox";
import DeckTable from "../DeckTable";
import { KanjiDeck, WordDeck } from "../../data/data-structures";
import FlashcardsModal from "../FlashcardsPage";

interface DeckDisplayProps<T extends "kanji" | "word"> {
    deckType: T;
    decks: T extends "kanji" ? KanjiDeck[] : WordDeck[];
}

const DeckDisplay = <T extends "kanji" | "word">({ deckType, decks }: DeckDisplayProps<T>) => {
    const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
    const [flashcardsMode, setFlashcardsMode] = useState(false);
    const [expandedDecks, setExpandedDecks] = useState<{ [key: string]: boolean }>({});

    const toggleExpand = (deckId: string) => {
        setExpandedDecks((prevState) => ({
            ...prevState,
            [deckId]: !prevState[deckId],
        }));
    };

    const renderContent = (deckId: string) => {
        if (viewMode === "cards") {
            return (
                <div className="grid grid-cols-6 gap-2 fixed">
                    {decks.find((deck) => deck._id === deckId)?.elements.map((element, elemIndex) => (
                        deckType === "kanji" ? (
                            <SmallKanjiBox key={`${element._id}-${elemIndex}`} result={element._id} />
                        ) : (
                            <SmallWordBox key={`${element._id}-${elemIndex}`} result={element._id} />
                        )
                    ))}
                </div>
            );
        } else {
            return <DeckTable deckType={deckType} decks={decks.filter((deck) => deck._id === deckId)} />;
        }
    };

    return (
        <div className="w-full">
            {flashcardsMode && (
                <FlashcardsModal
                    deckType={deckType}
                    decks={decks}
                    onClose={() => setFlashcardsMode(false)}
                />
            )}

            {decks.map((deck, index) => (
                <div key={`${deck._id}-${index}`} className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => toggleExpand(deck._id)}
                        >
                            <button className="text-gray-600 hover:text-gray-800">
                                {expandedDecks[deck._id] ? <FaChevronDown /> : <FaChevronRight />}
                            </button>
                            <div className="font-bold text-gray-600">{deck.name}</div>
                            <span className="text-sm text-gray-500">({deck.elements.length} elements)</span>
                        </div>
                        <div className="flex gap-0">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFlashcardsMode(true);
                                }}
                                className="p-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 mr-2"
                            >
                                <FaPlay />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setViewMode("cards");
                                }}
                                className={`p-2 rounded-l-md ${
                                    viewMode === "cards"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                }`}
                            >
                                <FaThLarge />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setViewMode("table");
                                }}
                                className={`p-2 rounded-r-md ${
                                    viewMode === "table"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                }`}
                            >
                                <FaTable />
                            </button>
                        </div>
                    </div>

                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            expandedDecks[deck._id] ? "max-h-screen" : "max-h-0"
                        }`}
                    >
                        {expandedDecks[deck._id] && renderContent(deck._id)}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DeckDisplay;