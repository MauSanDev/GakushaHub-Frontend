import React from "react";
import { WordDeck } from "../../data/data-structures";

interface WordTableProps {
    decks: WordDeck[];
}

const WordTable: React.FC<WordTableProps> = ({ decks }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="px-4 py-2">Word</th>
                    <th className="px-4 py-2">Readings</th>
                    <th className="px-4 py-2">Meanings</th>
                    <th className="px-4 py-2">Part of Speech</th>
                    <th className="px-4 py-2">Related Words</th>
                </tr>
                </thead>
                <tbody>
                {decks.flatMap((deck) =>
                    deck.elements.map((element) => (
                        <tr key={element._id}>
                            <td className="border px-4 py-2">{element._id.word}</td>
                            <td className="border px-4 py-2">{element._id.readings.join("; ")}</td>
                            <td className="border px-4 py-2">{element._id.meanings["en"]?.join("; ") || ""}</td>
                            <td className="border px-4 py-2">{element._id.part_of_speech.join("; ")}</td>
                            <td className="border px-4 py-2">
                                {element._id.related_words.map((related) => related.word).join(", ")}
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default WordTable;