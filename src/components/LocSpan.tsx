import React from 'react';
import { useTranslation } from 'react-i18next';

interface LocSpanProps {
    textKey: string;
    className?: string;
    style?: React.CSSProperties;
    fixTo?: string;
    namespace?: string;
}

const LocSpan: React.FC<LocSpanProps> = ({ textKey, className = '', style = {}, fixTo, namespace }) => {
    const { t, i18n } = useTranslation();

    const translation = fixTo
        ? i18n.getFixedT(fixTo, namespace)(textKey, textKey)
        : t(textKey, { ns: namespace });

    return (
        <span className={className} style={style}>
            {translation}
        </span>
    );
};

export default LocSpan;