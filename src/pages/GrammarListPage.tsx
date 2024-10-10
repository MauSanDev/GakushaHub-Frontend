import React, { useState, useEffect, useRef } from 'react';
import GrammarDataElement from '../components/GrammarDataElement.tsx';
import { GrammarData } from "../data/GrammarData.ts";
import { usePaginatedGrammar } from "../hooks/usePaginatedGrammar.ts";
import SaveDeckInput from '../components/SaveDeckInput';
import { SaveStatus } from "../utils/SaveStatus.ts";
import { useAuth } from "../context/AuthContext.tsx";
import SectionContainer from "../components/ui/containers/SectionContainer.tsx";
import ShowSelectionToggle from "../components/ui/toggles/ShowSelectionToggle.tsx";
import SelectionToggle from "../components/ui/toggles/SelectionToggle.tsx";
import SearchBar from "../components/ui/inputs/SearchBar.tsx"; 

const GrammarListPage: React.FC = () => {
    const [allResults, setAllResults] = useState<GrammarData[]>([]);
    const [selectedGrammar, setSelectedGrammar] = useState<GrammarData[]>([]);
    const [page, setPage] = useState(1);
    const [selectedJLPTLevels, setSelectedJLPTLevels] = useState<number[]>([5, 4, 3, 2, 1]);
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.Idle);
    const { isAuthenticated } = useAuth();

    const { data, isLoading, error } = usePaginatedGrammar(page, 20);

    const isSaving = saveStatus === SaveStatus.Saving;

    const onSaveStatusChanged = (status: SaveStatus) => {
        setSaveStatus(status);
    };

    useEffect(() => {
        if (data) {
            setAllResults(prev => [...prev, ...data.documents]);
        }
    }, [data]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollContainer = scrollContainerRef.current;
            if (scrollContainer) {
                const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
                if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading && page < (data?.totalPages ?? 1)) {
                    setPage(prevPage => prevPage + 1);
                }
            }
        };

        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, [isLoading, page, data]);

    const toggleJLPTLevel = (level: number) => {
        if (selectedJLPTLevels.includes(level)) {
            setSelectedJLPTLevels(selectedJLPTLevels.filter(l => l !== level));
        } else {
            setSelectedJLPTLevels([...selectedJLPTLevels, level]);
        }
    };

    const toggleSelectedGrammar = (grammar: GrammarData, isSelected: boolean) => {
        setSelectedGrammar(prevSelected => {
            if (isSelected) {
                return [...prevSelected, grammar];
            } else {
                return prevSelected.filter(item => item._id !== grammar._id);
            }
        });
    };

    const contentToShow = () => {
        let toShow = allResults;
        toShow = toShow.filter(x => selectedJLPTLevels.includes(x.jlpt));

        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            toShow = toShow.filter(x =>
                x.structure.toLowerCase().includes(lowercasedTerm) ||
                x.hint?.toLowerCase().includes(lowercasedTerm) ||
                x.description.toLowerCase().includes(lowercasedTerm) ||
                (x.example_contexts && x.example_contexts.some(keyword => keyword.toLowerCase().includes(lowercasedTerm))) // Chequea que example_contexts exista
            );
        }

        return showSelectedOnly ? toShow.filter(x => selectedGrammar.includes(x)) : toShow;
    };

    return (
        <SectionContainer title={"文法"} isLoading={isLoading || isSaving} error={error?.message} >
            <div className="w-full lg:max-w-4xl flex flex-wrap gap-2 text-left px-14 lg:px-0 justify-center">
                <SearchBar onSearch={setSearchTerm} placeholder="Search Grammar..." />

                <div className="flex justify-center gap-0.5 pb-2">
                    {[5, 4, 3, 2, 1].map(level => (
                        <SelectionToggle isSelected={selectedJLPTLevels.includes(level)} onToggle={() => toggleJLPTLevel(level)} textKey={`JLPT${level}`} />
                    ))}
                </div>

                <ShowSelectionToggle
                    isSelected={showSelectedOnly}
                    onToggle={() => setShowSelectedOnly(!showSelectedOnly)}
                />
            </div>

            {isAuthenticated && (selectedGrammar.length > 0 && (
                <div className="fixed top-4 right-4">
                    <SaveDeckInput kanjiList={[]} wordList={[]} grammarList={selectedGrammar} readingList={[]}
                                   onSaveStatusChange={onSaveStatusChanged}/>
                </div>
            ))}

            <div className="mt-4 w-full max-w-4xl flex flex-col gap-4 text-left pb-24">
                {contentToShow().length > 0 ? (
                    contentToShow().map((grammarData, index) => (
                        <div
                            key={index}
                            className="page-fade-enter page-fade-enter-active"
                        >
                            <GrammarDataElement
                                result={grammarData}
                                isSelected={selectedGrammar.includes(grammarData)}
                                onSelect={(selected) => toggleSelectedGrammar(grammarData, selected)}
                            />
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">何もない</p>
                )}
            </div>
        </SectionContainer>
    );
};

export default GrammarListPage;