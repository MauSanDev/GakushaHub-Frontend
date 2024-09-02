import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import TextReader from '../components/TextReader';
import { useFetchElementById } from '../hooks/useFetchElement.ts';
import { GeneratedData } from "../data/GenerationData.ts";
import LoadingScreen from "../components/LoadingScreen";
import SaveDeckInput from '../components/SaveDeckInput';
import { FaArrowLeft } from 'react-icons/fa';

const TextDisplayPage: React.FC = () => {
    const { elementId } = useParams<{ elementId: string }>();
    const { data, isLoading, error } = useFetchElementById<GeneratedData>({ id: elementId || '', elementType: 'generation' });
    const location = useLocation();

    return (
        <div className="relative flex flex-col items-center justify-center h-full w-full p-4">
            <div className="flex-1 p-8 rounded-md overflow-y-auto relative max-w-4xl w-full">
                {isLoading && (
                    <LoadingScreen isLoading={isLoading} />
                )}
                {data ? (
                    <>

                        <div className="absolute top-0 right-0 flex gap-2">
                            <SaveDeckInput
                                kanjiList={[]}  // Aquí pasarías la lista de kanjis
                                wordList={[]}   // Aquí pasarías la lista de palabras
                                grammarList={[]}  // Aquí pasarías la lista de gramática
                                readingList={[data]}  // Aquí pasarías la lista de lecturas, en este caso solo un elemento
                            />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={() => {
                                    if (location.state?.from) {
                                        window.history.back();
                                    } else {
                                        // Si no hay una página anterior en el historial, redirige a una ruta específica, por ejemplo, la página de inicio
                                        window.location.href = '/';
                                    }
                                }}
                                className="bg-blue-500 text-white p-2 rounded-full shadow hover:bg-blue-600 mr-4"
                            >
                                <FaArrowLeft className="w-5 h-5"/>
                            </button>
                        </div>

                        <div className="relative">
                            <TextReader data={data} />
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