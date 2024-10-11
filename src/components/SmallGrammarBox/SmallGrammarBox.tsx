import React from 'react';
import { GrammarData } from '../../data/GrammarData';
import { FaQuestionCircle } from 'react-icons/fa';
import TooltipButton from "../TooltipButton.tsx";
import LocSpan from "../LocSpan.tsx";
import i18n from "i18next"; 

interface SmallGrammarBoxProps {
    result: GrammarData | null;
}

const SmallGrammarBox: React.FC<SmallGrammarBoxProps> = ({ result }) => {
    if (!result) return null;

    const dropdownItems = [
        <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold text-blue-400 dark:text-white">{result.structure}</h1>
        </div>,
        <LocSpan textKey={result.hint} namespace={"grammar_jlpt" + result.jlpt}
                 className="text-xs text-gray-600 dark:text-gray-300"/>,
        <div key="description">
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-2"><LocSpan textKey={result.description}
                                                                                  namespace={"grammar_jlpt" + result.jlpt}/>
            </p>
        </div>,
        <div key="examples">
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 font-bold">Examples:</p>
            <div className="text-gray-600 dark:text-gray-300">
                {result.examples && result.examples.length > 0 ? (
                    result.examples.map((example, index) => (
                        <div key={index} className="mb-2 text-xs pl-2">
                            <span className="text-gray-600 dark:text-gray-300 mr-2">例:</span>
                            <LocSpan
                                textKey={example.replace('example', 'examples.example')}
                                fixTo={"ja"}
                                namespace={"grammar_jlpt" + result.jlpt}
                                className="text-gray-600 dark:text-gray-300"/>
                            {i18n.language !== 'ja' && (
                                <p className="text-gray-600 dark:text-gray-300 pl-6">
                                    <LocSpan textKey={example.replace('example', 'examples.example')}
                                             namespace={"grammar_jlpt" + result.jlpt}/>
                                </p>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600 dark:text-gray-300">No examples available.</p>
                )}
            </div>
        </div>,
            <div className="flex flex-wrap gap-2 text-xs">
                    
                    <span
                        className="text-gray-500 rounded-1xl px-1 py-0.5 transition-all duration-300 bg-gray-300 dark:bg-gray-800 hover:text-gray-600 dark:text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap">
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
                    className="text-gray-500 rounded-1xl px-1 py-0.5 transition-all duration-300 bg-gray-300 dark:bg-gray-800 hover:text-gray-600 dark:text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap">
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
                    className="text-gray-500 rounded-1xl px-1 py-0.5 transition-all duration-300 bg-gray-300 dark:bg-gray-800 hover:text-gray-600 dark:text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap">
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
    ];

    return (
        <div
            className="bp-2 rounded-md shadow-sm border px-4 py-2 bg-white dark:bg-gray-950 hover:border-blue-300 hover:dark:border-gray-700 border-gray-200 dark:border-gray-800 w-full relative">
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-bold text-blue-400 dark:text-white">{result.structure}</h1>
                <div className="flex items-center space-x-2">
                    <span className="bg-blue-400 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded">
                        JLPT{result.jlpt}
                    </span>
                    <TooltipButton items={dropdownItems} icon={<FaQuestionCircle/>} buttonSize="text-xs"/>
                </div>
            </div>
            <LocSpan textKey={result.hint} namespace={"grammar_jlpt" + result.jlpt}
                     className="text-xs text-gray-600 dark:text-gray-300 pl-2"/>
        </div>
    );
};

export default SmallGrammarBox;