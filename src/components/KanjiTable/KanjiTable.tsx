import React from "react";
import { KanjiDeck } from "../../data/data-structures";

interface KanjiTableProps {
    decks: KanjiDeck[];
}

const KanjiTable: React.FC<KanjiTableProps> = ({ decks }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="px-4 py-2">Kanji</th>
                    <th className="px-4 py-2">Onyomi</th>
                    <th className="px-4 py-2">Kunyomi</th>
                    <th className="px-4 py-2">Meanings</th>
                    <th className="px-4 py-2">Strokes</th>
                    <th className="px-4 py-2">JLPT</th>
                    <th className="px-4 py-2">Unicode</th>
                </tr>
                </thead>
                <tbody>
                {decks.flatMap((deck) =>
                    deck.elements.map((element) => (
                        <tr key={element._id}>
                            <td className="border px-4 py-2">{element._id.kanji}</td>
                            <td className="border px-4 py-2">{element._id.readings.onyomi.join("; ")}</td>
                            <td className="border px-4 py-2">{element._id.readings.kunyomi.join("; ")}</td>
                            <td className="border px-4 py-2">{element._id.meanings["en"]?.join("; ") || ""}</td>
                            <td className="border px-4 py-2">{element._id.strokes}</td>
                            <td className="border px-4 py-2">{element._id.jlpt}</td>
                            <td className="border px-4 py-2">{element._id.unicode}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default KanjiTable;