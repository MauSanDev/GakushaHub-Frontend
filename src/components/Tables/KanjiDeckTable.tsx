import React from "react";
import { KanjiDeck } from '../../data/KanjiData.ts';

interface KanjiDeckTableProps {
    deck: KanjiDeck;
}

const KanjiDeckTable: React.FC<KanjiDeckTableProps> = ({ deck }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-xs">
                <thead>
                <tr className="bg-blue-50 text-center text-sm">
                    <th className="px-4 py-2 font-bold">Kanji</th>
                    <th className="px-4 py-2">Onyomi</th>
                    <th className="px-4 py-2">Kunyomi</th>
                    <th className="px-4 py-2">Meanings</th>
                    <th className="px-4 py-2">Strokes</th>
                    <th className="px-4 py-2">JLPT</th>
                    <th className="px-4 py-2">Unicode</th>
                </tr>
                </thead>
                <tbody className="text-center text-sm">
                {deck.elements.map((element, index) => (
                    <tr
                        key={element._id}
                        className={`${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-blue-50 transition duration-200 text-gray-800 text-left`}
                    >
                        <td className="px-4 py-2 font-bold">{element.kanji}</td>
                        <td className="px-4 py-2">{element.readings.onyomi.join("; ")}</td>
                        <td className="px-4 py-2">{element.readings.kunyomi.join("; ")}</td>
                        <td className="px-4 py-2">{element.meanings?.map((meaning) => meaning.en).join("; ") || ""}</td>
                        <td className="px-4 py-2">{element.strokes}</td>
                        <td className="px-4 py-2">{element.jlpt}</td>
                        <td className="px-4 py-2">{element.unicode}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default KanjiDeckTable;