import { FaMinus, FaClipboardCheck, FaCheck } from "react-icons/fa";
import { useState } from "react";
import {GrammarData} from "../../data/GrammarData.ts";

interface SentenceInputProps {
    index: number;
    onRemove: (index: number) => void;
    isLast: boolean;
    grammarData: GrammarData;
}

const SentenceInput = ({ index, onRemove, isLast, grammarData }: SentenceInputProps) => {
    const [sentence, setSentence] = useState<string>('');
    const [score, setScore] = useState<number | null>(null);
    
    const handleCorrection = () => {
        if (sentence === "") return;
        
        console.log(grammarData.structure)
        const randomScore = Math.floor(Math.random() * 10) + 1;
        setScore(randomScore);
    };

    const getScoreColor = (score: number) => {
        if (score >= 1 && score <= 4) return "red";
        if (score >= 5 && score <= 6) return "orange";
        if (score >= 7 && score <= 10) return "green";
        return "gray";
    };

    return (
        <div className="flex items-center mb-2">
            <input
                type="text"
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}  
                maxLength={120}
                className={`w-full p-2 bg-transparent border-b focus:outline-none text-white ${
                    score !== null ? 'cursor-not-allowed' : ''
                }`}
                style={{
                    borderColor: score !== null ? getScoreColor(score!) : 'gray',
                }}
                disabled={score !== null} 
                placeholder="Enter your sentence"
            />
            {score === null ? (
                <>
                    <button
                        onClick={() => onRemove(index)}
                        className="ml-1 p-2 text-white bg-gray-900 hover:bg-red-500 rounded-full text-xs"
                        disabled={isLast} 
                    >
                        <FaMinus />
                    </button>
                    <button
                        onClick={handleCorrection}
                        className="ml-1 p-2 text-white bg-gray-900 hover:bg-green-500 rounded-full text-xs"
                    >
                        <FaClipboardCheck />
                    </button>
                </>
            ) : (
                <button
                    className={`ml-2 p-2 rounded-full text-xs text-white inline-flex items-center`}
                    style={{ backgroundColor: getScoreColor(score!) }}
                >
                    <FaCheck className="mr-2" />
                    <span className={"font-bold"}>{score}/10</span>
                </button>
            )}
        </div>
    );
};

export default SentenceInput;