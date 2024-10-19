import React from 'react';
import {FaCheck, FaEye} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import DeleteButton from './DeleteButton';
import { GeneratedData } from "../data/GenerationData.ts";
import CreatorLabel from "./ui/text/CreatorLabel.tsx";
import {CollectionTypes} from "../data/CollectionTypes.tsx";

interface DeckReadingDataElementProps {
    result: GeneratedData;
    deleteRelations?: boolean;
    isSelected: boolean;
    onClick: () => void;
}

const DeckReadingDataElement: React.FC<DeckReadingDataElementProps> = ({ result, deleteRelations, isSelected = true, onClick }) => {
    return (
        <div className={`relative p-4 border bg-white dark:bg-gray-950 hover:border-blue-300 hover:dark:border-gray-700 border-gray-200 dark:border-gray-800 rounded-md shadow-md 
            ${isSelected ? 'dark:border-green-800 dark:hover:border-green-600 border-green-500 hover:border-green-300' : ''}`}

             onClick={onClick}
        >

            <div
                className={`absolute top-2 right-10 w-6 h-6 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 ${
                    isSelected ? 'text-green-500' : ''
                }`}
            >
                {isSelected && <FaCheck/>}
            </div>
            
            <div className="absolute top-2 right-2">
                <DeleteButton
                    creatorId={result.creatorId}
                    elementId={result._id}
                    elementType={CollectionTypes.Generation}
                    deleteRelations={deleteRelations}
                />
            </div>
            <div className="dark:border-gray-800">

                <CreatorLabel creatorId={result.creatorId} createdAt={result.createdAt}/>

                <h1 className="text-xl text-gray-600 font-bold dark:text-gray-300 mb-4">{result.title}</h1>

                <div className="flex items-center gap-2 flex-wrap">
        <span
            className="inline-block bg-blue-100 dark:bg-blue-900 dark:bg-opacity-50 text-blue-800 dark:text-blue-400 text-xs font-semibold px-2 py-0.5 rounded-full">
            Style: {result.style}
        </span>
                    <span
                        className="inline-block bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 dark:bg-opacity-50 text-xs font-semibold px-2 py-0.5 rounded-full">
            JLPT: N{result.jlptLevel}
        </span>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs">Tags:</span>
                        <div className="flex flex-wrap gap-1">
                            {result.keywords && result.keywords.length > 0 && result.keywords.map((keyword, index) => (
                                <div
                                    key={index}
                                    className="inline-block bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 dark:bg-opacity-50  text-xs font-semibold px-2 py-0.5 rounded-full"
                                >
                                    {keyword}
                                </div>
                            ))}
                        </div>
                    </div>

                    <Link
                        to={`/generation/${result._id}`}
                        className="ml-auto bg-blue-500 dark:bg-gray-700 text-white text-xs font-semibold px-3 py-1 rounded-full hover:bg-blue-600 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
                    >
                        <FaEye/> Read
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DeckReadingDataElement;