import { useMutation } from 'react-query';
import { useSearchKanji } from './useSearchKanji';
import { useSearchWords } from './useSearchWords';
import { usePaginatedGrammar } from './usePaginatedGrammar';
import { KanjiData } from '../data/KanjiData';
import { WordData } from '../data/WordData';
import { GrammarData } from '../data/GrammarData';

interface SearchOptions {
    showKanji: boolean;
    showWord: boolean;
    showGrammar: boolean;
}

interface SearchResult {
    kanjiResults: KanjiData[];
    wordResults: WordData[];
    grammarResults: GrammarData[];
    updatedTagsMap: { [tag: string]: boolean };
}

export const useSearchContent = (tagsList: string[], options: SearchOptions) => {
    const kanjiMutation = useSearchKanji();
    const wordsMutation = useSearchWords();
    const { fetchGrammarData } = usePaginatedGrammar();

    const searchContent = async (): Promise<SearchResult> => {
        const kanjiList = tagsList.filter(tag => tag.length === 1);
        const wordList = tagsList;

        let kanjiResults: KanjiData[] = [];
        let wordResults: WordData[] = [];
        let grammarResults: GrammarData[] = [];

        const promises: Promise<void>[] = [];

        if (options.showKanji && kanjiList.length > 0) {
            const kanjiPromise = kanjiMutation.mutateAsync(kanjiList).then(response => {
                kanjiResults = response || [];
            });
            promises.push(kanjiPromise);
        }

        if (options.showWord && wordList.length > 0) {
            const wordPromise = wordsMutation.mutateAsync(wordList).then(response => {
                wordResults = response || [];
            });
            promises.push(wordPromise);
        }

        if (options.showGrammar) {
            console.log(tagsList)
            const res = await fetchGrammarData(1, 10, tagsList);
            grammarResults = res?.documents || [];
            console.log("after -> " + tagsList)
        }

        await Promise.all(promises);

        const foundKanjis = kanjiResults.map((item: KanjiData) => item.kanji);
        const foundWords = wordResults.map((item: WordData) => item.word);
        const foundGrammar = grammarResults.map((item: GrammarData) => item.structure);

        const missingTags = tagsList.filter(
            (tag) =>
                !foundKanjis.includes(tag) &&
                !foundWords.includes(tag) &&
                !foundGrammar.includes(tag)
        );

        const updatedTagsMap = Object.fromEntries(tagsList.map(tag => [tag, !missingTags.includes(tag)]));

        return {
            kanjiResults,
            wordResults,
            grammarResults,
            updatedTagsMap,
        };
    };

    return useMutation(searchContent);
};