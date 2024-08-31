import {ExampleData, TranslationData } from "./general-types.ts";
import {DeckData} from "./DeckData.ts";
import {FlashcardData, FlashcardDeck} from "./FlashcardData.ts";

export interface WordData {
    _id: string;
    word: string;
    readings: string[];
    meanings: TranslationData[];
    part_of_speech: string[];
    common: boolean;
    jlpt: number;
    notes: string[];
    related_words: ExampleData[];
    examples: ExampleData[];
    __v: number;
}

export class WordDeck extends DeckData<WordData> {
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
