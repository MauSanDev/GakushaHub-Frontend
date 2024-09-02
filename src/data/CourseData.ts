import {KanjiDeck} from "./KanjiData.ts";
import {WordDeck} from "./WordData.ts";
import {GrammarDeck} from "./GrammarData.ts";
import {GenerationDeck} from "./GenerationData.ts";

export interface CourseData {
    _id: string;
    name: string;
    description: string;
    lessons: LessonData[];
    creatorId: string;
    isPublic: boolean;
    createdAt: string;
}

export interface LessonData {
    _id: string;
    name: string;
    description: string;
    kanjiDecks: KanjiDeck[];
    wordDecks: WordDeck[];
    grammarDecks: GrammarDeck[];
    readingDecks: GenerationDeck[];
    creatorId: string;
    isPublic: boolean;
    createdAt: string;
}