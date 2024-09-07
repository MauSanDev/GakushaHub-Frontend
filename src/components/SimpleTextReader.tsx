import React from 'react';
import DeleteButton from './DeleteButton';
import { GeneratedData } from "../data/GenerationData.ts";
import {FaCrown} from "react-icons/fa";

interface SimpleTextPreviewProps {
    data: GeneratedData;
    deleteRelations?: boolean;
}

const SimpleTextReader: React.FC<SimpleTextPreviewProps> = ({ data, deleteRelations }) => {
    
    return (
        <div
            className="relative p-6 rounded-lg shadow-md text-left border-2 transform transition-transform duration-300 lg:hover:scale-105 bg-white dark:bg-gray-900 hover:border-blue-300 hover:dark:border-gray-700 border-gray-200 dark:border-gray-800">
            <div className="absolute top-2 right-2">
                <DeleteButton
                    creatorId={data.creatorId?._id ?? ''}
                    elementId={data._id}
                    elementType={'generation'}
                    deleteRelations={deleteRelations}
                />
            </div>
            <h1 className="text-2xl font-bold mb-2 dark:text-white">{data.title}</h1>


            <p className="inline-flex text-xs text-gray-500 mb-2 gap-2">
                <FaCrown/>
                Created by  {data.isAnonymous || !data.creatorId?.name ? "Anonymous" : data.creatorId?.name}  - {new Date(data.createdAt).toLocaleDateString()}
            </p>
            <h2 className="text-xs text-gray-600 dark:text-gray-300 mb-2">Topic: "{data.topic}"</h2>

            <div className="flex items-center gap-2 flex-wrap">
        <span
            className="inline-block bg-blue-100 dark:bg-blue-900 dark:bg-opacity-50 text-blue-800 dark:text-blue-400 text-xs font-semibold px-2 py-0.5 rounded-full">
            Style: {data.style}
        </span>
                <span
                    className="inline-block bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-500 dark:bg-opacity-50 text-xs font-semibold px-2 py-0.5 rounded-full">
            Length: {data.length} chars
        </span>
                <span
                    className="inline-block bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 dark:bg-opacity-50 text-xs font-semibold px-2 py-0.5 rounded-full">
            JLPT: N{data.jlptLevel}
        </span>
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">Tags:</span>
                    <div className="flex flex-wrap gap-1">
                        {data.keywords && data.keywords.length > 0 && data.keywords.map((keyword, index) => (
                            <div
                                key={index}
                                className="inline-block bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 dark:bg-opacity-50  text-xs font-semibold px-2 py-0.5 rounded-full"
                            >
                                {keyword}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimpleTextReader;