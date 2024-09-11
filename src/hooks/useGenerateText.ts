import { useMutation } from 'react-query';
import { ApiClient } from '../services/ApiClient';
import { GeneratedData } from "../data/GenerationData";
import { useAuth } from '../context/AuthContext';
import { usePaginatedGenerations } from "./usePaginatedGenerations.ts";

interface GenerateTextParams {
    topic: string;
    style: string;
    length: number;
    jlptLevel: number;
    isPublic: boolean;
    isAnonymous: boolean;
    prioritization: {
        grammar: string[],
        words: string[],
        kanji: string[]
    },
}

const generateText = async (params: GenerateTextParams, creatorId: string): Promise<GeneratedData> => {
    return ApiClient.post<GeneratedData, {}>('/api/generation', { ...params, creatorId });
};

export const useGenerateText = () => {
    const { userData } = useAuth();
    const { resetQueries } = usePaginatedGenerations(1, 10);

    return useMutation((params: GenerateTextParams) => {
        if (!userData || !userData._id) {
            throw new Error("User data not available");
        }
        return generateText(params, userData._id);
    }, {
        onSuccess: () => {
            resetQueries();
        },
        onError: (error) => {
            console.error("Error generating text:", error);
        }
    });
};