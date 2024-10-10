import React, { useState, useEffect, useRef } from 'react';
import GrammarElement from '../components/GrammarElement.tsx';
import { GrammarData } from "../data/GrammarData.ts";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { usePaginatedGrammar } from "../hooks/usePaginatedGrammar.ts";
import SaveDeckInput from '../components/SaveDeckInput';
import {SaveStatus} from "../utils/SaveStatus.ts";
import {useAuth} from "../context/AuthContext.tsx";
import SectionContainer from "../components/ui/containers/SectionContainer.tsx";

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
                x.example_contexts.some(keyword => keyword.toLowerCase().includes(lowercasedTerm))
            );
        }

        return showSelectedOnly ? toShow.filter(x => selectedGrammar.includes(x)) : toShow;
    };

    return (
        <SectionContainer title={"文法"} isLoading={isLoading || isSaving} error={error} >
            <div className=" w-full lg:max-w-4xl flex flex-wrap gap-2 text-left px-14 lg:px-0 justify-center">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search Grammar..."
                    className="flex-1 min-w-[200px] w-full border rounded px-3 py-2 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
                />

                <div className="flex justify-center gap-0.5 pb-2">
                    {[5, 4, 3, 2, 1].map(level => (
                        <button
                            key={level}
                            onClick={() => toggleJLPTLevel(level)}
                            className={`border dark:border-gray-600 rounded-full px-2 py-2 lg:text-sm text-xs transition-all duration-300 transform lg:hover:scale-105 hover:shadow-md flex items-center ${
                                selectedJLPTLevels.includes(level)
                                    ? 'bg-blue-500 dark:bg-gray-700 text-white'
                                    : 'bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-blue-300 dark:hover:bg-gray-900 hover:text-white'
                            }`}
                        >
                            JLPT{level}
                        </button>
                    ))}
                </div>


                <button
                    onClick={() => setShowSelectedOnly(!showSelectedOnly)}
                    className={`whitespace-nowrap text-xs border dark:border-gray-700 rounded-full px-3 py-1 transition-all duration-300 transform lg:hover:scale-105 hover:shadow-md flex items-center gap-2 ${
                        showSelectedOnly
                            ? 'bg-blue-500 dark:bg-green-900 text-white'
                            : 'bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-blue-300 hover:text-white'
                    }`}
                >
                    {showSelectedOnly ? <FaEyeSlash/> : <FaEye/>}
                    {showSelectedOnly ? 'Show All' : 'Show Selected'}
                </button>
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
                            <GrammarElement
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