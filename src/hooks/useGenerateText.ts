import { useMutation } from 'react-query';
import { ApiClient } from '../services/ApiClient';
import {GeneratedData} from "../data/GenerationData.ts";

interface GenerateTextParams {
    topic: string;
    style: string;
    length: number;
    jlptLevel: number;
    isPublic: boolean;
}

const isDeveloping = false; // FOR DEBUGGING!

const generateText = async (params: GenerateTextParams): Promise<GeneratedData> => {
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
            isPublic:true,
            prioritization: {
                grammar: ['grammar1', 'grammar2'],
                words: ['word1', 'word2'],
                kanji: ['kanji1', 'kanji2']
            },
            createdAt: new Date().toISOString()
        };
    } else {
        return ApiClient.post<GeneratedData>('/api/generation', params);
    }
};

export const useGenerateText = () => {
    return useMutation(generateText);
};