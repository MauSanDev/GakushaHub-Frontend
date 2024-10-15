import {KanjiDeck} from "./KanjiData.ts";
import {WordDeck} from "./WordData.ts";
import {GrammarDeck} from "./GrammarData.ts";
import {GenerationDeck} from "./GenerationData.ts";
import {UserData} from "./UserData.ts";
import {BaseDeckData} from "./DeckData.ts";

export interface CourseData {
    _id: string;
    name: string;
    description: string;
    lessons: string[];
    creatorId: string;
    institutionId: string;
    isPublic: boolean;
    createdAt: string;
}

export interface LessonData {
    _id: string;
    name: string;
    description: string;
    kanjiDecks: string[];
    wordDecks: string[];
    grammarDecks: string[];
    readingDecks: string[];
    creatorId: UserData;
    isPublic: boolean;
    createdAt: string;
}