import React from 'react';
import { useTranslation } from 'react-i18next';

interface LocSpanProps {
    textKey: string;
    className?: string;
    style?: React.CSSProperties;
    fixTo?: string;
    namespace?: string;
    replacements?: (string | number)[];
}

const LocSpan: React.FC<LocSpanProps> = ({
                                             textKey,
                                             className = '',
                                             style = {},
                                             fixTo,
                                             namespace,
                                             replacements = [],
                                         }) => {
    const { t, i18n } = useTranslation();

    let translation = fixTo
        ? i18n.getFixedT(fixTo, namespace)(textKey, textKey)
        : t(textKey, { ns: namespace });

    replacements.forEach((replacement, index) => {
        const placeholder = `{${index}}`;
        translation = translation.replace(placeholder, String(replacement));
    });

    return (
        <span className={className} style={style}>
            {translation}
        </span>
    );
};

export default LocSpan;