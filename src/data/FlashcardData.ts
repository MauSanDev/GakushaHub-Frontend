import {ExampleData} from "./GeneralTypes.ts";
import {DeckData, DeckType, isKanjiDeck, isWordDeck} from "./DeckData.ts";
import {WordData} from "./WordData.ts";
import {KanjiData} from "./KanjiData.ts";
import {CollectionTypes} from "./CollectionTypes.tsx";

export interface FlashcardData {
    id: string;
    front: string;
    back: string;
    readings: string[];
    meanings: string[];
    type: "kanji" | "word" | "grammar";
    examples: ExampleData[];
    jlpt: number;
}

export class FlashcardDeck extends DeckData<FlashcardData> {
    constructor(
        _id: string,
        name: string,
        description: string,
        elements: FlashcardData[],
        creatorId: string,
        isPublic: boolean,
        examples: ExampleData[],
        createdAt: string
    ) {
        super(_id, name, description, elements, creatorId, isPublic, examples, createdAt);
    }

    convertToFlashcards(): FlashcardDeck {
        return this;
    }
}

export function convertToFlashcardDeck(deck: DeckType): FlashcardDeck {
    let flashcards: FlashcardData[] = [];

    if (isKanjiDeck(deck)) {
        flashcards = deck.elements.map((element: KanjiData) => ({
            id: element._id,
            front: element.kanji || "",
            back: `${element.readings?.kunyomi.join(";") || ""}\n${element.readings?.onyomi.join(";") || ""}`,
            readings: [
                ...element.readings?.onyomi || [],
                ...element.readings?.kunyomi || [],
                ...(element.readings?.others || []),
            ],
            meanings: element.meanings?.map((meaning) => meaning.en) || [],
            type: "kanji",
            examples: element.examples || [],
            jlpt: element.jlpt,
        }));
    } else if (isWordDeck(deck)) {
        flashcards = deck.elements.map((element: WordData) => ({
            id: element._id,
            front: element.word || "",
            back: element.readings.join("; ") || "",
            readings: element.readings || [],
            meanings: element.meanings?.map((meaning) => meaning.en) || [],
            type: "word",
            examples: element.examples || [],
            jlpt: element.jlpt,
        }));
    } else {
        throw new Error("Unknown deck type");
    }

    return new FlashcardDeck(
        deck._id,
        deck.name,
        deck.description,
        flashcards,
        deck.creatorId,
        deck.isPublic,
        deck.examples || [],
        deck.createdAt
    );
}

export function convertArrayToFlashcardDeck<T>(elements: T[], deckName: string, deckType: CollectionTypes): FlashcardDeck {
    let flashcards: FlashcardData[] = [];

    if (deckType === CollectionTypes.Kanji) {
        flashcards = elements.map((element: any) => ({
            id: element._id,
            front: element.kanji || "",
            back: `${element.readings?.kunyomi.join(";") || ""}\n${element.readings?.onyomi.join(";") || ""}`,
            readings: [
                ...element.readings?.onyomi || [],
                ...element.readings?.kunyomi || [],
                ...(element.readings?.others || []),
            ],
            meanings: element.meanings?.map((meaning: any) => meaning.en) || [],
            type: "kanji",
            examples: element.examples || [],
            jlpt: element.jlpt,
        }));
    } else if (deckType === CollectionTypes.Word) {
        flashcards = elements.map((element: any) => ({
            id: element._id,
            front: element.word || "",
            back: element.readings.join("; ") || "",
            readings: element.readings || [],
            meanings: element.meanings?.map((meaning: any) => meaning.en) || [],
            type: "word",
            examples: element.examples || [],
            jlpt: element.jlpt,
        }));
    } else {
        throw new Error("Unknown deck type");
    }

    return new FlashcardDeck(
        "",
        deckName,
        "", 
        flashcards,
        "", 
        true, 
        [], 
        "" 
    );
}