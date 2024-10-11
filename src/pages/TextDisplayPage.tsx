import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TextReaderElement from '../components/TextReader';
import { useFetchElementById } from '../hooks/useFetchElement.ts';
import { GeneratedData } from "../data/GenerationData.ts";
import SaveDeckInput from '../components/SaveDeckInput';
import {useAuth} from "../context/AuthContext.tsx";
import SectionContainer from "../components/ui/containers/SectionContainer.tsx";
import BackButton from "../components/ui/buttons/BackButton.tsx";

const TextDisplayPage: React.FC = () => {
    const { elementId } = useParams<{ elementId: string }>();
    const { data, isLoading, error } = useFetchElementById<GeneratedData>({ id: elementId || '', elementType: 'generation' });
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth()

    return (
        <SectionContainer isLoading={isLoading} error={error && String(error) || ""}>
            <div className="flex-1 rounded-md overflow-y-auto relative max-w-4xl w-full">
                {data ? (
                    <>

                    {isAuthenticated && (<div className="absolute top-0 right-0 flex gap-2">
                            <SaveDeckInput
                                kanjiList={[]} 
                                wordList={[]}
                                grammarList={[]}
                                readingList={[data._id]} />
                        </div>)}
                        
                        <div className="flex items-center justify-between mb-4 lg:pl-0 pl-20 mt-4">
                            <BackButton onClick={() => {navigate(-1)}} />
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
        </SectionContainer>
    );
};

export default TextDisplayPage;