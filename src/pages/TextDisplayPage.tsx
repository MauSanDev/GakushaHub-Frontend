import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TextReaderElement from '../components/TextReader';
import { useFetchElementById } from '../hooks/useFetchElement.ts';
import { GeneratedData } from "../data/GenerationData.ts";
import LoadingScreen from "../components/LoadingScreen";
import SaveDeckInput from '../components/SaveDeckInput';
import { FaArrowLeft } from 'react-icons/fa';
import {useAuth} from "../context/AuthContext.tsx";

const TextDisplayPage: React.FC = () => {
    const { elementId } = useParams<{ elementId: string }>();
    const { data, isLoading, error } = useFetchElementById<GeneratedData>({ id: elementId || '', elementType: 'generation' });
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth()

    return (
        <div className="relative flex flex-col items-center justify-center h-full w-full pt-3">
            <div className="flex-1 rounded-md overflow-y-auto relative max-w-4xl w-full">
                {isLoading && (
                    <LoadingScreen isLoading={isLoading} />
                )}
                {data ? (
                    <>

                    {isAuthenticated && (<div className="absolute top-0 right-0 flex gap-2">
                            <SaveDeckInput
                                kanjiList={[]} 
                                wordList={[]}
                                grammarList={[]}
                                readingList={[data]} />
                        </div>)}
                        
                        <div className="flex items-center justify-between mb-4 lg:pl-0 pl-20 ">
                            <button
                                onClick={() => {navigate(-1)}}
                                className="bg-blue-500 dark:bg-gray-700 text-white p-2 rounded-full shadow hover:bg-blue-600 dark:hover:bg-gray-600 mr-4"
                            >
                                <FaArrowLeft className="w-5 h-5"/>
                            </button>
                        </div>

                        <div className="relative">
                            <TextReaderElement data={data} />
                        </div>
                        
                    </>
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