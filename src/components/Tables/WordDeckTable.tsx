import React from "react";
import { WordDeck } from '../../data/WordData.ts';

interface WordDeckTableProps {
    deck: WordDeck;
}

const WordDeckTable: React.FC<WordDeckTableProps> = ({ deck }) => {
    return (
        <div className="overflow-x-auto mb-5 max-w-full">
            <div className="inline-block align-middle overflow-scroll lg:max-w-full">
                <table className=" overflow-scroll w-full bg-white dark:bg-black text-xs dark:border dark:border-gray-800">
                    <thead>
                    <tr className="bg-blue-50 dark:bg-gray-950 text-center text-sm dark:text-gray-300">
                        <th className="px-4 py-2 font-bold">言葉</th>
                        <th className="px-4 py-2">読み方</th>
                        <th className="px-4 py-2">意味</th>
                        <th className="px-4 py-2">Part of Speech</th>
                    </tr>
                    </thead>
                    <tbody className="text-center text-sm">
                    {deck.elements.map((element, index) => (
                        <tr
                            key={element._id}
                            className={`${
                                index % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : "bg-white dark:bg-gray-800"
                            } hover:bg-blue-50 dark:hover:bg-gray-700 transition duration-200 text-gray-800 dark:text-gray-200 text-left`}
                        >
                            <td className="px-4 py-2 font-bold break-words whitespace-nowrap">{element.word}</td>
                            <td className="px-4 py-2 break-words whitespace-nowrap">{element.readings.join("; ")}</td>
                            <td className="px-4 py-2 max-w-xs whitespace-normal break-words">{element.meanings?.map((meaning) => meaning.en).join("; ") || ""}</td>
                            <td className="px-4 py-2 max-w-32 truncate">{element.part_of_speech.join("; ")}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WordDeckTable;