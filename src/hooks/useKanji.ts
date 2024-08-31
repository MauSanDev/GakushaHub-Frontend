import { useQuery, useQueryClient } from 'react-query';
import { ApiClient } from '../services/ApiClient';
import { KanjiData } from '../data/KanjiData';

const fetchKanji = async (kanjis: string[]): Promise<KanjiData[]> => {
    const queryString = kanjis.join(',');
    return ApiClient.get<KanjiData[]>(`/api/kanji?l=${queryString}`);
};

export const useKanji = (kanjis: string[]) => {
    const queryClient = useQueryClient();

    return useQuery(['kanji', kanjis], async () => {
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
    }, {
        staleTime: 5 * 60 * 1000,
    });
};