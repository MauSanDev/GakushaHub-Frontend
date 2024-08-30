import React, { useState, useEffect } from 'react';
import { FaCog, FaEye, FaEyeSlash } from 'react-icons/fa';
import { marked } from 'marked';

interface TextReaderProps {
    title: string;
    content: string;
}

const TextReader: React.FC<TextReaderProps> = ({ title, content }) => {
    const [showFurigana, setShowFurigana] = useState(true);
    const [fontSize, setFontSize] = useState(18);
    const [letterSpacing, setLetterSpacing] = useState(1);
    const [lineHeight, setLineHeight] = useState(1.8);
    const [showConfig, setShowConfig] = useState(false);
    const [formattedContent, setFormattedContent] = useState('');
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
    const [wordCache, setWordCache] = useState<{ [key: string]: any }>({});

    const toggleFurigana = () => setShowFurigana(!showFurigana);

    const handleSliderChange = (setter: React.Dispatch<React.SetStateAction<number>>) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setter(Number(event.target.value));
        };

    useEffect(() => {
        const processContent = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/parse?text=${encodeURIComponent(content)}`);
                if (!response.ok) {
                    throw new Error(`Error en la API: ${response.statusText}`);
                }

                const data = await response.json();
                const filteredContent = data.processedText;
                const htmlText = await marked(filteredContent);
                const formattedText = htmlText.replace(/\[(.*?)\]/g, (match, p1) => {
                    return '<span class="relative tooltip-trigger cursor-pointer hover:bg-yellow-200 m-0 inline-block indent-0" data-word="' + p1.split('|')[0] + '" >'
                        + p1.replace(/\((.*?)\|(.*?)\)/g, '<ruby>$1<rt>$2</rt></ruby>') + '</span>';
                });

                setFormattedContent(formattedText);
            } catch (error) {
                console.error('Error processing content:', error);
                setFormattedContent('Error processing content.');
            }
        };

        processContent();
    }, [content]);

    const injectTooltip = async (event: MouseEvent) => {
        const word = (event.currentTarget as HTMLElement).getAttribute('data-word');

        if (!word) return;

        // Verificar si la palabra ya está en cache
        if (wordCache[word]) {
            displayTooltip(event, wordCache[word]);
            return;
        }

        try {
            // Hacer request al endpoint con la palabra
            const response = await fetch(`http://localhost:3000/api/words?keywords=${word}`);
            if (!response.ok) {
                throw new Error(`Error en la API: ${response.statusText}`);
            }

            const wordData = await response.json();

            // Cachear el resultado
            setWordCache((prevCache) => ({
                ...prevCache,
                [word]: wordData[0]
            }));

            // Mostrar el tooltip con los datos recibidos
            displayTooltip(event, wordData[0]);
        } catch (error) {
            console.error('Error fetching word data:', error);
        }
    };

    const displayTooltip = (event: MouseEvent, wordData: any) => {
        // Eliminar tooltips existentes
        document.querySelectorAll('.tooltip-content').forEach(tooltip => tooltip.remove());

        const meaning = wordData.meanings.map((m: any) => m.en).join(', ') || 'No meaning available';

        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip-content border-gray-300 border indent-0 absolute left-0 top-full mb-2 p-2 bg-white text-black rounded opacity-0 transition-opacity duration-300 whitespace-nowrap z-50';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.3s';
        tooltip.innerHTML = `
            <span class="font-bold text-blue-500 text-m">${wordData.word}</span>
            <span class="text-gray-500 text-xs">${meaning}</span>
        `;

        // Activar la animación de fade in
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 0);
    };

    useEffect(() => {
        const triggers = document.querySelectorAll('.tooltip-trigger');

        triggers.forEach(trigger => {
            trigger.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevenir que el manejador de click en el documento cierre el tooltip inmediatamente
                injectTooltip(event as unknown as MouseEvent);
            });
        });

        // Cerrar el tooltip al hacer clic fuera
        document.addEventListener('click', () => {
            document.querySelectorAll('.tooltip-content').forEach(tooltip => {
                tooltip.style.opacity = '0';
                setTimeout(() => tooltip.remove(), 300);
            });
            setActiveTooltip(null);
        });
    }, [formattedContent]);

    return (
        <div className="relative p-8 pb-24 bg-white border border-gray-300 rounded-md shadow-lg">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <div className="absolute top-4 right-4 flex items-center space-x-2">
                <button
                    className={`text-white flex items-center space-x-1 px-2 py-1 rounded ${showFurigana ? 'bg-blue-500' : 'bg-gray-400'}`}
                    onClick={toggleFurigana}
                >
                    {showFurigana ? <FaEye /> : <FaEyeSlash />}
                    <span className="text-xs">ふりがな</span>
                </button>
                <div className="relative">
                    <button
                        className="text-white bg-blue-500 hover:bg-blue-600 p-1 rounded"
                        onClick={() => setShowConfig(!showConfig)}
                    >
                        <FaCog />
                    </button>
                    {showConfig && (
                        <div className="absolute right-0 mt-2 w-56 p-4 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                            <div className="flex items-center justify-between">
                                <label className="text-xs text-gray-700">Text Size</label>
                                <input
                                    type="range"
                                    min="10"
                                    max="30"
                                    value={fontSize}
                                    onChange={handleSliderChange(setFontSize)}
                                    className="ml-2"
                                />
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <label className="text-xs text-gray-700">Letter Spacing</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="5"
                                    value={letterSpacing}
                                    onChange={handleSliderChange(setLetterSpacing)}
                                    className="ml-2"
                                />
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <label className="text-xs text-gray-700">Line Height</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="3"
                                    step="0.1"
                                    value={lineHeight}
                                    onChange={handleSliderChange(setLineHeight)}
                                    className="ml-2"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div
                className="prose mt-4 p-2"
                style={{
                    fontSize: `${fontSize}px`,
                    letterSpacing: `${letterSpacing}px`,
                    lineHeight: lineHeight,
                    textIndent: '2em'
                }}
                dangerouslySetInnerHTML={{ __html: showFurigana ? formattedContent : formattedContent.replace(/<rt>.*?<\/rt>/g, '') }}
            />
        </div>
    );
};

export default TextReader;