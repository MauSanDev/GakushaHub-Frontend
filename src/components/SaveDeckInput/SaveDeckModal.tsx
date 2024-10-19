import React, {useEffect, useState} from 'react';
import DropdownInput from "../DropdownInput/DropdownInput.tsx";
import {useTranslation} from "react-i18next";
import ModalWrapper from "../../pages/ModalWrapper.tsx";
import SectionTitle from "../ui/text/SectionTitle.tsx";
import Container from "../ui/containers/Container.tsx";
import {useMyCourses} from "../../hooks/newHooks/Courses/useMyCourses";
import {useLessons} from "../../hooks/newHooks/Courses/useLessons";
import {useDecks} from "../../hooks/newHooks/Courses/useDecks.ts";
import {CollectionTypes} from "../../data/CollectionTypes.tsx";
import PrimaryButton from "../ui/buttons/PrimaryButton.tsx";
import {FaCheck, FaClock, FaSave} from "react-icons/fa";
import { SaveStatus } from "../../utils/SaveStatus.ts";

interface SaveDeckDropdownModalProps {
    courseName?: string;
    lessonName?: string;
    deckName?: string;
    onClose: () => void;
}

const MAX_INPUT_LENGTH = 25;

const SaveDeckDropdownModal: React.FC<SaveDeckDropdownModalProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const [courseSearchValue, setCourseSearchValue] = useState<string>('');
    const [lessonSearchValue, setLessonSearchValue] = useState<string>('');
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [selectedLessonId, setSelectedLessonId] = useState<string>('');
    const [selectedDeck, setSelectedDeck] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.Idle);
    const { data: courseData, fetchCourses } = useMyCourses(1, 10);
    const { data: lessonsData, fetchLessons } = useLessons(selectedCourseId ? courseData?.documents?.find((x) => x._id === selectedCourseId)?.lessons || [] : []);
    const { data: kanjiDeckData, fetchDecks: fetchKanjiDecks } = useDecks(selectedLessonId ? Object.values(lessonsData ?? []).find((x) => x._id === selectedLessonId)?.kanjiDecks || [] : [], CollectionTypes.KanjiDeck);
    const { data: wordDeckData, fetchDecks: fetchWordDecks } = useDecks(selectedLessonId ? Object.values(lessonsData ?? []).find((x) => x._id === selectedLessonId)?.wordDecks || [] : [], CollectionTypes.WordDeck);
    const { data: grammarDeckData, fetchDecks: fetchGrammarDecks } = useDecks(selectedLessonId ? Object.values(lessonsData ?? []).find((x) => x._id === selectedLessonId)?.grammarDecks || [] : [], CollectionTypes.GrammarDeck);
    const { data: readingDeckData, fetchDecks: fetchReadingDecks } = useDecks(selectedLessonId ? Object.values(lessonsData ?? []).find((x) => x._id === selectedLessonId)?.readingDecks || [] : [], CollectionTypes.ReadingDeck);

    useEffect(() => {
        fetchCourses();
    }, [courseSearchValue]);

    useEffect(() => {
        const selectedCourse = courseData?.documents?.find((course) => course.name === courseSearchValue);
        setSelectedCourseId(selectedCourse ? selectedCourse._id : '');
    }, [courseSearchValue, courseData]);

    useEffect(() => {
        const selectedLesson = Object.values(lessonsData || {}).find((lesson) => lesson.name === lessonSearchValue);
        setSelectedLessonId(selectedLesson ? selectedLesson._id : '');
    }, [lessonSearchValue, lessonsData]);

    useEffect(() => {
        fetchLessons();
    }, [selectedCourseId]);

    useEffect(() => {
        fetchKanjiDecks();
        fetchWordDecks();
        fetchGrammarDecks();
        fetchReadingDecks();
    }, [selectedLessonId]);

    const validateInputLength = (input: string): boolean => {
        return input.length <= MAX_INPUT_LENGTH;
    };

    const handleSave = () => {
        if (!validateInputLength(courseSearchValue) || !validateInputLength(lessonSearchValue) || !validateInputLength(selectedDeck)) {
            const errorMsg = t("saveDeckInput.charLimitExceeded").replace("{0}", MAX_INPUT_LENGTH.toString());
            setError(errorMsg);
            setSaveStatus(SaveStatus.Error);
            return;
        }

        if (!selectedDeck) {
            const errorMsg = t("saveDeckInput.deckInputEmpty");
            setError(errorMsg);
            setSaveStatus(SaveStatus.Error);
            return;
        }
        if (courseSearchValue && !lessonSearchValue) {
            const errorMsg = t("saveDeckInput.lessonRequired");
            setError(errorMsg);
            setSaveStatus(SaveStatus.Error);
            return;
        }
        if (!courseSearchValue && lessonSearchValue) {
            const errorMsg = t("saveDeckInput.courseRequired");
            setError(errorMsg);
            setSaveStatus(SaveStatus.Error);
            return;
        }

        setError(null);
        setSaveStatus(SaveStatus.Saving);

        // Aquí puedes poner la lógica para guardar el contenido

        setSaveStatus(SaveStatus.Success); // Cambia a Success cuando finalice correctamente
    };

    const courseOptions = courseData?.documents.map((course) => course.name) || [];

    const lessonOptions = lessonsData
        ? Object.values(lessonsData).map((lesson) => lesson.name)
        : [];

    const deckOptions = [
        ...(kanjiDeckData ? Object.values(kanjiDeckData).map((deck) => deck.name) : []),
        ...(wordDeckData ? Object.values(wordDeckData).map((deck) => deck.name) : []),
        ...(grammarDeckData ? Object.values(grammarDeckData).map((deck) => deck.name) : []),
        ...(readingDeckData ? Object.values(readingDeckData).map((deck) => deck.name) : []),
    ].filter((value, index, self) => self.indexOf(value) === index);

    const getContextMessage = (): string | null => {
        if (!courseSearchValue) return null;

        const selectedCourse = courseData?.documents?.find((c) => c._id === selectedCourseId);
        if (!selectedCourse) {
            return t("saveDeckInput.courseWillBeCreated").replace("{0}", courseSearchValue);
        }

        if (!lessonSearchValue) return null;

        const lessonData = lessonsData?.[selectedLessonId];
        if (!lessonData) {
            return t("saveDeckInput.lessonWillBeCreated").replace("{0}", lessonSearchValue).replace("{1}", courseSearchValue);
        }

        if (!selectedDeck) return null;

        const availableDecks = deckOptions;
        if (!availableDecks.includes(selectedDeck)) {
            return t("saveDeckInput.deckWillBeCreated").replace("{0}", selectedDeck).replace("{1}", lessonSearchValue);
        }

        return t("saveDeckInput.contentWillBeAdded").replace("{0}", selectedDeck);
    };

    return (
        <ModalWrapper onClose={onClose}>
            <Container className={"w-full"}>
                <SectionTitle title={"saveDeckInput.saveInto"} className="text-center pb-4" />

                <div className="flex flex-col gap-4">
                    <DropdownInput
                        value={courseSearchValue}
                        onChange={setCourseSearchValue}
                        placeholder={t("course")}
                        options={courseOptions}
                        disabled={false}
                    />

                    <DropdownInput
                        value={lessonSearchValue}
                        onChange={setLessonSearchValue}
                        placeholder={t("lesson")}
                        options={lessonOptions}
                        disabled={false}
                    />

                    <DropdownInput
                        value={selectedDeck}
                        onChange={setSelectedDeck}
                        placeholder={t("deck")}
                        options={deckOptions}
                        disabled={false}
                    />

                    {error ? (
                        <p className="text-red-500 text-xs text-right">{error}</p>
                    ) : (
                        <p className="text-gray-500 text-xs text-right">{getContextMessage()}</p>
                    )}

                    <PrimaryButton
                        label={"save"}
                        iconComponent={
                            saveStatus === SaveStatus.Success ? <FaCheck /> :
                                saveStatus === SaveStatus.Saving ? <FaClock /> : <FaSave />
                        }
                        onClick={handleSave}
                        disabled={saveStatus === SaveStatus.Saving || !courseSearchValue || !lessonSearchValue || !selectedDeck}
                    />
                </div>
            </Container>
        </ModalWrapper>
    );
};

export default SaveDeckDropdownModal;