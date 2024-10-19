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
import {FaSave} from "react-icons/fa";

interface SaveDeckDropdownModalProps {
    courseId?: string;
    courseName?: string;
    lessonName?: string;
    deckName?: string;
    onClose: () => void;
}

const SaveDeckDropdownModal: React.FC<SaveDeckDropdownModalProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const [deckSearchValue, setDeckSearchValue] = useState<string>('');  
    const [courseSearchValue, setCourseSearchValue] = useState<string>('');  
    const [lessonSearchValue, setLessonSearchValue] = useState<string>('');  
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');  
    const [selectedLessonId, setSelectedLessonId] = useState<string>('');  
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
                        value={deckSearchValue}
                        onChange={setDeckSearchValue}
                        placeholder={t("deck")}
                        options={deckOptions}
                        disabled={false}
                    />
                    
                    <PrimaryButton label={"save"} iconComponent={<FaSave />} onClick={() => {console.log("save")}}/>
                </div>
            </Container>
        </ModalWrapper>
    );
};

export default SaveDeckDropdownModal;