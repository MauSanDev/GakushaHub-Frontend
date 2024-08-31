import { usePaginatedData } from './usePaginatedData.ts';

export const usePaginatedCourse = (page: number, limit: number) => {
    return usePaginatedData<Course>('/api/course/paginated', page, limit);
};

export interface Deck {
    _id: string;
    name: string;
}


export class Lesson {
    _id: string;
    name: string;
    kanjiDecks: Deck[];
    grammarDecks: Deck[];
    wordDecks: Deck[];

    constructor(_id: string, name: string, kanjiDecks: Deck[], grammarDecks: Deck[], wordDecks: Deck[]) {
        this._id = _id;
        this.name = name;
        this.kanjiDecks = kanjiDecks;
        this.grammarDecks = grammarDecks;
        this.wordDecks = wordDecks;
    }
    
    getAllDecks(): string[] {
        const decks = [
            ...this.kanjiDecks,
            ...this.grammarDecks,
            ...this.wordDecks
        ];
    
        return decks
            .map((deck) => deck.name.replace(/ - (Words|Kanji|Grammar)$/, ''))
            .filter((name, index, self) => self.indexOf(name) === index);
    }
}

export interface Course {
    _id: string;
    name: string;
    lessons: Lesson[];
}