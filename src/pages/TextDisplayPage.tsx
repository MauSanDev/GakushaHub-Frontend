import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TextReaderElement from '../components/TextReader';
import { GeneratedData } from "../data/GenerationData.ts";
import SaveDeckInput from '../components/SaveDeckInput';
import { useAuth } from "../context/AuthContext.tsx";
import SectionContainer from "../components/ui/containers/SectionContainer.tsx";
import BackButton from "../components/ui/buttons/BackButton.tsx";
import { useElements } from '../hooks/newHooks/useElements';  // Importa el nuevo hook
import { CollectionTypes } from '../data/CollectionTypes.tsx';

const TextDisplayPage: React.FC = () => {
    const { elementId } = useParams<{ elementId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const { data, isLoading, fetchElementsData } = useElements<GeneratedData>(
        elementId ? [elementId] : [],
        CollectionTypes.Generation
    );

    useEffect(() => {
        if (elementId) {
            fetchElementsData();
        }
    }, [elementId]);

    const elementData = data ? data[elementId || ''] : undefined;

    return (
        <SectionContainer isLoading={isLoading} error={elementData ? '' : 'No content available'}>
            <div className="flex-1 rounded-md overflow-y-auto relative max-w-4xl w-full">
                {elementData ? (
                    <>
                        {isAuthenticated && (
                            <div className="absolute top-0 right-0 flex gap-2">
                                <SaveDeckInput
                                    kanjiList={[]}
                                    wordList={[]}
                                    grammarList={[]}
                                    readingList={[elementData._id]}
                                />
                            </div>
                        )}

                        <div className="flex items-center justify-between mb-4 lg:pl-0 pl-20 mt-4">
                            <BackButton onClick={() => {navigate('/generations')}} />
                        </div>

                        <div className="relative">
                            <TextReaderElement data={elementData} />
                        </div>

                    </>
                ) : (
                    <div className="flex items-center justify-center h-full mt-2">
                        <h1 className="text-center text-4xl text-gray-300 font-bold align-middle space-x-0">
                            {isLoading ? "Loading..." : "No content available"}
                        </h1>
                    </div>
                )}
            </div>
        </SectionContainer>
    );
};

export default TextDisplayPage;