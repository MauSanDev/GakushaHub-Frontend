import {DeckData} from "./DeckData.ts";

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
    prioritization: {
        grammar: string[],
        words: string[],
        kanji: string[]
    },
    creatorId: string;
    createdAt: string
}


export class GenerationDeck extends DeckData<GeneratedData> {}