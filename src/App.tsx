import { useState } from 'react';
import './App.css';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Sidebar from './components/Sidebar';
import SearchPage from './pages/SearchPage';
import KanjiListPage from './pages/KanjiListPage.tsx';
import UnderDevelopmentPage from './pages/UnderDevelopmentPage';

function App() {
    const [activeSection, setActiveSection] = useState('Search');
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');

    return (
        <div className="flex h-screen w-full">
            <Sidebar setActiveSection={setActiveSection} />

            <div className="flex-1 flex flex-col items-center justify-center relative">
                <SwitchTransition mode="out-in">
                    <CSSTransition
                        key={activeSection}
                        timeout={150}
                        classNames="page-fade"
                    >
                        <div className="flex-1 flex flex-col items-center justify-center h-full w-full">
                            {activeSection === 'Search' && (
                                <SearchPage
                                    tags={tags}
                                    setTags={setTags}
                                    inputValue={inputValue}
                                    setInputValue={setInputValue}
                                />
                            )}
                            {activeSection === 'Kanjis' && <KanjiListPage />}
                            {(activeSection !== 'Search' && activeSection !== 'Kanjis') && (
                                <UnderDevelopmentPage />
                            )}
                        </div>
                    </CSSTransition>
                </SwitchTransition>
            </div>
        </div>
    );
}

export default App;