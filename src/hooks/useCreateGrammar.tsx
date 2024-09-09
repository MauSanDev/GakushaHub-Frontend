import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../services/ApiClient';
import { GrammarData } from "../data/GrammarData.ts";
import { useAuth } from "../context/AuthContext.tsx";

const CREATE_GRAMMAR_ENDPOINT = '/api/grammar/create';

interface CreateGrammarParams {
    structure: string;
    hint: string;
    description: string;
    examples: { text: string; translations: { en: string } }[];
    jlpt: number;
    frequency: number;
    example_contexts: string[];
}

const createGrammar = async (params: CreateGrammarParams, creatorId: string): Promise<GrammarData> => {
    return await ApiClient.post<GrammarData, {}>(CREATE_GRAMMAR_ENDPOINT, { ...params, creatorId });
};

export const useCreateGrammar = () => {
    const { userData } = useAuth(); 
    const queryClient = useQueryClient(); 

    return useMutation(async (params: CreateGrammarParams) => {
        if (!userData || !userData._id) {
            throw new Error("User data not available");
        }

        return await createGrammar(params, userData._id);
    }, {
        onSuccess: (grammar) => {
            
            queryClient.invalidateQueries(CREATE_GRAMMAR_ENDPOINT);
            console.log('Grammar created successfully:', grammar);
        },
        onError: (error) => {
            console.error("Error creating grammar structure:", error);
        }
    });
};