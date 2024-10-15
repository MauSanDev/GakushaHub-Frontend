export interface CourseData {
    _id: string;
    name: string;
    description: string;
    lessons: string[];
    creatorId: string;
    institutionId: string;
    isPublic: boolean;
    createdAt: string;
}

export interface LessonData {
    _id: string;
    name: string;
    description: string;
    kanjiDecks: string[];
    wordDecks: string[];
    grammarDecks: string[];
    readingDecks: string[];
    creatorId: string;
    isPublic: boolean;
    createdAt: string;
}