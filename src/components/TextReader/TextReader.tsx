import React, { useState, useEffect } from 'react';
import { FaCog, FaEye, FaEyeSlash } from 'react-icons/fa';
import { marked } from 'marked';
import { WordData } from '../../data/WordData.ts';


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
    const [wordCache, setWordCache] = useState<{ [key: string]: WordData }>({});


    const toggleFurigana = () => {
        setShowFurigana(!showFurigana);

        const rtElements = document.querySelectorAll('.prose rt');
        rtElements.forEach(rt => {
            if (showFurigana) {
                rt.classList.add('hidden');
            } else {
                rt.classList.remove('hidden');
            }
        });
    };
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
                    return '<span class="relative tooltip-trigger cursor-pointer hover:bg-yellow-200 m-0 inline-block indent-0" data-word="' + p1.replace(/\((.*?)\|.*?\)/g, '$1') + '" data-reading="yourReading" data-meaning="yourMeaning" >'
                        + p1.replace(/\((.*?)\|(.*?)\)/g, '<ruby>$1<rt>$2</rt></ruby>') + '</span>';
                })
                    .replace(/<h1>/g, '<h1 class="text-2xl font-bold pb-5 text-black align-center">')
                    .replace(/<h2>/g, '<h2 class="text-m font-bold pb-2 pt-5 text-black align-center">');
                
                setFormattedContent(formattedText);
            } catch (error) {
                console.error('Error processing conntent:', error);
                setFormattedContent('Error processing conntent.');
            }
        };

        processContent();
    }, [content]);

    const injectTooltip = async (event: Element) => {
        const word = event.getAttribute('data-word') ?? "";

        if (!word)
        {
            return;
        }
        
        if (wordCache[word]) {

            console.log("returning from cache?")
            displayTooltip(event, wordCache[word]);
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/words?keywords=${word}`);
            if (!response.ok) {
                throw new Error(`Error en la API: ${response.statusText}`);
            }

            const wordData = await response.json();
            
            setWordCache((prevCache) => ({
                ...prevCache,
                [word]: wordData[0]
            }));
            
            console.log(`added ${word} and ${wordData[0]} to cache`)
            
            displayTooltip(event, wordData[0]);
        } catch (error) {
            console.error('Error fetching word data:', error);
        }
    };
    
    const displayTooltip = (event:Element, wordData : WordData) => {
        
        if (!wordData)
        {
            console.log("no word provided for tooltip")
            return;
        }
        
        document.querySelectorAll('.tooltip-content').forEach(tooltip => tooltip.remove());

        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip-content border-gray-300 border indent-0 absolute left-0 top-full mb-2 p-2 bg-white text-black rounded opacity-0 transition-opacity duration-300 whitespace-normal z-50';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.3s';
        tooltip.style.width = "300px";
        tooltip.style.letterSpacing = "1"; 
        tooltip.style.lineHeight = "1"; 
        tooltip.innerHTML = `
            <span class="font-bold text-blue-500 text-m">${wordData.word}</span>
            <span class="text-gray-500 text-xs">(${wordData.readings.join(";")})</span> <br>
            <span class="text-gray-800 text-xs">${wordData.meanings.map((meaning) => meaning.en).slice(0,3).join("; ")}</span>
        `;
        
        event.appendChild(tooltip);

        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 0);

        setActiveTooltip(wordData.word);
    }

    useEffect(() => {
        const triggers = document.querySelectorAll('.tooltip-trigger');

        triggers.forEach(trigger => {
            trigger.addEventListener('click', (event) => {
                event.stopPropagation();
                injectTooltip(trigger);
            });
        });

        document.addEventListener('click', () => {
            document.querySelectorAll('.tooltip-content').forEach(tooltip => {
                tooltip.style.opacity = '0';
                setTimeout(() => tooltip.remove(), 300);
            });
            setActiveTooltip(null);
        });
    }, [formattedContent]);

    return (
        <div className="whitemax-w-relative p-8 pb-24 bg-white border border-gray-300 rounded-md shadow-lg">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <div className="absolute top-14 right-14 flex items-center space-x-2">
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
                dangerouslySetInnerHTML={{ __html:  formattedContent }}
            />
        </div>
    );
};

export default TextReader;