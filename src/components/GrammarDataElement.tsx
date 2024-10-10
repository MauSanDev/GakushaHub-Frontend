import React from 'react';
import { GrammarData } from "../data/GrammarData.ts";
import LocSpan from "./LocSpan.tsx";
import i18n from "i18next";
import SelectableContainer from "./ui/containers/SelectableContainer.tsx";
import CollapsibleSection from "./ui/containers/CollapsibleSection.tsx";
import RoundedTag from "./ui/text/RoundedTag.tsx";
import HighlightableTag from "./ui/text/HighlightableTag.tsx";

interface GrammarDataElementProps {
    result: GrammarData;
    isSelected: boolean;
    onSelect: (selected: boolean) => void;
}

const GrammarDataElement: React.FC<GrammarDataElementProps> = ({ result, isSelected, onSelect }) => {
    return (
        <SelectableContainer
            isSelected={isSelected}
            onClick={() => onSelect(!isSelected)}
        >
            <RoundedTag textKey={`JLPT${result.jlpt}`} className={"absolute top-2 right-12"} />

            <h1 className="text-3xl font-bold mb-2 text-blue-400 dark:text-white">
                {result.structure} <span className="text-xl text-gray-600 dark:text-gray-300">(<LocSpan textKey={result.hint} namespace={"grammar_jlpt"+result.jlpt} />)</span>
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mb-4"><LocSpan textKey={result.description} namespace={"grammar_jlpt"+result.jlpt} /></p>

            <CollapsibleSection title="Examples">
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
            </CollapsibleSection>

            <div className="text-gray-400 text-sm mt-4 flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                    <HighlightableTag
                        labelKey="grammarKeys.formalityLabel"
                        valueKey={`grammarKeys.formality.${result.formality}`}
                    />

                    <HighlightableTag
                        labelKey="grammarKeys.usageLabel"
                        valueKey={`grammarKeys.usage_context.${result.usage_context}`}
                    />

                    {result.expression_type.map((context, index) => (
                        <HighlightableTag
                            key={index}
                            labelKey="grammarKeys.expressionLabel"
                            valueKey={`grammarKeys.expression_type.${context}`}
                        />
                    ))}
                </div>
            </div>
        </SelectableContainer>
    );
};

export default GrammarDataElement;