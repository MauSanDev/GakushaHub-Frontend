import {ExampleData} from "./general-types.ts";
import {DeckData} from "./DeckData.ts";

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