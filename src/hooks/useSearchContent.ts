import { useMutation } from 'react-query';
import { useSearchKanji } from './useSearchKanji';
import { useSearchWords } from './useSearchWords';
import { useSearchGrammar } from './useSearchGrammar';
import { KanjiData } from '../data/KanjiData';
import { WordData } from '../data/WordData';
import { GrammarData } from '../data/GrammarData';

interface SearchOptions {
    showKanji: boolean;
    showWord: boolean;
    showGrammar: boolean;
}

interface SearchParams {
    tagsMap: { [tag: string]: boolean };
    options: SearchOptions;
}

interface SearchResult {
    kanjiResults: KanjiData[];
    wordResults: WordData[];
    grammarResults: GrammarData[];
    updatedTagsMap: { [tag: string]: boolean };
}

export const useSearchContent = () => {
    const kanjiMutation = useSearchKanji();
    const wordsMutation = useSearchWords();
    const grammarMutation = useSearchGrammar();

    const searchContent = async (params: SearchParams): Promise<SearchResult> => {
        const { tagsMap, options } = params;
        const validTags = Object.keys(tagsMap).filter(tag => tagsMap[tag]);
        const kanjiList = validTags.filter(tag => tag.length === 1);
        const wordList = validTags;

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

        if (options.showGrammar && validTags.length > 0) {
            const grammarPromise = grammarMutation.mutateAsync(validTags).then(response => {
                grammarResults = response || [];
            });
            promises.push(grammarPromise);
        }

        await Promise.all(promises);

        const foundKanjis = kanjiResults.map((item: KanjiData) => item.kanji);
        const foundWords = wordResults.map((item: WordData) => item.word);
        const foundGrammar = grammarResults.map((item: GrammarData) => item.structure);

        const missingTags = validTags.filter(
            (tag) =>
                !foundKanjis.includes(tag) &&
                !foundWords.includes(tag) &&
                !foundGrammar.includes(tag)
        );

        const updatedTagsMap = { ...tagsMap };
        missingTags.forEach((tag) => (updatedTagsMap[tag] = false));

        return {
            kanjiResults,
            wordResults,
            grammarResults,
            updatedTagsMap,
        };
    };

    return useMutation(searchContent);
};