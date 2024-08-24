export interface Reading {
    onyomi: string[];
    kunyomi: string[];
    others: string[];
}

export interface Related {
    writing: string;
    meaning: string;
    _id: string;
}

export interface KanjiData {
    readings: Reading;
    _id: string;
    kanji: string;
    jlpt: number;
    common: boolean;
    notes: string[];
    examples: string[];
    meanings: string[];
    __v: number;
}