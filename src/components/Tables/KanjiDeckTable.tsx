import React from "react";
import { KanjiDeck } from '../../data/KanjiData.ts';

interface KanjiDeckTableProps {
    deck: KanjiDeck;
}

const KanjiDeckTable: React.FC<KanjiDeckTableProps> = ({ deck }) => {
    return (
        <div className="overflow-x-auto mb-5 max-w-full">
            <div className="inline-block align-middle overflow-scroll w-full">
                <table className=" overflow-scroll w-full bg-white dark:bg-black text-xs dark:border dark:border-gray-800">
                    <thead>
                    <tr className="bg-blue-50 dark:bg-gray-950 text-center text-sm dark:text-gray-300">
                        <th className="px-4 py-2 font-bold whitespace-nowrap">漢字</th>
                        <th className="px-4 py-2 ">音読み</th>
                        <th className="px-4 py-2 ">訓読み</th>
                        <th className="px-4 py-2 ">意味</th>
                        <th className="px-4 py-2 ">JLPT</th>
                    </tr>
                    </thead>
                    <tbody className="text-center text-sm">
                    {deck.elements.map((element, index) => (
                        <tr
                            key={element._id}
                            className={`${
                                index % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : "bg-white dark:bg-gray-800"
                            } hover:bg-blue-50 transition duration-200 text-gray-800 dark:text-gray-200 text-left`}
                        >
                            <td className="px-4 py-2 font-bold">{element.kanji}</td>
                            <td className="px-4 py-2 break-words whitespace-nowrap">{element.readings.onyomi.join("; ")}</td>
                            <td className="px-4 py-2 ">{element.readings.kunyomi.join("; ")}</td>
                            <td className="px-4 py-2 ">
                                {element.meanings?.map((meaning) => meaning.en).join("; ") || ""}
                            </td>
                            <td className="px-4 py-2 ">{element.jlpt}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default KanjiDeckTable;