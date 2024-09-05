import {DeckData} from "./DeckData.ts";
import {ExampleData, TranslationData} from "./GeneralTypes.ts";

export interface KanjiData {
    _id: string;
    kanji: string;
    readings: Reading;
    meanings: TranslationData[];
    jlpt: number;
    common: boolean;
    notes: string[];
    examples: ExampleData[];
    strokes: number;
    unicode: string;
    __v: number;
}

export interface Reading {
    onyomi: string[];
    kunyomi: string[];
    others: string[];
}


export class KanjiDeck extends DeckData<KanjiData> {}

