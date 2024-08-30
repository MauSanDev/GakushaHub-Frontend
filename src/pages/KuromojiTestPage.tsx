import React, { useEffect, useState } from 'react';
import TinySegmenter from 'tiny-segmenter';

const TinySegmenterTestPage: React.FC = () => {
    const [tokens, setTokens] = useState<string[]>([]);

    useEffect(() => {
        const segmentText = () => {
            const segmenter = new TinySegmenter();
            const text = 'むかしむかし、遠い山のふもとに小さな村がありました。その村には、美しい娘と勇敢な若侍が住んでいました。二人は幼いころからの友人で、お互いに深く愛し合うようになりました。しかし、娘の父親は、彼女を遠い国の裕福な商人に嫁がせようと決めていました。若侍は娘と一緒に生きることを夢見て、毎晩彼女の家に忍び込み、村を逃げ出す計画を立てました。\n' +
                '\n' +
                'ある晩、二人はついに村を抜け出そうとしましたが、村の神様はこの禁じられた愛を許しませんでした。山に深い霧をかけ、二人を迷わせたのです。霧の中でさまよい続けた二人は、ついに道を見失い、力尽きてしまいました。\n' +
                '\n' +
                '失意の中、娘は決意しました。「私が犠牲になれば、神様は彼を許してくれるかもしれない」。娘は若侍に別れを告げ、神社で祈りを捧げました。すると、不思議なことに霧は消え去り、村は再び平穏を取り戻しました。しかし、娘はそのまま神様に召され、彼女の魂は村を見守る桜の木となりました。\n' +
                '\n' +
                '若侍は毎年春になると、その桜の木の下で娘を思い出し、静かに祈りを捧げました。桜の花は村中を美しく染め上げ、村人たちはその木を見るたびに、二人の純粋な愛と犠牲の物語を思い出すのでした。';

            const tokenizedWords = segmenter.segment(text);
            setTokens(tokenizedWords);
        };

        segmentText();
    }, []);

    return (
        <div className="text-xl leading-relaxed p-8">
            {tokens.map((word, index) => (
                <span
                    key={index}
                    className="hover:bg-blue-100"
                    style={{ padding: '0 2px' }}
                >
                    {word}
                </span>
            ))}
        </div>
    );
};

export default TinySegmenterTestPage;