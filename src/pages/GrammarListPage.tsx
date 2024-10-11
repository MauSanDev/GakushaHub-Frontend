import React, { useState, useEffect } from 'react';
import GrammarDataElement from '../components/GrammarDataElement.tsx';
import { usePaginatedGrammar } from "../hooks/usePaginatedGrammar.ts";
import SaveDeckInput from '../components/SaveDeckInput';
import { SaveStatus } from "../utils/SaveStatus.ts";
import { useAuth } from "../context/AuthContext.tsx";
import SectionContainer from "../components/ui/containers/SectionContainer.tsx";
import ShowSelectionToggle from "../components/ui/toggles/ShowSelectionToggle.tsx";
import SelectionToggle from "../components/ui/toggles/SelectionToggle.tsx";
import SearchBar from "../components/ui/inputs/SearchBar.tsx";
import PaginatedContainer from '../components/ui/containers/PaginatedContainer.tsx';

const GrammarListPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [selectedJLPTLevels, setSelectedJLPTLevels] = useState<number[]>([5, 4, 3, 2, 1]);
    const [searchTerm, setSearchTerm] = useState('');
    const { isAuthenticated } = useAuth();
    const [selectedGrammarIds, setSelectedGrammarIds] = useState<string[]>([]);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.Idle);

    const { data, isLoading, error, fetchGrammarData } = usePaginatedGrammar(page, 20, searchTerm, selectedJLPTLevels);

    const isSaving = saveStatus === SaveStatus.Saving;

    const onSaveStatusChanged = (status: SaveStatus) => {
        setSaveStatus(status);
    };

    useEffect(() => {
        fetchGrammarData();
    }, [page, searchTerm, selectedJLPTLevels]);

    const toggleJLPTLevel = (level: number) => {
        if (selectedJLPTLevels.includes(level)) {
            setSelectedJLPTLevels(selectedJLPTLevels.filter(l => l !== level));
        } else {
            setSelectedJLPTLevels([...selectedJLPTLevels, level]);
        }
    };

    const handleItemSelect = (id: string, isSelected: boolean) => {
        console.log(id)
        setSelectedGrammarIds(prev =>
            isSelected ? [...prev, id] : prev.filter(selectedId => selectedId !== id)
        );
    };

    return (
        <SectionContainer title={"文法"} isLoading={isLoading || isSaving} error={error?.message}>
            <div className="w-full lg:max-w-4xl flex flex-wrap gap-2 text-left px-14 lg:px-0 justify-center">
                <SearchBar onSearch={setSearchTerm} placeholder="Search Grammar..." />

                <div className="flex flex-wrap justify-center gap-0.5 pb-2">
                    {[5, 4, 3, 2, 1].map(level => (
                        <SelectionToggle
                            key={level}
                            isSelected={selectedJLPTLevels.includes(level)}
                            onToggle={() => toggleJLPTLevel(level)}
                            textKey={`JLPT${level}`}
                        />
                    ))}
                </div>

                <ShowSelectionToggle
                    isSelected={false}
                    onToggle={() => {/* lógica de selección */}}
                />
            </div>

            {isAuthenticated && selectedGrammarIds.length > 0 && (
                <div className="fixed top-4 right-4">
                    <SaveDeckInput
                        grammarList={selectedGrammarIds}
                        onSaveStatusChange={onSaveStatusChanged}
                    />
                </div>
            )}

            {!isLoading && data && (
                <PaginatedContainer
                    documents={data.documents}
                    currentPage={page}
                    totalPages={data.totalPages}
                    onPageChange={setPage}
                    RenderComponent={({ document }) => (
                        <GrammarDataElement
                            result={document}
                            isSelected={selectedGrammarIds.includes(document._id)}
                            onSelect={(isSelected) => handleItemSelect(document._id, isSelected)} 
                        />
                    )}
                />
            )}
        </SectionContainer>
    );
};

export default GrammarListPage;