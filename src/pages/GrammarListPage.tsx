import React, { useState, useEffect } from 'react';
import GrammarDataElement from '../components/GrammarDataElement.tsx';
import { usePaginatedGrammar } from "../hooks/usePaginatedGrammar.ts";
import { SaveStatus } from "../utils/SaveStatus.ts";
import { useAuth } from "../context/AuthContext.tsx";
import SectionContainer from "../components/ui/containers/SectionContainer.tsx";
import ShowSelectionToggle from "../components/ui/toggles/ShowSelectionToggle.tsx";
import SearchBar from "../components/ui/inputs/SearchBar.tsx";
import PaginatedContainer from '../components/ui/containers/PaginatedContainer.tsx';
import SaveDeckButton from "../components/SaveDeckButton.tsx";
import { useTranslation } from "react-i18next";
import { GrammarData } from "../data/GrammarData.ts";
import { useFakePagination } from "../hooks/newHooks/useFakePagination.ts";

const GrammarListPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [selectedJLPTLevel, setSelectedJLPTLevel] = useState<number>(-1);
    const [searchTerm, setSearchTerm] = useState('');
    const { isAuthenticated } = useAuth();
    const [selectedGrammarIds, setSelectedGrammarIds] = useState<string[]>([]);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.Idle);
    const { t } = useTranslation();
    const [showSelected, setShowSelected] = useState(false);
    const [hasFetchedSelected, setHasFetchedSelected] = useState(false);

    const { data, isLoading, fetchGrammarData } = usePaginatedGrammar();
    const { data: selectedData, mutate, isLoading: isLoadingSelected } = useFakePagination<GrammarData>(selectedGrammarIds, page, 10, "grammar");

    const isSaving = saveStatus === SaveStatus.Saving;

    const onSaveStatusChanged = (status: SaveStatus) => {
        setSaveStatus(status);
    };

    // Fetch `mutate` solo la primera vez que se activa `showSelected`
    const handleToggleShowSelected = () => {
        if (!showSelected && selectedGrammarIds.length > 0 && !hasFetchedSelected) {
            mutate();
            setHasFetchedSelected(true); // Marca como "fetched"
        }
        setShowSelected(!showSelected);
    };

    useEffect(() => {
        // Solo cargamos `fetchGrammarData` al inicio y cuando se desactiva `showSelected`
        if (!showSelected) {
            fetchGrammarData(page, 20, [searchTerm], selectedJLPTLevel);
            setHasFetchedSelected(false); // Reset fetch para el próximo cambio
        }
    }, [showSelected, page, searchTerm, selectedJLPTLevel]);

    const handleJLPTLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedJLPTLevel(Number(event.target.value));
    };

    const handleItemSelect = (id: string, isSelected: boolean) => {
        setSelectedGrammarIds(prev =>
            isSelected ? [...prev, id] : prev.filter(selectedId => selectedId !== id)
        );
    };

    return (
        <SectionContainer title={"文法"} isLoading={isLoading || isSaving || isLoadingSelected}>
            <div className="w-full lg:max-w-4xl flex flex-wrap gap-2 text-left px-14 lg:px-0 justify-center">
                <SearchBar onSearch={setSearchTerm} placeholder="searchPlaceholder" />

                <div className="flex flex-wrap justify-center gap-0.5 pb-2">
                    <div className="relative">
                        <select
                            value={selectedJLPTLevel}
                            onChange={handleJLPTLevelChange}
                            className="pl-2 pr-2 py-1.5 border rounded text-sm dark:bg-gray-900 dark:text-white dark:border-gray-700 w-[180px] lg:w-[220px] truncate flex-grow"
                        >
                            <option value={-1}>{t('allLevels')}</option>
                            {[5, 4, 3, 2, 1].map(level => (
                                <option key={level} value={level}>
                                    JLPT{level}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <ShowSelectionToggle
                    isSelected={showSelected}
                    onToggle={handleToggleShowSelected}
                />
            </div>

            {isAuthenticated && selectedGrammarIds.length > 0 && (
                <div className="fixed top-4 right-4">
                    <SaveDeckButton
                        grammarIds={selectedGrammarIds}
                        onSaveStatusChange={onSaveStatusChanged}
                    />
                </div>
            )}

            <PaginatedContainer
                documents={showSelected ? selectedData?.documents || [] : data?.documents || []}
                currentPage={page}
                totalPages={showSelected ? selectedData?.totalPages || 0 : data?.totalPages || 0}
                onPageChange={setPage}
                RenderComponent={({ document }) => (
                    document ? <GrammarDataElement
                        result={document}
                        isSelected={selectedGrammarIds.includes(document._id)}
                        onSelect={(isSelected) => handleItemSelect(document._id, isSelected)}
                    /> : null
                )}
            />
        </SectionContainer>
    );
};

export default GrammarListPage;