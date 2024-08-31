import {Example, Translation} from "./data-structures.tsx";

export interface WordData {
    _id: string;
    word: string;
    readings: string[];
    meanings: Translation[];
    part_of_speech: string[];
    common: boolean;
    jlpt: number;
    notes: string[];
    related_words: Example[];
    examples: Example[];
    __v: number;
}