import React, { useState } from 'react';

interface SaveDeckInputProps {
    onSave: (courseName: string, lessonName: string, deckName: string) => void;
}

const SaveDeckInput: React.FC<SaveDeckInputProps> = ({ onSave }) => {
    const [inputs, setInputs] = useState<string[]>(['', '', '']);
    const [saved, setSaved] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === '/' || e.key === 'Enter') {
            e.preventDefault();
            if (inputs[index].trim() && index < 2) {
                setInputs((prev) => {
                    const newInputs = [...prev];
                    newInputs[index + 1] = '';
                    return newInputs;
                });
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        setInputs((prev) => {
            const newInputs = [...prev];
            newInputs[index] = value;
            return newInputs;
        });
    };

    const handleSave = async () => {
        const [courseName, lessonName, deckName] = inputs;
        if (courseName && lessonName && deckName) {
            await onSave(courseName.trim(), lessonName.trim(), deckName.trim());
            setSaved(true);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {inputs.slice(0, 3).map((input, index) => (
                <input
                    key={index}
                    type="text"
                    value={input}
                    placeholder={['Course', 'Lesson', 'Deck'][index]}
                    onChange={(e) => handleInputChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    disabled={saved}
                    className="border border-gray-300 rounded px-2 py-1 focus:outline-none"
                />
            ))}
            <button
                onClick={handleSave}
                className={`px-4 py-2 rounded ${
                    saved ? 'bg-green-500 text-white cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                disabled={saved}
            >
                {saved ? 'Saved' : 'Save'}
            </button>
        </div>
    );
};

export default SaveDeckInput;