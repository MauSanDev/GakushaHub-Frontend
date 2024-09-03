import { useMutation } from 'react-query';
import { ApiClient } from '../services/ApiClient';
import { KanjiData } from "../data/KanjiData.ts";
import { WordData} from "../data/WordData.ts";
import { GrammarData} from "../data/GrammarData.ts";
import { GeneratedData } from "../data/GenerationData.ts";
import {useAuth} from "../context/AuthContext.tsx";

export interface Deck {
    deckName: string;
    elements: string[];
    deckType: 'kanji' | 'word' | 'grammar' | 'reading';
}

interface CreateCourseParams {
    courseId: string | null;
    courseName: string;
    lessonName: string;
    decks: Deck[];
}


const createCourse = async (params: CreateCourseParams, creatorId: string): Promise<void> => {
    await ApiClient.post<void>('/api/course/build', { ...params, creatorId });
};

export const parseDecks = (deckName : string, kanjiData: KanjiData[], wordData : WordData[], grammarData : GrammarData[], readingData : GeneratedData[]) =>
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
    
    if (readingData.length > 0) {
        decks.push({
            deckName: `${deckName} - Reading`,
            elements: readingData.map((x) => x._id),
            deckType: 'reading',
        });
    }
    
    return decks
}

export const useBuildCourse = () => {
    const { userData } = useAuth(); 
    
    return useMutation((params: CreateCourseParams) => {

        if (!userData || !userData._id) {
            throw new Error("User data not available");
        }
        
        return createCourse(params, userData._id);
    });
};
