import React, {useEffect, useState} from 'react';
import DropdownInput from "./DropdownInput/DropdownInput.tsx";
import {useTranslation} from "react-i18next";
import ModalWrapper from "../pages/ModalWrapper.tsx";
import SectionTitle from "./ui/text/SectionTitle.tsx";
import Container from "./ui/containers/Container.tsx";
import {useMyCourses} from "../hooks/newHooks/Courses/useMyCourses";
import {useLessons} from "../hooks/newHooks/Courses/useLessons";
import {useDecks} from "../hooks/newHooks/Courses/useDecks.ts";
import {CollectionTypes} from "../data/CollectionTypes.tsx";
import PrimaryButton from "./ui/buttons/PrimaryButton.tsx";
import {FaCheck, FaClock, FaSave} from "react-icons/fa";
import { SaveStatus } from "../utils/SaveStatus.ts";
import {parseDecks, useBuildCourse} from "../hooks/useBuildCourse.ts";

interface SaveDeckDropdownModalProps {
    kanjiIds?: string[],
    grammarIds?: string[],
    wordIds?: string[],
    readingIds?: string[],
    courseId?: string;
    courseName?: string;
    lessonName?: string;
    deckName?: string;
    onClose: () => void;
    onSaveStatusChange?: (status: SaveStatus, error?: string) => void;
}

const MAX_INPUT_LENGTH = 25;

const SaveDeckDropdownModal: React.FC<SaveDeckDropdownModalProps> = ({ onClose, kanjiIds, wordIds, grammarIds, readingIds, onSaveStatusChange, courseId, courseName, lessonName, deckName }) => {
    const { t } = useTranslation();
    const [courseSearchValue, setCourseSearchValue] = useState<string>('');
    const [lessonSearchValue, setLessonSearchValue] = useState<string>('');
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [selectedLessonId, setSelectedLessonId] = useState<string>('');
    const [searchDeckValue, setSearchDeckValue] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>(SaveStatus.Idle);
    const { data: courseData, fetchCourses } = useMyCourses(1, 99);
    const { data: lessonsData, fetchLessons } = useLessons(selectedCourseId ? courseData?.documents?.find((x) => x._id === selectedCourseId)?.lessons || [] : [], ["name"]);
    const { data: kanjiDeckData, fetchDecks: fetchKanjiDecks } = useDecks(selectedLessonId ? Object.values(lessonsData ?? []).find((x) => x._id === selectedLessonId)?.kanjiDecks || [] : [], CollectionTypes.KanjiDeck, ["name"]);
    const { data: wordDeckData, fetchDecks: fetchWordDecks } = useDecks(selectedLessonId ? Object.values(lessonsData ?? []).find((x) => x._id === selectedLessonId)?.wordDecks || [] : [], CollectionTypes.WordDeck, ["name"]);
    const { data: grammarDeckData, fetchDecks: fetchGrammarDecks } = useDecks(selectedLessonId ? Object.values(lessonsData ?? []).find((x) => x._id === selectedLessonId)?.grammarDecks || [] : [], CollectionTypes.GrammarDeck, ["name"]);
    const { data: readingDeckData, fetchDecks: fetchReadingDecks } = useDecks(selectedLessonId ? Object.values(lessonsData ?? []).find((x) => x._id === selectedLessonId)?.readingDecks || [] : [], CollectionTypes.ReadingDeck, ["name"]);
    const { mutate: buildCourse, isLoading: isSaving, isSuccess: saveSuccess } = useBuildCourse();

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
        onSaveStatusChange?.(saveStatus);
    }, [saveStatus]);

    useEffect(() => {
        fetchKanjiDecks();
        fetchWordDecks();
        fetchGrammarDecks();
        fetchReadingDecks();
    }, [selectedLessonId]);


    useEffect(() => {
        if (courseId)
        {
            setSelectedCourseId(courseId);
        }
        if (courseName)
        {
            setCourseSearchValue(courseName)
        }
        
    }, [courseId]);

    useEffect(() => {
        if (lessonName)
        {
            setLessonSearchValue(lessonName);
        }
    }, [lessonName]);

    useEffect(() => {
        if (deckName)
        {
            setSearchDeckValue(deckName);
        }
    }, [deckName]);

    useEffect(() => {
        if (courseId)
        {
            setSelectedCourseId(courseId)
        }
    }, [courseId]);

    const validateInputLength = (input: string): boolean => {
        return input.length <= MAX_INPUT_LENGTH;
    };

    const handleSave = () => {
        if (!validateInputLength(courseSearchValue) || !validateInputLength(lessonSearchValue) || !validateInputLength(searchDeckValue)) {
            const errorMsg = t("saveDeckInput.charLimitExceeded").replace("{0}", MAX_INPUT_LENGTH.toString());
            setError(errorMsg);
            setSaveStatus(SaveStatus.Error);
            return;
        }

        if (!searchDeckValue) {
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


        buildCourse(
            {
                courseId: selectedCourseId || '',
                courseName: courseSearchValue.trim(),
                lessonName: lessonSearchValue.trim(),
                decks: parseDecks(searchDeckValue.trim(), kanjiIds ?? [], wordIds ?? [], grammarIds ?? [], readingIds ?? []),
            },
            {
                onSuccess: () => {
                    setSaveStatus(SaveStatus.Success);
                },
                onError: () => {
                    setSaveStatus(SaveStatus.Error);
                },
            }
        );
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

        if (!searchDeckValue) return null;

        const availableDecks = deckOptions;
        if (!availableDecks.includes(searchDeckValue)) {
            return t("saveDeckInput.deckWillBeCreated").replace("{0}", searchDeckValue).replace("{1}", lessonSearchValue);
        }

        return t("saveDeckInput.contentWillBeAdded").replace("{0}", searchDeckValue);
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
                        disabled={courseName !== undefined}
                    />

                    <DropdownInput
                        value={lessonSearchValue}
                        onChange={setLessonSearchValue}
                        placeholder={t("lesson")}
                        options={lessonOptions}
                        disabled={lessonName !== undefined}
                    />

                    <DropdownInput
                        value={searchDeckValue}
                        onChange={setSearchDeckValue}
                        placeholder={t("deck")}
                        options={deckOptions}
                        disabled={deckName !== undefined}
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
                        disabled={saveStatus === SaveStatus.Saving || !courseSearchValue || !lessonSearchValue || !searchDeckValue || isSaving || saveSuccess}
                    />
                </div>
            </Container>
        </ModalWrapper>
    );
};

export default SaveDeckDropdownModal;