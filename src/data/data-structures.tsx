export interface Reading {
    onyomi: string[];
    kunyomi: string[];
    others: string[];
}

export interface Translation {
    [key: string]: string; 
}

export interface Example {
    text: string;
    translations: Translation;
}

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

export interface GrammarStructureData {
    _id: string;
    structure: string;
    hint: string;
    description: string;
    examples: Example[];
    jlpt: number;
    frequency: number;
    example_contexts: string[];
    __v: number;
}

export interface FlashcardData {
    id: string;
    front: string;
    back: string;
    readings: string[];
    meanings: string[];
    type: "kanji" | "word" | "grammar";
    examples: Example[];
    jlpt: number;
}

export class Deck<T> {
    _id: string;
    name: string;
    description: string;
    elements: T[];
    creatorId: string;
    isPublic: boolean;
    examples: Example[];
    createdAt: string;

    constructor(
        _id: string,
        name: string,
        description: string,
        elements: T[],
        creatorId: string,
        isPublic: boolean,
        examples: Example[],
        createdAt: string
    ) {
        this._id = _id;
        this.name = name;
        this.description = description;
        this.elements = elements;
        this.creatorId = creatorId;
        this.isPublic = isPublic;
        this.examples = examples;
        this.createdAt = createdAt;
    }

    convertToFlashcards(): FlashcardDeck {
        throw new Error("This method should be overridden in subclasses");
    }
}

export class KanjiDeck extends Deck<KanjiData> {
    convertToFlashcards(): FlashcardDeck {
        const flashcards: FlashcardData[] = this.elements.map((element) => {
            const kanjiData = element._id as unknown as KanjiData;

            if (
                typeof kanjiData === "object" &&
                kanjiData !== null &&
                "_id" in kanjiData &&
                "kanji" in kanjiData &&
                "readings" in kanjiData &&
                "meanings" in kanjiData
            ) {
                const onyomiReadings = kanjiData.readings?.onyomi.join("; ") || "";
                const kunyomiReadings = kanjiData.readings?.kunyomi.join("; ")  || "";

                return {
                    id: kanjiData._id,
                    front: kanjiData.kanji || "",
                    back: `${kunyomiReadings}\n${onyomiReadings}`,
                    readings: [
                        ...onyomiReadings,
                        ...kunyomiReadings,
                        ...(kanjiData.readings?.others || []),
                    ],
                    meanings: kanjiData.meanings?.map((meaning) => meaning.en) || [],
                    type: "kanji",
                    examples: kanjiData.examples || [],
                    jlpt: kanjiData.jlpt,
                };
            } else {
                throw new Error("Invalid KanjiData format");
            }
        });

        return new FlashcardDeck(
            this._id,
            this.name,
            this.description,
            flashcards,
            this.creatorId,
            this.isPublic,
            this.examples || [],
            this.createdAt
        );
    }
}

export class WordDeck extends Deck<WordData> {
    convertToFlashcards(): FlashcardDeck {
        const flashcards: FlashcardData[] = this.elements.map((element) => {
            const wordData = element._id as unknown as WordData;

            if (
                typeof wordData === "object" &&
                wordData !== null &&
                "_id" in wordData &&
                "word" in wordData &&
                "meanings" in wordData &&
                "readings" in wordData
            ) {
                
                const readings = wordData.readings.join("; ") || "";
                
                return {
                    id: wordData._id,
                    front: wordData.word || "",
                    back: readings, // Mostrar los readings en el back
                    readings: wordData.readings || [],
                    meanings: wordData.meanings?.map((meaning) => meaning.en) || [],
                    type: "word",
                    examples: wordData.examples || [],
                    jlpt: wordData.jlpt,
                };
            } else {
                throw new Error("Invalid WordData format");
            }
        });

        return new FlashcardDeck(
            this._id,
            this.name,
            this.description,
            flashcards,
            this.creatorId,
            this.isPublic,
            this.examples || [],
            this.createdAt
        );
    }
}

export class GrammarDeck extends Deck<GrammarStructureData> {
    convertToFlashcards(): FlashcardDeck {
        const flashcards: FlashcardData[] = this.elements.map((grammar) => ({
            id: grammar._id,
            front: grammar.structure,
            back: grammar.description,
            readings: [],
            meanings: [grammar.hint],
            type: "grammar",
            examples: grammar.examples || [],
            jlpt: grammar.jlpt,
        }));

        return new FlashcardDeck(
            this._id,
            this.name,
            this.description,
            flashcards,
            this.creatorId,
            this.isPublic,
            this.examples || [],
            this.createdAt
        );
    }
}

export class FlashcardDeck extends Deck<FlashcardData> {
    constructor(
        _id: string,
        name: string,
        description: string,
        elements: FlashcardData[],
        creatorId: string,
        isPublic: boolean,
        examples: Example[],
        createdAt: string
    ) {
        super(_id, name, description, elements, creatorId, isPublic, examples, createdAt);
    }

    convertToFlashcards(): FlashcardDeck {
        return this;
    }
}

export interface CourseData {
    _id: string;
    name: string;
    description: string;
    lessons: string[]; 
    creatorId: string;
    isPublic: boolean;
    createdAt: string;
}

export interface LessonData {
    _id: string;
    name: string;
    description: string;
    kanjiDecks: KanjiDeck[];
    wordDecks: WordDeck[];
    grammarDecks: GrammarDeck[];
    creatorId: string;
    isPublic: boolean;
    createdAt: string;
}