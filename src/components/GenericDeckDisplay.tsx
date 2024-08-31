import { useState, useRef, useEffect, ComponentType } from "react";
import { FaTable, FaThLarge, FaPlay, FaChevronRight, FaChevronDown } from "react-icons/fa";
// import DeckTable from "./DeckTable";
import FlashcardsModal from "./FlashcardsPage";
import { DeckData } from "../data/DeckData.ts";
import { FlashcardDeck } from "../data/FlashcardData.ts";

interface GenericDeckDisplayProps<T> {
    deck: DeckData<T>;
    renderComponent: ComponentType<{ result: T }>;
}

const GenericDeckDisplay = <T,>({ deck, renderComponent: RenderComponent }: GenericDeckDisplayProps<T>) => {
    const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
    const [flashcardsMode, setFlashcardsMode] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [flashcardDeck, setFlashcardDeck] = useState<FlashcardDeck | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    const toggleExpand = () => {
        setExpanded((prev) => !prev);
    };

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.style.maxHeight = expanded ? `${contentRef.current.scrollHeight}px` : "0px";
        }
    }, [expanded]);

    const handleFlashcardMode = () => {
        const flashcardDeck = deck.convertToFlashcards()
        setFlashcardDeck(flashcardDeck);
        setFlashcardsMode(true);
    };

    const renderContent = () => {
        if (viewMode === "cards") {
            return (
                <div className="grid grid-cols-6 gap-2">
                    {deck.elements.map((element, elemIndex) => (
                        <RenderComponent key={`${deck._id}-${elemIndex}`} result={element} />
                    ))}
                </div>
            );
        } else {
            return (
                <div>
                    {/*<DeckTable deckType={deck.name} decks={[deck]} />*/}
                </div>
            );
        }
    };

    return (
        <div className="w-full mb-6">
            {flashcardsMode && flashcardDeck && (
                <FlashcardsModal
                    deck={flashcardDeck}
                    onClose={() => setFlashcardsMode(false)}
                />
            )}

            <div className="flex justify-between items-center mb-2">
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={toggleExpand}
                >
                    <button className="text-gray-600 hover:text-gray-800">
                        {expanded ? <FaChevronDown /> : <FaChevronRight />}
                    </button>
                    <div className="font-bold text-gray-600">{deck.name}</div>
                    <span className="text-sm text-gray-500">({deck.elements.length} elements)</span>
                </div>
                <div className="flex gap-0">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleFlashcardMode();
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
                ref={contentRef}
                className={`overflow-hidden transition-all duration-500 ease-in-out`}
                style={{
                    maxHeight: expanded ? `${contentRef.current?.scrollHeight}px` : "0px",
                }}
            >
                {renderContent()}
            </div>
        </div>
    );
};

export default GenericDeckDisplay;