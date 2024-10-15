import { useState, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { fetchElements } from '../../../services/dataService';
import { BaseDeckData } from '../../../data/DeckData.ts';
import { CollectionTypes } from '../../../data/CollectionTypes';

export const useDecks = (
    ids: string[],
    collectionType: CollectionTypes
): {
    data: Record<string, BaseDeckData> | undefined,
    isLoading: boolean,
    fetchDecks: () => void
} => {
    const queryClient = useQueryClient();
    const [data, setData] = useState<Record<string, BaseDeckData> | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchDecks = useCallback(async () => {
        setIsLoading(true);
        try {
            if (
                collectionType === CollectionTypes.KanjiDeck ||
                collectionType === CollectionTypes.WordDeck ||
                collectionType === CollectionTypes.GrammarDeck
            ) {
                const result = await fetchElements<BaseDeckData>(ids, collectionType, queryClient);
                setData(result);
            } else {
                throw new Error(`Invalid collection type: ${collectionType}`);
            }
        } catch (error) {
            console.error('Error fetching decks:', error);
            setData(undefined);
        } finally {
            setIsLoading(false);
        }
    }, [ids, collectionType, queryClient]);

    return {
        data,
        isLoading,
        fetchDecks,
    };
};