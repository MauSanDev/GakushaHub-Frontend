import React from 'react';
import { LessonData } from '../../data/data-structures';

interface LessonBoxProps {
    lesson: LessonData;
}

const LessonBox: React.FC<LessonBoxProps> = ({ lesson }) => {
    return (
        <div className="relative bg-white p-6 rounded-lg shadow-md mb-6 text-left border-2 border-gray-200 transform transition-transform duration-300 hover:scale-105 hover:border-blue-300">
            <h1 className="text-2xl font-bold mb-2 text-blue-400">{lesson.name}</h1>
            <p className="text-gray-700 mb-4">{lesson.description}</p>
            <div className="text-sm text-gray-500">
                <span>Kanji Decks: {lesson.kanjiDecks.length}</span> |{' '}
                <span>Word Decks: {lesson.wordDecks.length}</span> |{' '}
                <span>Grammar Decks: {lesson.grammarDecks.length}</span>
            </div>
        </div>
    );
};

export default LessonBox;