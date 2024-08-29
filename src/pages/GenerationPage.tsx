import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { marked } from 'marked';
import loadingIcon from '../assets/loading-icon.svg';

const isDeveloping = true; // Cambia a 'false' cuando quieras usar el endpoint real

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
            let htmlText = '';
            if (isDeveloping) {
                // Modo de desarrollo: Genera un texto de ejemplo
                htmlText = `
                    <p><ruby>開発中<rt>かいはつちゅう</rt></ruby>のテキストです。</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    <p>このテキストは実際の生成テキストではありません。</p>
                `;
            } else {
                // Modo de producción: Usa el endpoint real
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
                htmlText = await marked(data.generatedText);

                // Reemplazo de [[ ]] por etiquetas ruby
                htmlText = htmlText.replace(/\[\[(.*?)\]\]/g, '<ruby>$1</ruby>');
            }

            setGeneratedText(htmlText);
        } catch (err) {
            setError(`Error generating text: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    const isGenerateEnabled = topic.trim() !== '' && style.trim() !== '' && length >= 150 && length <= 800;

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

            {/* Zona de input y configuración flotante */}
            <div className="p-3 bg-white border border-gray-200 rounded-md shadow-lg w-full max-w-3xl fixed bottom-0 left-1/2 transform -translate-x-1/2">
                    <div className="flex flex-wrap gap-3">
                        <div className="flex flex-col sm:flex-1">
                            <span className="text-gray-500 text-[10px]">Style</span>
                            <input
                                id="style"
                                type="text"
                                placeholder="Style (max 40 characters)"
                                value={style}
                                onChange={(e) => setStyle(e.target.value)}
                                maxLength={40}
                                className={`p-1.5 text-sm border rounded w-full ${style ? 'border-blue-500' : ''}`}
                                disabled={loading}
                            />
                        </div>
                        <div className="flex flex-col sm:w-1/6">
                            <span className="text-gray-500 text-[10px]">Length</span>
                            <input
                                id="length"
                                type="number"
                                placeholder="Length (150-800)"
                                value={length}
                                onChange={(e) => setLength(Math.min(800, Number(e.target.value)))}
                                min={150}
                                max={800}
                                className={`p-1.5 text-sm border rounded w-full ${length >= 150 && length <= 800 ? 'border-blue-500' : ''}`}
                                disabled={loading}
                            />
                        </div>
                        <div className="flex flex-col sm:w-1/4">
                            <span className="text-gray-500 text-[10px]">Level</span>
                            <select
                                id="jlptLevel"
                                value={jlptLevel}
                                onChange={(e) => setJlptLevel(Number(e.target.value))}
                                className={`p-1.5 text-sm border rounded w-full ${jlptLevel ? 'border-blue-500' : ''}`}
                                disabled={loading}
                            >
                                {[5, 4, 3, 2, 1].map(level => (
                                    <option key={level} value={level}>
                                        JLPT {level}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3">
                        <div className="flex flex-col sm:flex-1">
                            <textarea
                                id="topic"
                                placeholder="Enter the topic (max 140 characters)"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                maxLength={140}
                                className={`p-1.5 text-sm border rounded w-full h-8 resize-none ${topic ? 'border-blue-500' : ''}`}
                                disabled={loading}
                                rows={1}
                                style={{ height: 'auto' }}
                                onInput={(e) => {
                                    const textarea = e.target as HTMLTextAreaElement;
                                    textarea.style.height = 'auto';
                                    textarea.style.height = `${Math.min(textarea.scrollHeight, 80)}px`;
                                }}
                            />
                        </div>
                        <div className="flex sm:w-1/4 justify-end">
                            <button
                                onClick={handleGenerate}
                                className={`p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center justify-center w-full text-sm ${!isGenerateEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={loading || !isGenerateEnabled}
                            >
                                <FaPaperPlane className="mr-1.5" />
                                Generate
                            </button>
                        </div>
                    </div>
            </div>
        </div>
    );
};

export default GenerationPage;