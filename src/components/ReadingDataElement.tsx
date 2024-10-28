import React from 'react';
import DeleteButton from './DeleteButton';
import { GeneratedData } from "../data/GenerationData.ts";
import LocSpan from "./LocSpan.tsx";
import Container from "./ui/containers/Container.tsx";
import CreatorLabel from "./ui/text/CreatorLabel.tsx";
import {CollectionTypes} from "../data/CollectionTypes.tsx";

interface ReadingDataElementProps {
    data: GeneratedData;
    deleteRelations?: boolean;
    onDelete?: (elementId: string, collectionType: CollectionTypes) => void;
}

const ReadingDataElement: React.FC<ReadingDataElementProps> = ({ data, deleteRelations, onDelete }) => {
    
    return (
        <Container>
            <div className="absolute top-2 right-2">
                <DeleteButton
                    creatorId={data.creatorId}
                    elementId={data._id}
                    elementType={CollectionTypes.Generation}
                    deleteRelations={deleteRelations}
                    onDelete={onDelete}
                />
            </div>
            <h1 className="text-2xl font-bold mb-2 dark:text-white">{data.title}</h1>
            
            <CreatorLabel isAnonymous={data.isAnonymous} creatorId={data.creatorId} createdAt={data.createdAt} />
            
            <h2 className="text-xs text-gray-600 dark:text-gray-300 mb-2"><LocSpan textKey={"topic"}/>: "{data.topic}"</h2>

            <div className="flex items-center gap-2 flex-wrap">
        <span
            className="inline-block bg-blue-100 dark:bg-blue-900 dark:bg-opacity-50 text-blue-800 dark:text-blue-400 text-xs font-semibold px-2 py-0.5 rounded-full">
            <LocSpan textKey={"style"}/>: {data.style}
        </span>
                <span
                    className="inline-block bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-500 dark:bg-opacity-50 text-xs font-semibold px-2 py-0.5 rounded-full">
            JLPT: N{data.jlptLevel}
        </span>
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs"><LocSpan textKey={"tags"}/>:</span>
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
        </Container>
    );
};

export default ReadingDataElement;