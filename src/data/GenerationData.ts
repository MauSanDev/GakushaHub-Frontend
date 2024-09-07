import {DeckData} from "./DeckData.ts";
import {UserData} from "./UserData.ts";

export interface GeneratedData {
    _id: string, 
    title: string,
    text: string,
    topic: string,
    keywords: string[],
    style: string,
    length: number,
    jlptLevel: number,
    isPublic: boolean,
    isAnonymous: boolean,
    prioritization: {
        grammar: string[],
        words: string[],
        kanji: string[]
    },
    creatorId: UserData;
    createdAt: string
}


export class GenerationDeck extends DeckData<GeneratedData> {}