import { useMutation } from 'react-query';
import { ApiClient } from '../services/ApiClient';

interface GenerateTextParams {
    topic: string;
    style: string;
    length: number;
    jlptLevel: number;
}

interface GenerateTextResponse {
    generatedText: string;
}

const generateText = async (params: GenerateTextParams): Promise<GenerateTextResponse> => {
    return ApiClient.post<GenerateTextResponse>('/api/generation', params);
};

export const useGenerateText = () => {
    return useMutation((params: GenerateTextParams) => generateText(params));
};