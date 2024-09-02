import {DeckData} from "./DeckData.ts";
import {ExampleData, TranslationData} from "./GeneralTypes.ts";
import {FlashcardData, FlashcardDeck} from "./FlashcardData.ts";

export interface KanjiData {
    _id: string;
    kanji: string;
    readings: Reading;
    meanings: TranslationData[];
    jlpt: number;
    common: boolean;
    notes: string[];
    examples: ExampleData[];
    strokes: number;
    unicode: string;
    __v: number;
}

export interface Reading {
    onyomi: string[];
    kunyomi: string[];
    others: string[];
}


export class KanjiDeck extends DeckData<KanjiData> {
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

