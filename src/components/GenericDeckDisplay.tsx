import { useState, useRef, useEffect, ComponentType } from "react";
import { FaTable, FaThLarge, FaPlay, FaChevronRight, FaChevronDown } from "react-icons/fa";
import FlashcardsModal from "./FlashcardsPage";
import { DeckData } from "../data/DeckData.ts";
import { FlashcardDeck } from "../data/FlashcardData.ts";
import DeleteButton from "./DeleteButton";
import GenerationButton from "./Modals/GenerationButton.tsx";

interface GenericDeckDisplayProps<T> {
    deck: DeckData<T>;
    renderComponent: ComponentType<{ result: T }>;
    TableComponent?: ComponentType<{ deck: DeckData<T> }>;
    columns?: number;
    enableFlashcards?: boolean;
    elementType: 'course' | 'lesson' | 'kanji' | 'word' | 'grammar' | 'generation' | 'kanjiDeck' | 'grammarDeck' | 'wordDeck';
}

const GenericDeckDisplay = <T,>({
                                    deck,
                                    renderComponent: RenderComponent,
                                    TableComponent,
                                    columns = 6,
                                    enableFlashcards = true,
                                    elementType, // Recibimos elementType como prop
                                }: GenericDeckDisplayProps<T>) => {
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
            if (expanded) {
                contentRef.current.style.maxHeight = `${contentRef.current.scrollHeight}px`;
            } else {
                contentRef.current.style.maxHeight = "0px";
            }
        }
    }, [expanded, viewMode]);

    const handleFlashcardMode = () => {
        const flashcardDeck = deck.convertToFlashcards();
        setFlashcardDeck(flashcardDeck);
        setFlashcardsMode(true);
    };

    const renderContent = () => {
        if (viewMode === "cards") {
            return (
                <div className={`grid grid-cols-${columns} gap-2`}>
                    {deck.elements.map((element, elemIndex) => (
                        <RenderComponent key={`${deck._id}-${elemIndex}`} result={element} />
                    ))}
                </div>
            );
        } else if (TableComponent) {
            return <TableComponent deck={deck} />;
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
                        {expanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                    </button>
                    <div className="font-bold text-gray-600">{deck.name}</div>
                    <span className="text-sm text-gray-500">({deck.elements.length} elements)</span>
                </div>
                <div className="flex gap-2">
                    {enableFlashcards && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleFlashcardMode();
                            }}
                            className="p-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
                        >
                            <FaPlay size={12} />
                        </button>
                    )}{TableComponent && (
                    <div className="flex">
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
                            <FaThLarge size={12} />
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
                            <FaTable size={12} />
                        </button>
                    </div>
                )}
                    <GenerationButton decks={[deck]}/>
                    
                    <DeleteButton
                        creatorId={deck.creatorId}
                        elementId={deck._id}
                        elementType={elementType} // Usamos elementType recibido como prop
                    />
                </div>
            </div>

            <div
                ref={contentRef}
                className={`overflow-hidden transition-max-height duration-500 ease-in-out`}
                style={{ maxHeight: expanded ? `${contentRef.current?.scrollHeight}px` : "0px" }}
            >
                {renderContent()}
            </div>
        </div>
    );
};

export default GenericDeckDisplay;