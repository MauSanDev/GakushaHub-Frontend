import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import loadingIcon from '../assets/loading-icon.svg';
import TextReader from '../components/TextReader';

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
            if (isDeveloping) {
                setGeneratedText(
                    `むかしむかし、遠い山のふもとに小さな村がありました。その村には、美しい娘と勇敢な若侍が住んでいました。二人は幼いころからの友人で、お互いに深く愛し合うようになりました。しかし、娘の父親は、彼女を遠い国の裕福な商人に嫁がせようと決めていました。若侍は娘と一緒に生きることを夢見て、毎晩彼女の家に忍び込み、村を逃げ出す計画を立てました。

ある晩、二人はついに村を抜け出そうとしましたが、村の神様はこの禁じられた愛を許しませんでした。山に深い霧をかけ、二人を迷わせたのです。霧の中でさまよい続けた二人は、ついに道を見失い、力尽きてしまいました。

失意の中、娘は決意しました。「私が犠牲になれば、神様は彼を許してくれるかもしれない」。娘は若侍に別れを告げ、神社で祈りを捧げました。すると、不思議なことに霧は消え去り、村は再び平穏を取り戻しました。しかし、娘はそのまま神様に召され、彼女の魂は村を見守る桜の木となりました。

若侍は毎年春になると、その桜の木の下で娘を思い出し、静かに祈りを捧げました。桜の花は村中を美しく染め上げ、村人たちはその木を見るたびに、二人の純粋な愛と犠牲の物語を思い出すのでした。`
                );
            } else {
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
                setGeneratedText(data.generatedText);
            }
        } catch (err) {
            setError(`Error generating text: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    const isGenerateEnabled = topic.trim() !== '' && style.trim() !== '' && length >= 150 && length <= 800;

    return (
        <div className="flex flex-col items-center justify-center h-full w-full p-4">
            <div className="flex-1 p-8 rounded-md overflow-y-auto relative max-w-4xl w-full">
                {loading && (
                    <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80 z-10">
                        <img src={loadingIcon} alt="Loading..." className="w-16 h-16" />
                    </div>
                )}
                {generatedText  ? (
                    <TextReader title="Generated Text" content={generatedText} />
                ) : (<div className="flex items-center justify-center h-full mt-2"><h1
                    className="text-center text-4xl text-gray-300 font-bold  align-middle space-x-0">何読みたい？</h1></div>)}
                    {error && <p className="text-red-500 text-center">{error}</p>
            }


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