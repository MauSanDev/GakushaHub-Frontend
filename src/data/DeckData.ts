import {ExampleData} from "./GeneralTypes.ts";
import {KanjiDeck} from "./KanjiData.ts";
import {WordDeck} from "./WordData.ts";
import {GrammarDeck} from "./GrammarData.ts";

export interface BaseDeckData {
    _id: string;
    name: string;
    description: string;
    elements: string[];
    creatorId: string;
    isPublic: boolean;
    examples: ExampleData[];
    createdAt: string;
}

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
}



export function isKanjiDeck(deck: DeckType): deck is KanjiDeck {
    return (deck as KanjiDeck).elements[0]?.kanji !== undefined;
}

export function isWordDeck(deck: DeckType): deck is WordDeck {
    return (deck as WordDeck).elements[0]?.word !== undefined;
}

export function isGrammarDeck(deck: DeckType): deck is GrammarDeck {
    return (deck as GrammarDeck).elements[0]?.structure !== undefined;
}

export type DeckType = KanjiDeck | WordDeck | GrammarDeck;
