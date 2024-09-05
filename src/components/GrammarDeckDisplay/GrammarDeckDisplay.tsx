import { useState } from "react";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import SmallGrammarBox from "../SmallGrammarBox";
import { GrammarDeck } from "../../data/GrammarData";

interface GrammarDeckDisplayProps {
    decks: GrammarDeck[];
}

const GrammarDeckDisplay: React.FC<GrammarDeckDisplayProps> = ({ decks }) => {
    const [expandedDecks, setExpandedDecks] = useState<{ [key: string]: boolean }>({});

    const toggleExpand = (deckId: string) => {
        setExpandedDecks((prevState) => ({
            ...prevState,
            [deckId]: !prevState[deckId],
        }));
    };

    return (
        <div className="w-full">
            {decks.map((deck, index) => (
                <div key={`${deck._id}-${index}`} className="mb-6">
                    <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => toggleExpand(deck._id)}>
                        <div className="flex items-center gap-2">
                            <button className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:text-gray-200">
                                {expandedDecks[deck._id] ? <FaChevronDown /> : <FaChevronRight />}
                            </button>
                            <div className="font-bold text-gray-600 dark:text-gray-300">{deck.name}</div>
                            <span className="text-sm text-gray-500">({deck.elements.length} elements)</span>
                        </div>
                    </div>

                    {expandedDecks[deck._id] && (
                        <div className="transition-all duration-500 ease-in-out">
                            <div className="grid grid-cols-2 gap-4">
                                {deck.elements.map((grammarElement) => (
                                    <SmallGrammarBox
                                        key={grammarElement._id}
                                        result={grammarElement}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default GrammarDeckDisplay;