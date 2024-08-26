export interface Reading {
    onyomi: string[];
    kunyomi: string[];
    others: string[];
}

export interface Translation {
    [key: string]: string; // Mapea idiomas (ej. "en", "es") a sus traducciones
}

export interface Example {
    text: string;
    translations: Translation;
}

export interface KanjiData {
    _id: string;
    kanji: string;
    readings: Reading;
    meanings: string[]; // Este campo sigue siendo un array de significados
    jlpt: number;
    common: boolean;
    notes: string[];
    examples: Example[]; // Cambiado para reflejar la nueva estructura de ejemplos
    strokes: number;
    unicode: string;
    __v: number;
}

export interface RelatedWord {
    word: string;
    meaning: string;
    _id: string;
}

export interface WordData {
    _id: string;
    word: string;
    readings: string[];
    meanings: Example[]; // Cambiado para reflejar la nueva estructura de significados
    part_of_speech: string[];
    common: boolean;
    jlpt: number;
    notes: string[];
    related_words: Example[]; // Cambiado para reflejar la nueva estructura de ejemplos
    examples: Example[]; // Cambiado para reflejar la nueva estructura de ejemplos
    __v: number;
}

export interface GrammarStructureData {
    _id: string;
    structure: string;
    hint: string;
    description: string;
    examples: Example[]; // Cambiado para reflejar la nueva estructura de ejemplos
    jlpt: number;
    frequency: number;
    example_contexts: string[];
    __v: number;
}

// Generic Interface for Decks
export interface Deck<T = string> {
    _id: string;
    name: string;
    description: string;
    elements: T[]; // IDs or objects of the elements (kanji, word, grammar)
    creatorId: string;
    isPublic: boolean;
    examples: Example[];
    createdAt: string;
}

// Especificaciones para cada tipo de Deck
export type KanjiDeck = Deck<KanjiData>;
export type WordDeck = Deck<WordData>;
export type GrammarDeck = Deck<GrammarStructureData>;

export interface CourseData {
    _id: string;
    name: string;
    description: string;
    lessons: string[]; // Array con los IDs o los objetos completos de las lecciones
    creatorId: string;
    isPublic: boolean;
    createdAt: string;
}

export interface LessonData {
    _id: string;
    name: string;
    description: string;
    kanjiDecks: KanjiDeck[]; // Array of KanjiDecks (objects)
    wordDecks: WordDeck[]; // Array of WordDecks (objects)
    grammarDecks: GrammarDeck[]; // Array of GrammarDecks (objects)
    creatorId: string;
    isPublic: boolean;
    createdAt: string;
}