import { useMutation } from 'react-query';
import { ApiClient } from '../services/ApiClient';
import { useAuth } from '../context/AuthContext';

interface CorrectGrammarParams {
    sentence: string;
    grammarStructure: string;
    example1: string;
    example2: string;
}

interface CorrectGrammarResponse {
    score: number;
    feedback: string;
    correction: string;
}

const correctGrammar = async (params: CorrectGrammarParams): Promise<CorrectGrammarResponse> => {
    return ApiClient.post<CorrectGrammarResponse, {}>('/api/correction/correctGrammar', { ...params });
};

export const useCorrectGrammar = () => {
    const { userData } = useAuth();

    return useMutation((params: CorrectGrammarParams) => {
        if (!userData || !userData._id) {
            throw new Error("User data not available");
        }
        return correctGrammar(params);
    }, {
        onSuccess: (data) => {
            console.log("Correction successful:", data);
        },
        onError: (error) => {
            console.error("Error correcting grammar:", error);
        }
    });
};