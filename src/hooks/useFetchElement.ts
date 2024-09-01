import {useQuery, UseQueryResult} from 'react-query';
import {ApiClient} from '../services/ApiClient';

interface FetchElementParams {
    id: string;
    elementType: 'course' | 'lesson' | 'kanji' | 'word' | 'grammar' | 'generation' | 'kanjiDeck' | 'grammarDeck' | 'wordDeck';
}

export const fetchElementById = async <T>({ id, elementType }: FetchElementParams): Promise<T> => {
    return await ApiClient.get<T>(`api/${elementType}/${id}`);
};

export const useFetchElementById = <T>({ id, elementType }: FetchElementParams): UseQueryResult<T, Error> => {
    return useQuery([elementType, id], () => fetchElementById<T>({ id: id, elementType }), {
        onError: (error: Error) => {
            console.error(`Error fetching ${elementType} with ID ${id}:`, error.message);
        },
    });
};