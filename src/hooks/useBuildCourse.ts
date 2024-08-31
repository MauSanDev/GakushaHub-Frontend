import { useMutation } from 'react-query';
import { ApiClient } from '../services/ApiClient';
import { KanjiData } from "../data/KanjiData.ts";
import { WordData} from "../data/WordData.ts";
import { GrammarData} from "../data/GrammarData.ts";

export interface Deck {
    deckName: string;
    elements: string[];
    deckType: 'kanji' | 'word' | 'grammar';
}

interface CreateCourseParams {
    courseId: string | null;
    courseName: string;
    lessonName: string;
    deckName: string;
    decks: Deck[];
    // creatorId: string;
}


const createCourse = async (params: CreateCourseParams): Promise<void> => {
    await ApiClient.post<void>('/api/course/build', params, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const parseDecks = (deckName : string, kanjiData: KanjiData[], wordData : WordData[], grammarData : GrammarData[]) =>
{
    const decks : Deck[] = []
    
    if (kanjiData.length > 0) {
        decks.push({
            deckName: `${deckName} - Kanji`,
            elements: kanjiData.map((x) => x._id),
            deckType: 'kanji',
        });
    }
    
    if (wordData.length > 0) {
        decks.push({
            deckName: `${deckName} - Words`,
            elements: wordData.map((x) => x._id),
            deckType: 'word',
        });
    }
    
    if (grammarData.length > 0) {
        decks.push({
            deckName: `${deckName} - Grammar`,
            elements: grammarData.map((x) => x._id),
            deckType: 'grammar',
        });
    }
    
    return decks
}

export const useBuildCourse = () => {
    return useMutation((params: CreateCourseParams) => {
        return createCourse(params);
    });
};