import { useMutation } from 'react-query';
import { ApiClient } from '../services/ApiClient';

interface Deck {
    deckName: string;
    elements: string[];
    deckType: 'kanji' | 'word' | 'grammar';
}

interface CreateCourseParams {
    courseId: string | null;
    courseName: string;
    lessonName: string;
    decks: Deck[];
    // creatorId: string;
}

const createCourse = async (params: CreateCourseParams): Promise<void> => {
    await ApiClient.post<void>('/api/course/build', params, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const useBuildCourse = () => {
    return useMutation((params: CreateCourseParams) => createCourse(params));
};