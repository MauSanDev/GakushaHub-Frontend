import { usePaginatedData } from './usePaginatedData.ts';
import {CourseData} from "../data/CourseData.ts";
import {useAuth} from "../context/AuthContext.tsx";

export const usePaginatedCourse = (page: number, limit: number) => {
    const { userData } = useAuth();
    const { data, error, resetQueries, ...rest } =  usePaginatedData<CourseData>('/api/course/paginated', page, limit, userData?._id);

    if (!userData || !userData._id) {
        throw new Error("Pagination data not available");
    }
    
    return { data, error, resetQueries, ...rest };
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