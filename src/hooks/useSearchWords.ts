import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../services/ApiClient';
import { WordData } from '../data/WordData';

const fetchWords = async (keywords: string[]): Promise<WordData[]> => {
    const queryString = keywords.join(',');

    try {
        return await ApiClient.get<WordData[]>(`/api/words?keywords=${queryString}`);
    } catch (error: unknown) {
        throw new Error(`Failed to fetch words: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

export const useSearchWords = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (keywords: string[]) => {
            if (keywords.length === 0) {
                return [];
            }

            const cachedWords: WordData[] = [];
            const wordsToFetch: string[] = [];

            keywords.forEach((keyword) => {
                const cachedData = queryClient.getQueryData<WordData>(['word', keyword]);
                if (cachedData) {
                    cachedWords.push(cachedData);
                } else {
                    wordsToFetch.push(keyword);
                }
            });

            if (wordsToFetch.length === 0) {
                return cachedWords;
            }

            const fetchedWords = await fetchWords(wordsToFetch);

            fetchedWords.forEach((word) => {
                queryClient.setQueryData(['word', word.word], word);
            });

            return [...cachedWords, ...fetchedWords];
        }
    );
};