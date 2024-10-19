import React, { useState } from "react";
import { CourseData, LessonData } from "../data/CourseData.ts";
import { FaTable, FaThLarge, FaBookOpen, FaFileAlt, FaBook, FaEye } from "react-icons/fa";
import DeleteButton from "./DeleteButton";
import AddContentButton from "./AddContentButton.tsx";
import Container from "./ui/containers/Container.tsx";
import Editable from "./ui/text/Editable.tsx";
import { MembershipRole } from "../data/MembershipData.ts";
import DeckContainer from "./DeckContainer";
import { CollectionTypes } from "../data/CollectionTypes.tsx";
import NoDataMessage from "./NoDataMessage.tsx";
import GenerationButton from "./Modals/GenerationButton.tsx";

interface LessonDataElementProps {
    owner: CourseData;
    lesson: LessonData;
    showKanji: boolean;
    showWord: boolean;
    showGrammar: boolean;
    showReadings: boolean;
    viewerRole: MembershipRole;
}

const LessonDataElement: React.FC<LessonDataElementProps> = ({
                                                                 owner,
                                                                 lesson,
                                                                 showKanji,
                                                                 showWord,
                                                                 showGrammar,
                                                                 showReadings,
                                                                 viewerRole,
                                                             }) => {
    const [viewMode, setViewMode] = useState<"table" | "cards">("cards");

    // Estados para almacenar los elementos de los decks
    const [kanjiElements, setKanjiElements] = useState<string[]>([]);
    const [wordElements, setWordElements] = useState<string[]>([]);
    const [grammarElements, setGrammarElements] = useState<string[]>([]);
    const [readingElements, setReadingElements] = useState<string[]>([]);

    const noContentToShow = !(
        (showKanji && lesson.kanjiDecks.length > 0) ||
        (showWord && lesson.wordDecks.length > 0) ||
        (showGrammar && lesson.grammarDecks.length > 0) ||
        (showReadings && lesson.readingDecks.length > 0)
    );

    const canEdit = viewerRole === MembershipRole.Owner || viewerRole === MembershipRole.Sensei || viewerRole === MembershipRole.Staff;

    const handleSetElements = (newElements: string[], setElements: React.Dispatch<React.SetStateAction<string[]>>, currentElements: string[]) => {
        if (JSON.stringify(newElements) !== JSON.stringify(currentElements)) {
            setElements(newElements);
        }
    };

    return (
        <Container>
            <div className="absolute top-4 right-4 flex gap-0.5 flex-wrap items-center">
                {/* Pasamos los elementos obtenidos a GenerationButton */}
                <GenerationButton
                    termsDictionary={{
                        [CollectionTypes.Kanji]: kanjiElements,
                        [CollectionTypes.Word]: wordElements,
                        [CollectionTypes.Grammar]: grammarElements,
                        [CollectionTypes.Generation]: readingElements,
                    }}
                    deckName={lesson.name}
                    courseName={owner.name}
                    courseId={owner._id}
                    lessonName={lesson.name}
                />

                <AddContentButton
                    creatorId={lesson.creatorId}
                    courseId={owner._id}
                    courseName={owner.name}
                    lessonName={lesson.name}
                />

                <DeleteButton
                    creatorId={lesson.creatorId}
                    elementId={lesson._id}
                    elementType={CollectionTypes.Lesson}
                    redirectTo={`/courses/${owner._id}`}
                    extraParams={{ courseId: owner._id }}
                />

                <div className="flex">
                    <button
                        onClick={() => setViewMode("cards")}
                        className={`p-2 rounded-l-md ${
                            viewMode === "cards"
                                ? "bg-blue-500 dark:bg-gray-700 text-white"
                                : "bg-gray-200 dark:bg-gray-950 text-gray-600 dark:text-gray-300 hover:bg-gray-300"
                        }`}
                    >
                        <FaThLarge size={12} />
                    </button>
                    <button
                        onClick={() => setViewMode("table")}
                        className={`p-2 rounded-r-md ${
                            viewMode === "table"
                                ? "bg-blue-500 dark:bg-gray-700 text-white"
                                : "bg-gray-200 dark:bg-gray-950 text-gray-600 dark:text-gray-300 hover:bg-gray-300"
                        }`}
                    >
                        <FaTable size={12} />
                    </button>
                </div>
            </div>

            <Editable
                initialValue={lesson.name}
                collection={CollectionTypes.Lesson}
                documentId={lesson._id || ''}
                field="name"
                className="lg:text-2xl text-xl font-bold text-blue-400 dark:text-white mb-2 capitalize pt-8"
                canEdit={canEdit}
                maxChar={40}
            />

            <Editable
                initialValue={lesson.description}
                collection={CollectionTypes.Lesson}
                documentId={lesson._id || ''}
                field="description"
                className="text-gray-700 mb-4 text-sm"
                canEdit={canEdit}
                maxChar={400}
                placeholder={"Add a Description"}
            />

            {noContentToShow ? canEdit ? (
                <AddContentButton
                    creatorId={lesson.creatorId}
                    courseId={owner._id}
                    courseName={owner.name}
                    lessonName={lesson.name}
                    useDottedBox={true}
                />
            ) : (
                <NoDataMessage />
            ) : (
                <>
                    {showKanji && lesson.kanjiDecks.length > 0 && (
                        <DeckContainer
                            ids={lesson.kanjiDecks}
                            collectionType={CollectionTypes.KanjiDeck}
                            viewMode={viewMode}
                            viewerRole={viewerRole}
                            lessonName={lesson.name}
                            courseName={owner.name}
                            courseId={owner._id}
                            FaIcon={FaBookOpen}
                            sectionTitle="kanjiDecks"
                            iconColor="text-blue-500"
                            onFetchComplete={(fetchedElements) =>
                                handleSetElements(fetchedElements[CollectionTypes.Kanji], setKanjiElements, kanjiElements)
                            }
                        />
                    )}

                    {showWord && lesson.wordDecks.length > 0 && (
                        <DeckContainer
                            ids={lesson.wordDecks}
                            collectionType={CollectionTypes.WordDeck}
                            viewMode={viewMode}
                            viewerRole={viewerRole}
                            lessonName={lesson.name}
                            courseName={owner.name}
                            courseId={owner._id}
                            FaIcon={FaFileAlt}
                            sectionTitle="wordDecks"
                            iconColor="text-red-500"
                            onFetchComplete={(fetchedElements) =>
                                handleSetElements(fetchedElements[CollectionTypes.Word], setWordElements, wordElements)
                            }
                        />
                    )}

                    {showGrammar && lesson.grammarDecks.length > 0 && (
                        <DeckContainer
                            ids={lesson.grammarDecks}
                            collectionType={CollectionTypes.GrammarDeck}
                            viewMode={viewMode}
                            viewerRole={viewerRole}
                            lessonName={lesson.name}
                            courseName={owner.name}
                            courseId={owner._id}
                            FaIcon={FaBook}
                            sectionTitle="grammarDecks"
                            iconColor="text-green-500"
                            onFetchComplete={(fetchedElements) =>
                                handleSetElements(fetchedElements[CollectionTypes.Grammar], setGrammarElements, grammarElements)
                            }
                        />
                    )}

                    {showReadings && lesson.readingDecks.length > 0 && (
                        <DeckContainer
                            ids={lesson.readingDecks}
                            collectionType={CollectionTypes.ReadingDeck}
                            viewMode={viewMode}
                            viewerRole={viewerRole}
                            lessonName={lesson.name}
                            courseName={owner.name}
                            courseId={owner._id}
                            FaIcon={FaEye}
                            sectionTitle="readingDecks"
                            iconColor="text-yellow-500"
                            onFetchComplete={(fetchedElements) =>
                                handleSetElements(fetchedElements[CollectionTypes.ReadingDeck], setReadingElements, readingElements)
                            }
                        />
                    )}
                </>
            )}
        </Container>
    );
};

export default LessonDataElement;