import React from 'react';
import { FaBookOpen, FaFileAlt, FaBook } from 'react-icons/fa';
import DeleteButton from './DeleteButton';
import { GeneratedData } from "../data/GenerationData.ts";

interface SimpleTextPreviewProps {
    data: GeneratedData;
    deleteRelations?: boolean;
}

const SimpleTextReader: React.FC<SimpleTextPreviewProps> = ({ data, deleteRelations }) => {
    return (
        <div className="relative p-8 bg-white border border-gray-300 rounded-md shadow-lg hover:border-blue-300 border-2">
            <div className="absolute top-2 right-2">
                <DeleteButton
                    elementId={data._id}
                    elementType={'generation'}
                    deleteRelations={deleteRelations}
                />
            </div>
            <p className="text-sm text-gray-500 mb-2">
                Created At: {new Date(data.createdAt).toLocaleDateString()}
            </p>
            <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
            <h2 className="text-sm text-gray-600 mb-2">Topic: "{data.topic}"</h2>

            <div className="flex gap-2 mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                    Style: {data.style}
                </span>
                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                    Length: {data.length} chars
                </span>
                <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                    JLPT: N{data.jlptLevel}
                </span>

                <div className="flex items-center gap-2 ml-auto">
                    <span className="text-gray-400 text-xs">Tags:</span>
                    <div className="flex flex-wrap gap-2">
                        {data.keywords && data.keywords.length > 0 && data.keywords.map((keyword, index) => (
                            <div
                                key={index}
                                className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-1 rounded-full"
                            >
                                {keyword}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {data.prioritization?.grammar && data.prioritization.grammar.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <FaBook className="text-green-400" /> Grammar:
                    </h2>
                    {/*<div className="flex flex-wrap gap-2">*/}
                    {/*    {data.prioritization.grammar.map((item, index) => (*/}
                    {/*        <SmallGrammarBox key={index} text={item} />*/}
                    {/*    ))}*/}
                    {/*</div>*/}
                </div>
            )}

            {data.prioritization?.words && data.prioritization.words.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <FaFileAlt className="text-red-400" /> Words:
                    </h2>
                    {/*<div className="flex flex-wrap gap-2">*/}
                    {/*    {data.prioritization.words.map((item, index) => (*/}
                    {/*        <SmallWordBox key={index} text={item} />*/}
                    {/*    ))}*/}
                    {/*</div>*/}
                </div>
            )}

            {data.prioritization?.kanji && data.prioritization.kanji.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <FaBookOpen className="text-blue-400" /> Kanji:
                    </h2>
                    {/*<div className="flex flex-wrap gap-2">*/}
                    {/*    {data.prioritization.kanji.map((item, index) => (*/}
                    {/*        <SmallKanjiBox key={index} text={item} />*/}
                    {/*    ))}*/}
                    {/*</div>*/}
                </div>
            )}
        </div>
    );
};

export default SimpleTextReader;