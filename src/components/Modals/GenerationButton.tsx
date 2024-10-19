import React, { useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import NewGenerationPage from "./NewGenerationPage.tsx";
import { useAuth } from "../../context/AuthContext.tsx";
import TertiaryButton from "../ui/buttons/TertiaryButton.tsx";
import { useElements } from '../../hooks/newHooks/useElements';
import { CollectionTypes } from "../../data/CollectionTypes.tsx";
import LoadingScreen from "../LoadingScreen.tsx";

interface GenerationButtonProps {
    termsDictionary: Record<CollectionTypes, string[]>;
    courseId: string;
    courseName: string;
    lessonName: string;
    deckName?: string;
}

const GenerationButton: React.FC<GenerationButtonProps> = ({ termsDictionary, deckName, lessonName, courseName, courseId }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { isPremium } = useAuth();

    const [kanjiTerms, setKanjiTerms] = useState<string[]>([]);
    const [wordTerms, setWordTerms] = useState<string[]>([]);
    const [grammarTerms, setGrammarTerms] = useState<string[]>([]);
    const [isLoadingTerms, setIsLoadingTerms] = useState(false);

    const { fetchElementsData: fetchKanjiData } = useElements(termsDictionary[CollectionTypes.Kanji], CollectionTypes.Kanji);
    const { fetchElementsData: fetchWordData } = useElements(termsDictionary[CollectionTypes.Word], CollectionTypes.Word);
    const { fetchElementsData: fetchGrammarData } = useElements(termsDictionary[CollectionTypes.Grammar], CollectionTypes.Grammar);

    const handleOpenModal = async () => {
        setIsLoadingTerms(true);
        const promises = [];

        promises.push(fetchKanjiData());
        promises.push(fetchWordData());
        promises.push(fetchGrammarData());

        const [kanjiResult, wordResult, grammarResult] = await Promise.all(promises);

        const loadedKanjiTerms = kanjiResult ? Object.values(kanjiResult).map((element) => element.kanji) : [];
        const loadedWordTerms = wordResult ? Object.values(wordResult).map((element) => element.word) : [];
        const loadedGrammarTerms = grammarResult ? Object.values(grammarResult).map((element) => element.structure) : [];

        setKanjiTerms(loadedKanjiTerms);
        setWordTerms(loadedWordTerms);
        setGrammarTerms(loadedGrammarTerms);

        setIsLoadingTerms(false);
        if (loadedKanjiTerms.length > 0 || loadedWordTerms.length > 0 || loadedGrammarTerms.length > 0) {
            setIsModalVisible(true);
        }
    };

    if (!isPremium) return null;

    return (
        <>
            <TertiaryButton onClick={handleOpenModal} iconComponent={<FaRobot />} />
            {isModalVisible && (
                <NewGenerationPage
                    onClose={() => setIsModalVisible(false)}
                    termsDictionary={{
                        ...(kanjiTerms.length > 0 && { [CollectionTypes.Kanji]: kanjiTerms }),
                        ...(wordTerms.length > 0 && { [CollectionTypes.Word]: wordTerms }),
                        ...(grammarTerms.length > 0 && { [CollectionTypes.Grammar]: grammarTerms })
                    }}
                    deckName={deckName ?? "読書"}
                    lessonName={lessonName}
                    courseName={courseName}
                    courseId={courseId}
                />
            )}
            {isLoadingTerms && (
                <LoadingScreen isLoading={isLoadingTerms} />
            )}
        </>
    );
};

export default GenerationButton;