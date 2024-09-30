import React from 'react';
import { useTranslation } from 'react-i18next';

interface LocSpanProps {
    textKey: string;
    className?: string;
    style?: React.CSSProperties;
    fixTo?: string;
}

const LocSpan: React.FC<LocSpanProps> = ({ textKey, className = '', style = {}, fixTo }) => {
    const { t, i18n } = useTranslation();

    return (
        <span className={className} style={style}>
            {fixTo ? i18n.getFixedT(fixTo)(textKey, textKey) : t(textKey, textKey)}
        </span>
    );
};

export default LocSpan;