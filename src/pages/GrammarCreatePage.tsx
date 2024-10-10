/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useState } from 'react';
import GrammarCreateBox from '../components/GrammarCreateBox';
import { GrammarData } from "../data/GrammarData.ts";

const GrammarCreatePage: React.FC = () => {
    const [newGrammar, setNewGrammar] = useState<GrammarData | null>(null);

    const handleGrammarSave = (grammar: GrammarData) => {
        // Aquí manejarías el guardado del nuevo elemento, por ejemplo, haciendo un request al backend
        console.log('Nuevo elemento de gramática guardado:', grammar);
        setNewGrammar(null); // Reiniciamos el formulario tras el guardado
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-start h-full w-full relative overflow-y-auto">

            <div className="flex items-start mb-4 sm:mb-0">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-200 capitalize">
                    新しい文法
                </h1>
            </div>
            
            <GrammarCreateBox onSave={handleGrammarSave}/>

            {newGrammar && (
                <div className="mt-4">
                    <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200">Previsualización</h2>
                    {/* Aquí podrías reutilizar GrammarDataElement para mostrar una previsualización del elemento creado */}
                </div>
            )}
        </div>
    );
};

export default GrammarCreatePage;