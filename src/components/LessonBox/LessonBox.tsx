import { LessonData } from "../../data/data-structures.tsx";

interface LessonBoxProps {
    lesson: LessonData;
}

const LessonBox: React.FC<LessonBoxProps> = ({ lesson }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h3 className="text-lg font-bold text-blue-500">{lesson.name}</h3>
            <p className="text-gray-700 mb-2">{lesson.description}</p>

            <div>
                <h4 className="font-semibold text-gray-800">Kanji Decks:</h4>
                {lesson.kanjiDecks.length > 0 ? (
                    lesson.kanjiDecks.map((deck, index) => (
                        <div key={index} className="text-gray-600">{deck.name}</div>
                    ))
                ) : (
                    <p className="text-gray-500">No hay Kanji decks.</p>
                )}
            </div>

            <div>
                <h4 className="font-semibold text-gray-800">Grammar Decks:</h4>
                {lesson.grammarDecks.length > 0 ? (
                    lesson.grammarDecks.map((deck, index) => (
                        <div key={index} className="text-gray-600">{deck.name}</div>
                    ))
                ) : (
                    <p className="text-gray-500">No hay Grammar decks.</p>
                )}
            </div>

            <div>
                <h4 className="font-semibold text-gray-800">Word Decks:</h4>
                {lesson.wordDecks.length > 0 ? (
                    lesson.wordDecks.map((deck, index) => (
                        <div key={index} className="text-gray-600">{deck.name}</div>
                    ))
                ) : (
                    <p className="text-gray-500">No hay Word decks.</p>
                )}
            </div>
        </div>
    );
};

export default LessonBox;