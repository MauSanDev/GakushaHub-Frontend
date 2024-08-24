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

export interface RelatedWord {
    word: string;
    meaning: string;
}

export interface WordData {
    word: string;
    readings: string[];
    meanings: string[];
    part_of_speech: string[];
    common: boolean;
    jlpt: number;
    notes: string[];
    related_words: RelatedWord[];
}

export interface GrammarExample {
    _id: string;
    sentence: string;
    translation: string;
}

export interface GrammarStructureData {
    _id: string;
    structure: string;
    hint: string;
    description: string;
    examples: GrammarExample[];
    jlpt: number;
    frequency: number;
    example_contexts: string[];
}