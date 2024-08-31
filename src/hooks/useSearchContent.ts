import { useKanji } from './useKanji';
import { useWords } from './useWords';
import { KanjiData } from '../data/KanjiData';
import { WordData } from '../data/WordData';

export const useSearchContent = (tagsMap: { [tag: string]: boolean }) => {
    const validTags = Object.keys(tagsMap).filter(tag => tagsMap[tag]);
    const kanjiList = validTags.filter(tag => tag.length === 1);
    const wordList = validTags;

    const { data: fetchedKanjis, error: kanjiError, isLoading: isKanjiLoading } = useKanji(kanjiList);
    const { data: fetchedWords, error: wordsError, isLoading: isWordsLoading } = useWords(wordList);

    const isLoading = isKanjiLoading || isWordsLoading;
    const error = kanjiError || wordsError;

    const foundKanjis = fetchedKanjis?.map((item: KanjiData) => item.kanji) || [];
    const foundWords = fetchedWords?.map((item: WordData) => item.word) || [];

    const missingTags = validTags.filter(tag => !foundKanjis.includes(tag) && !foundWords.includes(tag));

    const updatedTagsMap = { ...tagsMap };
    missingTags.forEach(tag => updatedTagsMap[tag] = false);

    return {
        kanjiResults: fetchedKanjis || [],
        wordResults: fetchedWords || [],
        loading: isLoading,
        error: error ? String(error) : '',
        updatedTagsMap,
    };
};