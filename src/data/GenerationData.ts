export interface GeneratedData {
    _id: string, 
    topic: string,
    style: string,
    length: number,
    jlptLevel: number,
    prioritization: {
        grammar: [string],
        words: [string],
        kanji: [string]
    },
    generatedText: string,
    createdAt: string
}