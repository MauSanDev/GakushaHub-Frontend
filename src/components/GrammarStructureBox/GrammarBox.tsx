import React, { useState } from 'react';
import { GrammarData } from "../../data/GrammarData.ts";
import { FaCheck, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import LocSpan from "../LocSpan.tsx";
import i18n from "i18next";
import SelectableContainer from "../ui/containers/SelectableContainer.tsx";

interface GrammarBoxProps {
    result: GrammarData | null;
    isSelected: boolean;
    onSelect: (selected: boolean) => void;
}

const GrammarBox: React.FC<GrammarBoxProps> = ({ result, isSelected, onSelect }) => {
    const [isExamplesOpen, setIsExamplesOpen] = useState(false);

    if (!result) return null;

    return (
        <SelectableContainer
            isSelected={isSelected}
            onClick={() => onSelect(!isSelected)}
        >
            <span className="absolute top-2 right-12 bg-blue-400 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
                JLPT{result.jlpt}
            </span>

            <div
                className={`absolute top-2 right-2 w-6 h-6 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 ${
                    isSelected ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-700'
                }`}
            >
                {isSelected && <FaCheck />}
            </div>

            <h1 className="text-3xl font-bold mb-2 text-blue-400 dark:text-white">
                {result.structure} <span className="text-xl text-gray-600 dark:text-gray-300">(<LocSpan textKey={result.hint} namespace={"grammar_jlpt"+result.jlpt} />)</span>
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mb-4"><LocSpan textKey={result.description} namespace={"grammar_jlpt"+result.jlpt} /></p>

            <div
                className="flex items-center cursor-pointer text-black dark:text-white font-semibold"
                onClick={() => setIsExamplesOpen(!isExamplesOpen)}
            >
                <span className="mr-2">{isExamplesOpen ? <FaChevronDown /> : <FaChevronRight />}</span>
                <span>Examples</span>
            </div>

            <div
                className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
                    isExamplesOpen ? 'max-h-[1000px]' : 'max-h-0'
                }`}
            >
                {result.examples.map((example, index) => (
                    <div key={index} className="mt-4">
                        <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">例:</span>
                        <LocSpan
                            textKey={example.replace('example', 'examples.example')}
                            fixTo={"ja"}
                            namespace={"grammar_jlpt" + result.jlpt}
                            className="text-lg text-gray-600 dark:text-gray-300 font-bold"
                        />
                        {i18n.language !== 'ja' && (
                            <p className="text-gray-600 dark:text-gray-300 indent-6">
                                <LocSpan textKey={example.replace('example', 'examples.example')} namespace={"grammar_jlpt" + result.jlpt} />
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <div className="text-gray-400 text-sm mt-4 flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                    
                    <span
                        className="bg-gray-200 dark:bg-gray-950 text-gray-500 rounded-1xl px-1 py-0.5 transition-all duration-300 hover:bg-gray-300 hover:dark:bg-gray-800 hover:text-gray-600 dark:text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap">
                    <LocSpan
                        textKey={"grammarKeys.formalityLabel"}
                        key={"formalityLabel"}
                    />:&nbsp;
                        <LocSpan
                            textKey={"grammarKeys.formality." + result.formality}
                            key={"formality"}
                        />
                    </span>

                    <span
                        className="bg-gray-200 dark:bg-gray-950 text-gray-500 rounded-1xl px-1 py-0.5 transition-all duration-300 hover:bg-gray-300 hover:dark:bg-gray-800 hover:text-gray-600 dark:text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap">
                        <LocSpan
                            textKey={"grammarKeys.usageLabel"}
                            key={"usageLabel"}
                        />:&nbsp;
                        <LocSpan
                            textKey={"grammarKeys.usage_context." + result.usage_context}
                            key={"formality"}
                        />
                    </span>

                    <span
                        className="bg-gray-200 dark:bg-gray-950 text-gray-500 rounded-1xl px-1 py-0.5 transition-all duration-300 hover:bg-gray-300 hover:dark:bg-gray-800 hover:text-gray-600 dark:text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap">
                        <LocSpan
                            textKey={"grammarKeys.expressionLabel"}
                            key={"expressionLabel"}
                        />:&nbsp;
                        {result.expression_type.map((context, index) => (
                            <span key={index}>
                                <LocSpan
                                    textKey={"grammarKeys.expression_type." + context}
                                />
                                {index < result.expression_type.length - 1 && ', '}
                            </span>
                        ))}
                    </span>
                </div>
            </div>
        </SelectableContainer>
    );
};

export default GrammarBox;