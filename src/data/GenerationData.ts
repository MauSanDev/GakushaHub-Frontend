import {DeckData} from "./DeckData.ts";
import {GrammarData} from "./GrammarData.ts";

export interface GeneratedData {
    _id: string, 
    title: string,
    text: string,
    topic: string,
    keywords: [string],
    style: string,
    length: number,
    jlptLevel: number,
    prioritization: {
        grammar: [string],
        words: [string],
        kanji: [string]
    },
    createdAt: string
}


export class GenerationDeck extends DeckData<GeneratedData> {}