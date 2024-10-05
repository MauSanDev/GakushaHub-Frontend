import {DeckData} from "./DeckData.ts";

export interface GrammarData {
    _id: string;
    structure: string;
    hint: string;
    description: string;
    examples: string[];
    jlpt: number;
    frequency: number;
    example_contexts: string[];
    bookId: string; 
    formality: "formal" | "informal"; 
    usage_context: "spoken" | "written"; 
    expression_type: string[]; 
    keywords: string[]; 
    __v: number;
}

export class GrammarDeck extends DeckData<GrammarData> {
    
}