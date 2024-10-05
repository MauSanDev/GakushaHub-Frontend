import { useMutation, useQueryClient } from 'react-query';
import { ApiClient } from '../services/ApiClient';
import { KanjiData } from '../data/KanjiData';

const fetchKanji = async (kanjis: string[]): Promise<KanjiData[]> => {
    const queryString = kanjis.join(',');

    try {
        return await ApiClient.get<KanjiData[]>(`/api/kanji?l=${queryString}`);
    } catch (error: unknown) {
        throw new Error(`Failed to fetch kanji: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

export const useSearchKanji = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (kanjis: string[]) => {
            if (kanjis.length === 0) {
                return [];
            }

            const cachedKanjis: KanjiData[] = [];
            const kanjisToFetch: string[] = [];

            kanjis.forEach((kanji) => {
                const cachedData = queryClient.getQueryData<KanjiData>(['kanji', kanji]);
                if (cachedData) {
                    cachedKanjis.push(cachedData);
                } else {
                    kanjisToFetch.push(kanji);
                }
            });

            if (kanjisToFetch.length === 0) {
                return cachedKanjis;
            }

            const fetchedKanjis = await fetchKanji(kanjisToFetch);

            fetchedKanjis.forEach((kanji) => {
                queryClient.setQueryData(['kanji', kanji.kanji], kanji);
            });

            return [...cachedKanjis, ...fetchedKanjis];
        }
    );
};