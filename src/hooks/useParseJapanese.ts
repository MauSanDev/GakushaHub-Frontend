import {useQuery} from 'react-query';
import {ApiClient} from '../services/ApiClient';
import {marked} from 'marked';

interface ParsedTextResult {
    processedText: string;
}

const fetchParsedText = async (text: string): Promise<ParsedTextResult> => {
    return ApiClient<ParsedTextResult>(`/api/parse?text=${encodeURIComponent(text)}`);
};

const parseToHtml = async (processedText: string): Promise<string> => {
    const htmlText = await marked(processedText);
    return htmlText.replace(/\[(.*?)\]/g, (p1) => {
        return '<span class="relative tooltip-trigger cursor-pointer hover:bg-yellow-200 m-0 inline-block indent-0" data-word="' + p1.replace(/\((.*?)\|.*?\)/g, '$1') + '" data-reading="yourReading" data-meaning="yourMeaning" >'
            + p1.replace(/\((.*?)\|(.*?)\)/g, '<ruby>$1<rt>$2</rt></ruby>') + '</span>';
    })
        .replace(/<h1>/g, '<h1 class="text-2xl font-bold pb-5 text-black align-center">')
        .replace(/<h2>/g, '<h2 class="text-m font-bold pb-2 pt-5 text-black align-center">');
};

export const useParseJapanese = (text: string) => {
    return useQuery(['parsedText', text], async () => {
        const { processedText } = await fetchParsedText(text);
        return parseToHtml(processedText);
    }, {
        staleTime: 5 * 60 * 1000,
    });
};