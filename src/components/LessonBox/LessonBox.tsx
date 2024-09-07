import React, { useState } from "react";
import { CourseData, LessonData } from "../../data/CourseData.ts";
import {
    FaBookOpen,
    FaBook,
    FaFileAlt,
    FaBookReader,
    FaTable,
    FaThLarge,
} from "react-icons/fa";
import GenericDeckDisplay from "../GenericDeckDisplay";
import SmallKanjiBox from "../SmallKanjiBox";
import SmallWordBox from "../SmallWordBox";
import SmallGrammarBox from "../SmallGrammarBox";
import SimpleReadingBox from "../SimpleReadingBox";
import KanjiDeckTable from "../Tables/KanjiDeckTable";
import WordDeckTable from "../Tables/WordDeckTable";
import { KanjiDeck } from "../../data/KanjiData.ts";
import { WordDeck } from "../../data/WordData.ts";
import { GrammarDeck } from "../../data/GrammarData.ts";
import { GenerationDeck } from "../../data/GenerationData.ts";
import DeleteButton from "../DeleteButton";
import GenerationButton from "../Modals/GenerationButton.tsx";

interface LessonBoxProps {
    owner: CourseData;
    lesson: LessonData;
    showKanji: boolean;
    showWord: boolean;
    showGrammar: boolean;
    showReadings: boolean;
}

const LessonBox: React.FC<LessonBoxProps> = ({
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
        <div className="relative p-6 pb-26 rounded-lg shadow-md text-left border-2 transform transition-transform duration-300 bg-white dark:bg-gray-900 hover:border-blue-300 hover:dark:border-gray-700 border-gray-200 dark:border-gray-800">
            <div className="absolute top-4 right-4 flex gap-0.5 flex-wrap items-center">

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
                                <FaBookOpen className="text-blue-400" /> Kanji Decks:
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
                                <FaFileAlt className="text-red-400" /> Word Decks:
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
                                <FaBook className="text-green-400" /> Grammar Decks:
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
                                <FaBookReader className="text-purple-400" /> Reading Decks:
                            </h4>
                            <GenericDeckDisplay
                                deck={lesson.readingDecks[0] as GenerationDeck}
                                renderComponent={SimpleReadingBox}
                                enableFlashcards={false}
                                elementType={"generation"}
                                columns={1}
                                lessonData={lesson}
                                courseData={owner}
                                enableGeneration={false}
                                viewMode={viewMode}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default LessonBox;