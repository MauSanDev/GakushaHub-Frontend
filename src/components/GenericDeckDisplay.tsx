import { useState, useRef, useEffect, ComponentType } from "react";
import {
    FaTable,
    FaThLarge,
    FaChevronRight,
    FaChevronDown,
    FaPlayCircle,
} from "react-icons/fa";
import FlashcardsModal from "./FlashcardsPage";
import { DeckData } from "../data/DeckData.ts";
import DeleteButton from "./DeleteButton";
import GenerationButton from "./Modals/GenerationButton.tsx";
import { CourseData, LessonData } from "../data/CourseData.ts";

interface GenericDeckDisplayProps<T> {
    courseData: CourseData;
    lessonData: LessonData;
    deck: DeckData<T>;
    renderComponent: ComponentType<{ result: T }>;
    TableComponent?: ComponentType<{ deck: DeckData<T> }>;
    columns?: number;
    enableFlashcards?: boolean;
    enableGeneration?: boolean;
    elementType: 'course' | 'lesson' | 'kanji' | 'word' | 'grammar' | 'generation' | 'kanjiDeck' | 'grammarDeck' | 'wordDeck';
}

const GenericDeckDisplay = <T,>({
                                    enableGeneration,
                                    courseData,
                                    lessonData,
                                    deck,
                                    renderComponent: RenderComponent,
                                    TableComponent,
                                    columns = 6, // Default columns for larger screens
                                    enableFlashcards = true,
                                    elementType,
                                }: GenericDeckDisplayProps<T>) => {
    const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
    const [flashcardsMode, setFlashcardsMode] = useState(false);
    const [expanded, setExpanded] = useState(false);
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
        setFlashcardsMode(true);
    };

    const renderContent = () => {
        if (viewMode === "cards") {
            return (
                <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-${columns} gap-2`}>
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
        <div className="w-full pl-3">
            {flashcardsMode && (
                <FlashcardsModal
                    deck={deck}
                    onClose={() => setFlashcardsMode(false)}
                />
            )}

            {/* Header with title and buttons */}
            <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-900 p-0.5 rounded flex-wrap">
                {/* Title and expansion toggle */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={toggleExpand}>
                    <button className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200">
                        {expanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                    </button>
                    <div className="font-bold text-gray-600 dark:text-gray-300">{deck.name}</div>
                    <span className="text-sm text-gray-500">({deck.elements.length} elements)</span>
                </div>

                {/* Buttons */}
                <div className="flex gap-0.5 items-center flex-wrap mt-2 sm:mt-0">
                    <DeleteButton
                        creatorId={deck.creatorId}
                        elementId={deck._id}
                        elementType={elementType}
                    />
                    
                    {enableGeneration && (
                        <GenerationButton
                            decks={[deck]}
                            courseId={courseData._id}
                            lessonName={lessonData.name}
                            courseName={courseData.name}
                        />
                    )}

                    {enableFlashcards && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleFlashcardMode();
                            }}
                            className="p-2 bg-blue-500 dark:bg-gray-950 text-white rounded shadow hover:bg-blue-600 dark:hover:bg-gray-800"
                        >
                            <FaPlayCircle size={12} />
                        </button>
                    )}

                    {TableComponent && (
                        <div className="flex">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setViewMode("cards");
                                }}
                                className={`p-2 rounded-l-md ${
                                    viewMode === "cards"
                                        ? "bg-blue-500 dark:bg-gray-700 text-white"
                                        : "bg-gray-200 dark:bg-gray-950 text-gray-600 dark:text-gray-300 hover:bg-gray-300"
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
                                        ? "bg-blue-500 dark:bg-gray-700 text-white"
                                        : "bg-gray-200 dark:bg-gray-950 text-gray-600 dark:text-gray-300 hover:bg-gray-300"
                                }`}
                            >
                                <FaTable size={12} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content (cards or table) */}
            <div
                ref={contentRef}
                className="overflow-scroll transition-max-height duration-500 ease-in-out"
                style={{ maxHeight: expanded ? `${contentRef.current?.scrollHeight}px` : "0px" }}
            >
                {renderContent()}
            </div>
        </div>
    );
};

export default GenericDeckDisplay;