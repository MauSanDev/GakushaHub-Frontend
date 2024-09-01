import React from 'react';
import { useParams } from 'react-router-dom';
import TextReader from '../components/TextReader';
import { useFetchElementById } from '../hooks/useFetchElement.ts';
import { GeneratedData} from "../data/GenerationData.ts";
import LoadingScreen from "../components/LoadingScreen";

const TextDisplayPage: React.FC = () => {
    const { elementId } = useParams<{ elementId: string }>();
    const { data, isLoading, error } = useFetchElementById<GeneratedData>({ id: elementId || '', elementType: 'generation' });

    return (
        <div className="flex flex-col items-center justify-center h-full w-full p-4">
            <div className="flex-1 p-8 rounded-md overflow-y-auto relative max-w-4xl w-full">
                {isLoading && (
                    <LoadingScreen isLoading={isLoading} />
                )}
                {data ? (
                    <TextReader title={data.topic} content={data.generatedText} />
                ) : (
                    <div className="flex items-center justify-center h-full mt-2">
                        <h1 className="text-center text-4xl text-gray-300 font-bold align-middle space-x-0">
                            {error ? error.message : 'No content available'}
                        </h1>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TextDisplayPage;