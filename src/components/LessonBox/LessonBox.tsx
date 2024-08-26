import React, { useState } from "react";
import { LessonData } from "../../data/data-structures.tsx";
import { FaBookOpen, FaBook, FaFileAlt } from "react-icons/fa";
import SmallKanjiBox from "../SmallKanjiBox";
import SmallWordBox from "../SmallWordBox";

interface LessonBoxProps {
    lesson: LessonData;
}

const LessonBox: React.FC<LessonBoxProps> = ({ lesson }) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [title, setTitle] = useState(lesson.name || "<Title>");
    const [description, setDescription] = useState(lesson.description || "Tap here to add a description...");

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value);

    const saveChanges = () => {
        // Aquí puedes hacer la llamada al endpoint para guardar los cambios
        setIsEditingTitle(false);
        setIsEditingDescription(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border border-gray-200 transform transition-transform duration-300 hover:scale-105 hover:border-blue-400 w-full">

            {isEditingTitle ? (
                <input
                    className="text-2xl font-bold text-blue-500 mb-2 w-full bg-gray-100 p-2 rounded"
                    value={title}
                    onChange={handleTitleChange}
                    onBlur={saveChanges}
                    autoFocus
                />
            ) : (
                <h3
                    className="text-2xl font-bold text-blue-500 mb-2 cursor-pointer"
                    onClick={() => setIsEditingTitle(true)}
                >
                    {title}
                </h3>
            )}

            {isEditingDescription ? (
                <textarea
                    className="text-gray-700 mb-4 w-full bg-gray-100 p-2 rounded"
                    value={description}
                    onChange={handleDescriptionChange}
                    onBlur={saveChanges}
                    autoFocus
                />
            ) : (
                <p
                    className="text-gray-700 mb-4 cursor-pointer"
                    onClick={() => setIsEditingDescription(true)}
                >
                    {description}
                </p>
            )}

            {lesson.kanjiDecks.length > 0 && (
                <div className="w-full">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <FaBookOpen className="text-blue-400"/> Kanji Decks:
                    </h4>
                    <div className="grid grid-cols-6 gap-4 w-full">
                        {lesson.kanjiDecks.map((deck, index) => (
                            <div key={index} className="col-span-6">
                                <div className="font-bold text-gray-600 mb-2">{deck.name}</div>
                                <div className="grid grid-cols-6 gap-2">
                                    {deck.elements.map((element) => (
                                        <SmallKanjiBox key={element._id} result={element._id} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {lesson.wordDecks.length > 0 && (
                <div className="mt-4 w-full">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <FaFileAlt className="text-red-400"/> Word Decks:
                    </h4>
                    <div className="grid grid-cols-6 gap-4 w-full">
                        {lesson.wordDecks.map((deck, index) => (
                            <div key={index} className="col-span-6">
                                <div className="font-bold text-gray-600 mb-2">{deck.name}</div>
                                <div className="grid grid-cols-6 gap-2">
                                    {deck.elements.map((element) => (
                                        <SmallWordBox key={element._id} result={element._id} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {lesson.grammarDecks.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <FaBook className="text-green-400"/> Grammar Decks:
                    </h4>
                    <div className="ml-4">
                        <p className="text-gray-500 italic ml-4">Esta sección es específica de gramática.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LessonBox;