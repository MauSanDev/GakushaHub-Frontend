import React from "react";
import { WordDeck } from '../../data/WordData.ts';

interface WordDeckTableProps {
    deck: WordDeck;
}

const WordDeckTable: React.FC<WordDeckTableProps> = ({ deck }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-black text-xs">
                <thead>
                <tr className="bg-blue-50 text-center text-sm">
                    <th className="px-4 py-2 font-bold">Word</th>
                    <th className="px-4 py-2">Readings</th>
                    <th className="px-4 py-2">Meanings</th>
                    <th className="px-4 py-2">Part of Speech</th>
                    <th className="px-4 py-2">Related Words</th>
                </tr>
                </thead>
                <tbody className="text-center text-sm">
                {deck.elements.map((element, index) => (
                    <tr
                        key={element._id}
                        className={`${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white dark:bg-black"
                        } hover:bg-blue-50 transition duration-200 text-gray-800 dark:text-gray-200 text-left`}
                    >
                        <td className="px-4 py-2 font-bold">{element.word}</td>
                        <td className="px-4 py-2">{element.readings.join("; ")}</td>
                        <td className="px-4 py-2">{element.meanings?.map((meaning) => meaning.en).join("; ") || ""}</td>
                        <td className="px-4 py-2">{element.part_of_speech.join("; ")}</td>
                        <td className="px-4 py-2">
                            {element.related_words.map((related) => related.text).join(", ")}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default WordDeckTable;