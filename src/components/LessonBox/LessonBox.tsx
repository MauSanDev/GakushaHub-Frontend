import React, { useState } from "react";
import {CourseData, LessonData} from "../../data/CourseData.ts";
import { FaBookOpen, FaBook, FaFileAlt, FaEdit, FaSave, FaTimes, FaBookReader } from "react-icons/fa";
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
import DeleteButton from '../DeleteButton';
import GenerationButton from "../Modals/GenerationButton.tsx";

interface LessonBoxProps {
    owner: CourseData;
    lesson: LessonData;
    showKanji: boolean;
    showWord: boolean;
    showGrammar: boolean;
    showReadings: boolean;
}

const LessonBox: React.FC<LessonBoxProps> = ({ owner, lesson, showKanji, showWord, showGrammar, showReadings }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(lesson.name || "<Title>");
    const [description, setDescription] = useState(lesson.description);
    const [previousTitle, setPreviousTitle] = useState(title);
    const [previousDescription, setPreviousDescription] = useState(description);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value);

    const enterEditMode = () => {
        setPreviousTitle(title);
        setPreviousDescription(description);
        setIsEditing(true);
    };

    const saveChanges = async () => {
        // TODO: Saving logic for Lesson update
    };

    const cancelChanges = () => {
        setTitle(previousTitle);
        setDescription(previousDescription);
        setIsEditing(false);
    };

    const noContentToShow = !(
        (showKanji && lesson.kanjiDecks.length > 0) ||
        (showWord && lesson.wordDecks.length > 0) ||
        (showGrammar && lesson.grammarDecks.length > 0) ||
        (showReadings && lesson.readingDecks.length > 0)
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border border-gray-200 transform transition-transform duration-300 hover:border-blue-400 w-full relative">
            <div className="absolute top-4 right-4 flex gap-2">

                <GenerationButton 
                    decks={[...lesson.kanjiDecks, ...lesson.grammarDecks, ...lesson.wordDecks]}
                    courseId={owner._id}
                    lessonName={lesson.name}
                    courseName={owner.name}
                />
                {/*{isEditing ? (*/}
                {/*    <>*/}
                {/*        <button*/}
                {/*            onClick={saveChanges}*/}
                {/*            className="bg-green-500 text-white p-2 rounded shadow hover:bg-green-600"*/}
                {/*        >*/}
                {/*            <FaSave />*/}
                {/*        </button>*/}
                {/*        <button*/}
                {/*            onClick={cancelChanges}*/}
                {/*            className="bg-red-500 text-white p-2 rounded shadow hover:bg-red-600"*/}
                {/*        >*/}
                {/*            <FaTimes />*/}
                {/*        </button>*/}
                {/*    </>*/}
                {/*) : (*/}
                {/*    <>*/}
                {/*        <button*/}
                {/*            onClick={enterEditMode}*/}
                {/*            className="bg-blue-500 text-white p-2 rounded shadow hover:bg-blue-600"*/}
                {/*        >*/}
                {/*            <FaEdit />*/}
                {/*        </button>*/}
                {/*        <DeleteButton*/}
                {/*            creatorId={lesson.creatorId}*/}
                {/*            elementId={lesson._id}*/}
                {/*            elementType="lesson"*/}
                {/*            redirectTo="/lessons"*/}
                {/*        />*/}
                {/*    </>*/}
                {/*)}*/}
            </div>

            {isEditing ? (
                <input
                    className="text-2xl font-bold text-blue-500 mb-2 w-full p-2 rounded capitalize"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder={"Title is required!"}
                    autoFocus
                />
            ) : (
                <h3 className="text-2xl font-bold text-blue-500 mb-2 capitalize">
                    {title}
                </h3>
            )}

            {isEditing ? (
                <textarea
                    className="text-gray-700 mb-4 w-full p-2 rounded text-sm"
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder={"Tap here to add a description..."}
                    autoFocus
                />
            ) : (
                <p className="text-gray-700 mb-4 cursor-pointer text-sm">
                    {description}
                </p>
            )}

            {noContentToShow ? (
                <p className="text-gray-500 text-center mt-4">表示するものはありません</p>
            ) : (
                <>
                    {showKanji && lesson.kanjiDecks.length > 0 && (
                        <div className="w-full">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <FaBookOpen className="text-blue-400" /> Kanji Decks:
                                </h4>
                            </div>

                            {lesson.kanjiDecks.map((element) => (
                                <GenericDeckDisplay
                                    deck={element as KanjiDeck}
                                    renderComponent={SmallKanjiBox}
                                    TableComponent={KanjiDeckTable}
                                    elementType={"kanjiDeck"}
                                    lessonData={lesson}
                                    courseData={owner}
                                />
                            ))}
                        </div>
                    )}

                    {showWord && lesson.wordDecks.length > 0 && (
                        <div className="mt-4 w-full">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <FaFileAlt className="text-red-400" /> Word Decks:
                                </h4>
                            </div>

                            {lesson.wordDecks.map((element) => (
                                <GenericDeckDisplay
                                    deck={element as WordDeck}
                                    renderComponent={SmallWordBox}
                                    TableComponent={WordDeckTable}
                                    elementType={"wordDeck"}
                                    lessonData={lesson}
                                    courseData={owner}
                                />
                            ))}
                        </div>
                    )}

                    {showGrammar && lesson.grammarDecks.length > 0 && (
                        <div className="mt-4 w-full">
                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <FaBook className="text-green-400" /> Grammar Decks:
                            </h4>

                            {lesson.grammarDecks.map((element) => (
                                <GenericDeckDisplay
                                    deck={element as GrammarDeck}
                                    renderComponent={SmallGrammarBox}
                                    columns={2}
                                    enableFlashcards={false}
                                    elementType={"grammarDeck"}
                                    lessonData={lesson}
                                    courseData={owner}
                                />
                            ))}
                        </div>
                    )}

                    {showReadings && lesson.readingDecks.length > 0 && (
                        <div className="mt-4 w-full">
                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <FaBookReader className="text-purple-400" /> Reading Decks:
                            </h4>
                            <GenericDeckDisplay
                                deck={lesson.readingDecks[0] as GenerationDeck}
                                renderComponent={SimpleReadingBox}
                                enableFlashcards={false}
                                elementType={"generation"}
                                lessonData={lesson}
                                courseData={owner}
                                enableGeneration={false}
                            />
                        </div>
                    )}
                </>
            )}
            
        </div>
    );
};

export default LessonBox;