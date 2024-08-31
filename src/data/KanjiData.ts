import {Example, Reading, Translation} from "./data-structures.tsx";

export interface KanjiData {
    _id: string;
    kanji: string;
    readings: Reading;
    meanings: Translation[];
    jlpt: number;
    common: boolean;
    notes: string[];
    examples: Example[];
    strokes: number;
    unicode: string;
    __v: number;
}

