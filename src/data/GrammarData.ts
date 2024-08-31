import {ExampleData} from "./general-types.ts";
import {DeckData} from "./DeckData.ts";
import {FlashcardDeck, FlashcardData} from "./FlashcardData.ts";

export interface GrammarData {
    _id: string;
    structure: string;
    hint: string;
    description: string;
    examples: ExampleData[];
    jlpt: number;
    frequency: number;
    example_contexts: string[];
    __v: number;
}

export class GrammarDeck extends DeckData<GrammarData> {
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

