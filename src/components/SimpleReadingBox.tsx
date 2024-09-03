import React from 'react';
import { FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import DeleteButton from './DeleteButton';
import { GeneratedData } from "../data/GenerationData.ts";

interface SimpleReadingBoxProps {
    result: GeneratedData;
    deleteRelations?: boolean;
}

const SimpleReadingBox: React.FC<SimpleReadingBoxProps> = ({ result, deleteRelations }) => {
    return (
        <div className="relative p-4 bg-white border border-gray-300 rounded-md shadow-md hover:border-blue-300">
            <div className="absolute top-2 right-2">
                <DeleteButton
                    creatorId={result.creatorId}
                    elementId={result._id}
                    elementType={'generation'}
                    deleteRelations={deleteRelations}
                />
            </div>
            <p className="text-xs text-gray-500 mb-1">
                Created At: {new Date(result.createdAt).toLocaleDateString()}
            </p>
            <h1 className="text-lg font-bold mb-2">{result.title}</h1>

            <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    Style: {result.style}
                </span>
                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    Length: {result.length} chars
                </span>
                <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    JLPT: N{result.jlptLevel}
                </span>
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">Tags:</span>
                    <div className="flex flex-wrap gap-1">
                        {result.keywords && result.keywords.length > 0 && result.keywords.map((keyword, index) => (
                            <div
                                key={index}
                                className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-0.5 rounded-full"
                            >
                                {keyword}
                            </div>
                        ))}
                    </div>
                </div>
                <Link
                    to={`/generation/${result._id}`}
                    className="ml-auto bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full hover:bg-blue-600 transition-colors flex items-center gap-1"
                >
                    <FaEye /> Read
                </Link>
            </div>
        </div>
    );
};

export default SimpleReadingBox;