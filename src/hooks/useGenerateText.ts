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

const isDeveloping = false; // FOR DEBUGGING!

const generateText = async (params: GenerateTextParams, creatorId: string): Promise<GeneratedData> => {

    if (isDeveloping) {
        return {
            _id: 'generated-id',
            title: 'Generated Title',
            text: 'This is a generated text.',
            topic: params.topic,
            keywords: ['keyword1', 'keyword2'],
            style: params.style,
            length: params.length,
            jlptLevel: params.jlptLevel,
            isPublic: true,
            isAnonymous: false,
            creatorId: { _id: 'creatorId', name: 'creatorId', uid: creatorId, country: 'demo', email: 'demo@demo.com', createdAt: Date.now(), lastLogin: Date.now()},
            prioritization: {
                grammar: params.prioritization.grammar,
                words: params.prioritization.words,
                kanji: params.prioritization.kanji
            },
            createdAt: new Date().toISOString()
        };
    } else {
        return ApiClient.post<GeneratedData, {}>('/api/generation', { ...params, creatorId });
    }
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