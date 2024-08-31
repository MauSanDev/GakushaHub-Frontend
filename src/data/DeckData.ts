import {ExampleData} from "./GeneralTypes.ts";
import {FlashcardDeck} from "./FlashcardData.ts";

export class DeckData<T> {
    _id: string;
    name: string;
    description: string;
    elements: T[];
    creatorId: string;
    isPublic: boolean;
    examples: ExampleData[];
    createdAt: string;

    constructor(
        _id: string,
        name: string,
        description: string,
        elements: T[],
        creatorId: string,
        isPublic: boolean,
        examples: ExampleData[],
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