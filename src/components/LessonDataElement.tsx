/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useState } from "react";
import { CourseData, LessonData } from "../../data/CourseData.ts";
import {
    FaBookOpen,
    FaBook,
    FaFileAlt,
    FaTable,
    FaThLarge, FaEye,
} from "react-icons/fa";
import GenericDeckDisplay from "./GenericDeckDisplay";
import SmallKanjiBox from "./SmallKanjiBox";
import SmallWordBox from "./SmallWordBox";
import SmallGrammarBox from "./SmallGrammarBox";
import DeckReadingDataElement from "./DeckReadingDataElement.tsx";
import KanjiDeckTable from "./Tables/KanjiDeckTable";
import WordDeckTable from "./Tables/WordDeckTable";
import { KanjiDeck } from "../data/KanjiData.ts";
import { WordDeck } from "../data/WordData.ts";
import { GrammarDeck } from "../data/GrammarData.ts";
import { GenerationDeck } from "../data/GenerationData.ts";
import DeleteButton from "./DeleteButton";
import GenerationButton from "./Modals/GenerationButton.tsx";
import AddContentButton from "./AddContentButton.tsx";
import LocSpan from "./LocSpan.tsx";
import Container from "./ui/containers/Container.tsx";

interface LessonDataElementProps {
    owner: CourseData;
    lesson: LessonData;
    showKanji: boolean;
    showWord: boolean;
    showGrammar: boolean;
    showReadings: boolean;
}

const LessonDataElement: React.FC<LessonDataElementProps> = ({
                                                 owner,
                                                 lesson,
                                                 showKanji,
                                                 showWord,
                                                 showGrammar,
                                                 showReadings,
                                             }) => {
    const [viewMode, setViewMode] = useState<"table" | "cards">("cards");

    const noContentToShow = !(
        (showKanji && lesson.kanjiDecks.length > 0) ||
        (showWord && lesson.wordDecks.length > 0) ||
        (showGrammar && lesson.grammarDecks.length > 0) ||
        (showReadings && lesson.readingDecks.length > 0)
    );

    return (
        <Container>
            <div className="absolute top-4 right-4 flex gap-0.5 flex-wrap items-center">
                <AddContentButton 
                    creatorId={lesson.creatorId._id}
                    courseId={owner._id}
                    courseName={owner.name}
                    lessonName={lesson.name}
                />
                
                <DeleteButton
                    creatorId={lesson.creatorId._id}
                    elementId={lesson._id}
                    elementType="lesson"
                    redirectTo={`/courses/${owner._id}`}
                />

                <GenerationButton
                    decks={[...lesson.kanjiDecks, ...lesson.grammarDecks, ...lesson.wordDecks]}
                    courseId={owner._id}
                    lessonName={lesson.name}
                    courseName={owner.name}
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
                        <FaThLarge size={12}/>
                    </button>
                    <button
                        onClick={() => setViewMode("table")}
                        className={`p-2 rounded-r-md ${
                            viewMode === "table"
                                ? "bg-blue-500 dark:bg-gray-700 text-white"
                                : "bg-gray-200 dark:bg-gray-950 text-gray-600 dark:text-gray-300 hover:bg-gray-300"
                        }`}
                    >
                        <FaTable size={12}/>
                    </button>
                </div>

            </div>

            <h3 className="lg:text-2xl text-xl font-bold text-blue-400 dark:text-white mb-2 capitalize pt-8">
                {lesson.name}
            </h3>

            <p className="text-gray-700 mb-4 text-sm">
                {lesson.description}
            </p>

            {noContentToShow ? (
                <p className="text-gray-500 text-center mt-4">表示するものはありません</p>
            ) : (
                <>
                {showKanji && lesson.kanjiDecks.length > 0 && (
                        <div className="w-full">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                <FaBookOpen className="text-blue-400" /><LocSpan textKey={"kanjiDecks"}/>:
                            </h4>

                            {lesson.kanjiDecks.map((element) => (
                                <GenericDeckDisplay
                                    key={element._id}
                                    deck={element as KanjiDeck}
                                    renderComponent={SmallKanjiBox}
                                    TableComponent={KanjiDeckTable}
                                    elementType={"kanjiDeck"}
                                    lessonData={lesson}
                                    courseData={owner}
                                    enableGeneration={true}
                                    viewMode={viewMode}
                                    columns={6}
                                    mobileColumns={2}
                                />
                            ))}
                        </div>
                    )}

                    {showWord && lesson.wordDecks.length > 0 && (
                        <div className="mt-4 w-full">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                <FaFileAlt className="text-red-400" /> <LocSpan textKey={"wordDecks"}/>:
                            </h4>

                            {lesson.wordDecks.map((element) => (
                                <GenericDeckDisplay
                                    key={element._id}
                                    deck={element as WordDeck}
                                    renderComponent={SmallWordBox}
                                    TableComponent={WordDeckTable}
                                    enableGeneration={true}
                                    elementType={"wordDeck"}
                                    lessonData={lesson}
                                    courseData={owner}
                                    viewMode={viewMode}
                                    columns={6}
                                    mobileColumns={2}
                                />
                            ))}
                        </div>
                    )}

                    {showGrammar && lesson.grammarDecks.length > 0 && (
                        <div className="mt-4 w-full">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                                <FaBook className="text-green-400" /> <LocSpan textKey={"grammarDecks"}/>:
                            </h4>

                            {lesson.grammarDecks.map((element) => (
                                <GenericDeckDisplay
                                    key={element._id}
                                    deck={element as GrammarDeck}
                                    renderComponent={SmallGrammarBox}
                                    columns={2}
                                    enableFlashcards={false}
                                    elementType={"grammarDeck"}
                                    lessonData={lesson}
                                    courseData={owner}
                                    enableGeneration={true}
                                    viewMode={viewMode}
                                />
                            ))}
                        </div>
                    )}

                    {showReadings && lesson.readingDecks.length > 0 && (
                        <div className="mt-4 w-full">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                                <FaEye className="text-yellow-400"/>
                                <LocSpan textKey={"readingDecks"}/>:
                            </h4>

                            {lesson.readingDecks.map((element) => (
                                <GenericDeckDisplay
                                    key={element._id}
                                    deck={element as GenerationDeck}
                                    renderComponent={DeckReadingDataElement}
                                    columns={1}
                                    enableFlashcards={false}
                                    elementType={"generation"}
                                    lessonData={lesson}
                                    courseData={owner}
                                    enableGeneration={true}
                                    viewMode={viewMode}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </Container>
    );
};

export default LessonDataElement;