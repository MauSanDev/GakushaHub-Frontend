import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../services/ApiClient';
import { GrammarData } from '../data/GrammarData';

const fetchGrammar = async (keywords: string[]): Promise<GrammarData[]> => {
    const queryString = keywords.join(',');

    try {
        return await ApiClient.get<GrammarData[]>(`/api/grammar?keywords=${queryString}`);
    } catch (error: unknown) {
        throw new Error(`Failed to fetch grammar: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

export const useSearchGrammar = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (keywords: string[]) => {
            if (keywords.length === 0) {
                return [];
            }

            const cachedGrammar: GrammarData[] = [];
            const keywordsToFetch: string[] = [];

            keywords.forEach((keyword) => {
                const cachedData = queryClient.getQueryData<GrammarData>(['grammar', keyword]);
                if (cachedData) {
                    cachedGrammar.push(cachedData);
                } else {
                    keywordsToFetch.push(keyword);
                }
            });

            if (keywordsToFetch.length === 0) {
                return cachedGrammar;
            }

            const fetchedGrammar = await fetchGrammar(keywordsToFetch);

            fetchedGrammar.forEach((grammar) => {
                queryClient.setQueryData(['grammar', grammar.structure], grammar);
            });

            return [...cachedGrammar, ...fetchedGrammar];
        }
    );
};