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
    readingDecks?: Deck[];  // Añadimos opcionalmente "readingDecks" para lecciones que las incluyan.

    constructor(_id: string, name: string, kanjiDecks: Deck[], grammarDecks: Deck[], wordDecks: Deck[], readingDecks?: Deck[]) {
        this._id = _id;
        this.name = name;
        this.kanjiDecks = kanjiDecks;
        this.grammarDecks = grammarDecks;
        this.wordDecks = wordDecks;
        this.readingDecks = readingDecks || [];
    }
}

export class Course {
    _id: string;
    name: string;
    lessons: Lesson[];
    creatorId: {
        _id: string;
        name: string;
    };
    description?: string;
    isPublic?: boolean;

    constructor(_id: string, name: string, lessons: Lesson[], creatorId: { _id: string, name: string }, description?: string, isPublic?: boolean) {
        this._id = _id;
        this.name = name;
        this.lessons = lessons;
        this.creatorId = creatorId;
        this.description = description;
        this.isPublic = isPublic || false;
    }
}

export class UserCourses {
    userId: string;
    courses: Course[];

    constructor(userId: string, courses: Course[]) {
        this.userId = userId;
        this.courses = courses;
    }
}