import { useQuery, useQueryClient } from 'react-query';
import { ApiClient } from '../services/ApiClient';
import { WordData } from '../data/WordData';

const fetchWords = async (keywords: string[]): Promise<WordData[]> => {
    const queryString = keywords.join(',');
    return ApiClient.get<WordData[]>(`/api/words?keywords=${queryString}`);
};

export const useWords = (keywords: string[]) => {
    const queryClient = useQueryClient();

    return useQuery(['words', keywords], async () => {

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
    }, {
        staleTime: 5 * 60 * 1000,
    });
};