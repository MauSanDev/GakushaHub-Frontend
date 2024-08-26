import React from "react";
import { KanjiDeck, WordDeck } from "../../data/data-structures";

interface DeckTableProps {
    deckType: "kanji" | "word";
    decks: KanjiDeck[] | WordDeck[];
}

const DeckTable: React.FC<DeckTableProps> = ({ deckType, decks }) => {
    const renderHeader = () => {
        if (deckType === "kanji") {
            return (
                <tr className="bg-blue-100 text-center text-sm">
                    <th className="px-4 py-2 font-bold">Kanji</th>
                    <th className="px-4 py-2">Onyomi</th>
                    <th className="px-4 py-2">Kunyomi</th>
                    <th className="px-4 py-2">Meanings</th>
                    <th className="px-4 py-2">Strokes</th>
                    <th className="px-4 py-2">JLPT</th>
                    <th className="px-4 py-2">Unicode</th>
                </tr>
            );
        } else {
            return (
                <tr className="bg-blue-100 text-center text-sm">
                    <th className="px-4 py-2 font-bold">Word</th>
                    <th className="px-4 py-2">Readings</th>
                    <th className="px-4 py-2">Meanings</th>
                    <th className="px-4 py-2">Part of Speech</th>
                    <th className="px-4 py-2">Related Words</th>
                </tr>
            );
        }
    };

    const renderRows = () => {
        return decks.flatMap((deck) =>
            deck.elements.map((element) => (
                <tr
                    key={element._id}
                    className="hover:bg-blue-200 transition duration-200"
                >
                    {deckType === "kanji" ? (
                        <>
                            <td className="px-4 py-2 font-bold">{element._id.kanji}</td>
                            <td className="px-4 py-2">{element._id.readings.onyomi.join("; ")}</td>
                            <td className="px-4 py-2">{element._id.readings.kunyomi.join("; ")}</td>
                            <td className="px-4 py-2">{element._id.meanings["en"]?.join("; ") || ""}</td>
                            <td className="px-4 py-2">{element._id.strokes}</td>
                            <td className="px-4 py-2">{element._id.jlpt}</td>
                            <td className="px-4 py-2">{element._id.unicode}</td>
                        </>
                    ) : (
                        <>
                            <td className="px-4 py-2 font-bold">{element._id.word}</td>
                            <td className="px-4 py-2">{element._id.readings.join("; ")}</td>
                            <td className="px-4 py-2">{element._id.meanings["en"]?.join("; ") || ""}</td>
                            <td className="px-4 py-2">{element._id.part_of_speech.join("; ")}</td>
                            <td className="px-4 py-2">
                                {element._id.related_words.map((related) => related.word).join(", ")}
                            </td>
                        </>
                    )}
                </tr>
            ))
        );
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-xs">
                <thead>
                {renderHeader()}
                </thead>
                <tbody className="text-center text-sm">
                {renderRows()}
                </tbody>
            </table>
        </div>
    );
};

export default DeckTable;