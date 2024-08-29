import { useState } from 'react';
import { marked } from 'marked';
import loadingIcon from '../assets/loading-icon.svg';

const GenerationPage: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [style, setStyle] = useState('');
    const [length, setLength] = useState(150);
    const [jlptLevel, setJlptLevel] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [generatedText, setGeneratedText] = useState('');

    const handleGenerate = async () => {
        if (!topic || !style || length < 150 || length > 800) {
            setError('Topic, Style, and Length (between 150 and 800) are required.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3000/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic,
                    style,
                    length,
                    jlptLevel,
                    prioritization: null,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate text.');
            }

            const data = await response.json();

            // Convertir markdown a HTML de manera asíncrona
            let htmlText = await marked(data.generatedText);

            // Reemplazo de [[ ]] por etiquetas ruby
            htmlText = htmlText.replace(/\[\[(.*?)\]\]/g, '<ruby>$1</ruby>');

            setGeneratedText(htmlText);
        } catch (err) {
            setError(`Error generating text: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full p-4">
            {/* Contenedor del texto generado */}
            <div className="flex-1 p-8 bg-white border border-gray-300 rounded-md overflow-y-auto relative max-w-4xl w-full shadow-lg">
                {loading && (
                    <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80 z-10">
                        <img src={loadingIcon} alt="Loading..." className="w-16 h-16" />
                    </div>
                )}
                <div
                    className="prose max-w-none mx-auto"
                    dangerouslySetInnerHTML={{ __html: generatedText }}
                />
                {error && <p className="text-red-500 text-center">{error}</p>}
            </div>

            {/* Zona de input y configuración */}
            <div className="p-4 mt-8 bg-white border border-gray-300 rounded-md shadow-lg w-full max-w-3xl">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col sm:flex-1">
                        <label htmlFor="topic" className="text-gray-700">Topic</label>
                        <textarea
                            id="topic"
                            placeholder="Enter the topic (max 140 characters)"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            maxLength={140}
                            className="p-2 border rounded h-20 resize-none"
                            disabled={loading}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-1">
                        <label htmlFor="style" className="text-gray-700">Style</label>
                        <input
                            id="style"
                            type="text"
                            placeholder="Style (max 40 characters)"
                            value={style}
                            onChange={(e) => setStyle(e.target.value)}
                            maxLength={40}
                            className="p-2 border rounded"
                            disabled={loading}
                        />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <div className="flex flex-col sm:w-1/3">
                        <label htmlFor="length" className="text-gray-700">Length</label>
                        <input
                            id="length"
                            type="number"
                            placeholder="Length (150-800)"
                            value={length}
                            onChange={(e) => setLength(Number(e.target.value))}
                            min={150}
                            max={800}
                            className="p-2 border rounded w-full"
                            disabled={loading}
                        />
                    </div>
                    <div className="flex flex-col sm:w-1/3">
                        <label htmlFor="jlptLevel" className="text-gray-700">JLPT Level</label>
                        <select
                            id="jlptLevel"
                            value={jlptLevel}
                            onChange={(e) => setJlptLevel(Number(e.target.value))}
                            className="p-2 border rounded w-full"
                            disabled={loading}
                        >
                            {[5, 4, 3, 2, 1].map(level => (
                                <option key={level} value={level}>
                                    JLPT {level}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col sm:w-1/3 mt-4 sm:mt-0">
                        <button
                            onClick={handleGenerate}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition w-full"
                            disabled={loading}
                        >
                            Generate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenerationPage;