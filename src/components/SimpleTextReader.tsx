import React from 'react';
import DeleteButton from './DeleteButton';
import { GeneratedData } from "../data/GenerationData.ts";
import {FaCrown} from "react-icons/fa";

interface SimpleTextPreviewProps {
    data: GeneratedData;
    deleteRelations?: boolean;
}

const SimpleTextReader: React.FC<SimpleTextPreviewProps> = ({ data, deleteRelations }) => {
    
    console.log(data)
    return (
        <div className="relative p-6 bg-white border-gray-300 rounded-md shadow-lg hover:border-blue-300 border-2">
            <div className="absolute top-2 right-2">
                <DeleteButton
                    creatorId={data.creatorId?._id ?? ''}
                    elementId={data._id}
                    elementType={'generation'}
                    deleteRelations={deleteRelations}
                />
            </div>
            <h1 className="text-2xl font-bold mb-2">{data.title}</h1>


            <p className="inline-flex text-xs text-gray-500 mb-2 gap-2">
                <FaCrown/>
                Created by {data.creatorId?.name ?? "???"} - {new Date(data.createdAt).toLocaleDateString()}
            </p>
            <h2 className="text-xs text-gray-600 mb-2">Topic: "{data.topic}"</h2>

            <div className="flex gap-2 mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                    Style: {data.style}
                </span>
                <span
                    className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
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
        </div>
    );
};

export default SimpleTextReader;