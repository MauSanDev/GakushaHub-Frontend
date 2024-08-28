import React, { useState } from "react";
import { LessonData } from "../../data/data-structures.tsx";
import { FaBookOpen, FaBook, FaFileAlt, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import DeckDisplay from "../DeckDisplay";
import GrammarDeckDisplay from "../GrammarDeckDisplay"; // Importamos el nuevo componente

interface LessonBoxProps {
    lesson: LessonData;
    onUpdateLesson: (updatedLesson: LessonData) => void;
}

const LessonBox: React.FC<LessonBoxProps> = ({ lesson, onUpdateLesson }) => {
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
        if (!title.trim()) {
            setTitle(previousTitle); // Revert to previous title if empty
        } else {
            try {
                const response = await fetch(`http://localhost:3000/api/lessons/${lesson._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name: title, description }),
                });

                if (!response.ok) {
                    throw new Error("Error al guardar los cambios.");
                }

                const updatedLesson = await response.json();
                onUpdateLesson(updatedLesson);
                setIsEditing(false);
            } catch (error) {
                console.error("Error al guardar los cambios:", error);
            }
        }
    };

    const cancelChanges = () => {
        setTitle(previousTitle);
        setDescription(previousDescription);
        setIsEditing(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border border-gray-200 transform transition-transform duration-300 hover:border-blue-400 w-full relative">
            {/* Botones de edición, guardado y cancelación */}
            <div className="absolute top-4 right-4 flex gap-2">
                {isEditing ? (
                    <>
                        <button
                            onClick={saveChanges}
                            className="bg-green-500 text-white p-2 rounded shadow hover:bg-green-600"
                        >
                            <FaSave />
                        </button>
                        <button
                            onClick={cancelChanges}
                            className="bg-red-500 text-white p-2 rounded shadow hover:bg-red-600"
                        >
                            <FaTimes />
                        </button>
                    </>
                ) : (
                    <button
                        onClick={enterEditMode}
                        className="bg-blue-500 text-white p-2 rounded shadow hover:bg-blue-600"
                    >
                        <FaEdit />
                    </button>
                )}
            </div>

            {/* Título con capitalización automática */}
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

            {/* Descripción editable */}
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

            {/* Kanji Decks */}
            {lesson.kanjiDecks.length > 0 && (
                <div className="w-full">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                            <FaBookOpen className="text-blue-400" /> Kanji Decks:
                        </h4>
                    </div>
                    <DeckDisplay deckType="kanji" decks={lesson.kanjiDecks} />
                </div>
            )}

            {/* Word Decks */}
            {lesson.wordDecks.length > 0 && (
                <div className="mt-4 w-full">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                            <FaFileAlt className="text-red-400" /> Word Decks:
                        </h4>
                    </div>
                    <DeckDisplay deckType="word" decks={lesson.wordDecks} />
                </div>
            )}

            {/* Grammar Decks */}
            {lesson.grammarDecks.length > 0 && (
                <div className="mt-4 w-full">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <FaBook className="text-green-400" /> Grammar Decks:
                    </h4>
                    <GrammarDeckDisplay decks={lesson.grammarDecks} />
                </div>
            )}
        </div>
    );
};

export default LessonBox;