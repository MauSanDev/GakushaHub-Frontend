import { useState, useRef, useEffect, ComponentType } from "react";
import {
    FaChevronRight,
    FaChevronDown,
    FaPlayCircle,
} from "react-icons/fa";
import FlashcardsModal from "./FlashcardsPage";
import GrammarModal from "./GrammarPracticeModal/GrammarPracticeModal.tsx"; // Asegúrate de importar tu modal de gramática
import { DeckData } from "../data/DeckData.ts";
import DeleteButton from "./DeleteButton";
import GenerationButton from "./Modals/GenerationButton.tsx";
import { CourseData, LessonData } from "../data/CourseData.ts";
import AddContentButton from "./AddContentButton.tsx";

interface GenericDeckDisplayProps<T> {
    courseData: CourseData;
    lessonData: LessonData;
    deck: DeckData<T>;
    renderComponent: ComponentType<{ result: T }>;
    TableComponent?: ComponentType<{ deck: DeckData<T> }>;
    columns?: number;
    mobileColumns?: number;
    enableFlashcards?: boolean;
    enableGeneration?: boolean;
    elementType: 'course' | 'lesson' | 'kanji' | 'word' | 'grammar' | 'generation' | 'kanjiDeck' | 'grammarDeck' | 'wordDeck';
    viewMode: "table" | "cards";
}

const GenericDeckDisplay = <T,>({
                                    enableGeneration,
                                    courseData,
                                    lessonData,
                                    deck,
                                    renderComponent: RenderComponent,
                                    TableComponent,
                                    columns = 6,
                                    mobileColumns = 1,
                                    enableFlashcards = true,
                                    elementType,
                                    viewMode,
                                }: GenericDeckDisplayProps<T>) => {
    const [flashcardsMode, setFlashcardsMode] = useState(false);
    const [grammarModalVisible, setGrammarModalVisible] = useState(false); // Estado para el modal de gramática
    const [expanded, setExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const contentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleExpand = () => {
        setExpanded((prev) => !prev);
    };

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.style.maxHeight = expanded
                ? `${contentRef.current.scrollHeight}px`
                : "0px";
        }
    }, [expanded, viewMode]);

    const handleFlashcardMode = () => {
        setFlashcardsMode(true);
    };

    const handleOpenGrammarModal = () => {
        setGrammarModalVisible(true);
    };

    const renderContent = () => {
        if (viewMode === "cards" || !TableComponent) {
            return (
                <div className={`grid gap-2`} style={{gridTemplateColumns: `repeat(${isMobile ? mobileColumns : columns}, minmax(0, 1fr))`}}>
                    {deck.elements.map((element, elemIndex) => (
                        <RenderComponent key={`${deck._id}-${elemIndex}`} result={element} />
                    ))}
                </div>
            );
        } else if (viewMode === "table" && TableComponent) {
            return (<div className={`grid columns-1 gap-2`}>
                <TableComponent deck={deck} />;
            </div>)
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

            {grammarModalVisible && (
                <GrammarModal
                    deck={deck}
                    onClose={() => setGrammarModalVisible(false)}
                />
            )}

            <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-900 p-0.5 rounded">
                <div className="flex items-center gap-2 cursor-pointer" onClick={toggleExpand}>
                    <button className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200">
                        {expanded ? <FaChevronDown size={12}/> : <FaChevronRight size={12}/>}
                    </button>
                    <div
                        className="font-bold text-gray-600 dark:text-gray-300 truncate flex-grow lg:max-w-xl max-w-32">
                        {deck.name}
                    </div>
                    <span className="text-sm text-gray-500">({deck.elements.length} cards)</span>
                </div>

                <div className="flex gap-0.5 items-center flex-wrap mt-2 sm:mt-0">
                    
                    <AddContentButton
                        creatorId={deck.creatorId}
                        courseId={courseData._id}
                        courseName={courseData.name}
                        lessonName={lessonData.name}
                        deckName={deck.name}
                        />
                    
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

                    {enableFlashcards && elementType !== "grammarDeck" && ( // Botón de flashcards solo si no es grammar
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleFlashcardMode();
                            }}
                            className="p-2 bg-blue-500 dark:bg-gray-950 text-white rounded shadow hover:bg-blue-600 dark:hover:bg-gray-800"
                        >
                            <FaPlayCircle size={12}/>
                        </button>
                    )}

                    {elementType === "grammarDeck" && ( // Botón de gramática
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOpenGrammarModal();
                            }}
                            className="p-2 bg-green-500 dark:bg-gray-950 text-white rounded shadow hover:bg-green-600 dark:hover:bg-gray-800"
                        >
                            <FaPlayCircle size={12}/>
                        </button>
                    )}
                </div>
            </div>

            <div
                ref={contentRef}
                className="overflow-hidden transition-max-height duration-500 ease-in-out"
                style={{maxHeight: expanded ? `${contentRef.current?.scrollHeight}px` : "0px"}}
            >
                {renderContent()}
            </div>
        </div>
    );
};

export default GenericDeckDisplay;