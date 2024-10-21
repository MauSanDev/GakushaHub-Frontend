import React from 'react';
import { FaNewspaper, FaClock, FaTags } from 'react-icons/fa';
import Container from "../../../components/ui/containers/Container.tsx";
import DeleteButton from "../../../components/DeleteButton.tsx";
import RoundedTag from "../../../components/ui/text/RoundedTag.tsx";
import { CollectionTypes } from "../../../data/CollectionTypes.tsx";
import CreatorLabel from "../../../components/ui/text/CreatorLabel.tsx";
import { NewsData } from "../../../data/NewsData.ts";

interface NewsDataElementProps {
    newsData: NewsData;
    canDelete?: boolean;
    onClick?: (news: NewsData) => void; 
}

const NewsDataElement: React.FC<NewsDataElementProps> = ({ newsData, canDelete = false, onClick }) => {
    
    const truncateText = (text: string, limit: number) => {
        if (text.length > limit) {
            return text.substring(0, limit) + '...'; 
        }
        return text;
    };

    return (
        <>
            <div onClick={() => onClick?.(newsData)} className="cursor-pointer">
                <Container className="w-full max-w-4xl my-2 relative">
                    {canDelete && (
                        <div className="absolute top-2 right-2">
                            <DeleteButton
                                creatorId={newsData.creatorId}
                                elementId={newsData._id}
                                elementType={CollectionTypes.News}
                                deleteRelations={false} 
                            />
                        </div>
                    )}

                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                            {newsData.title || 'News Title'}
                        </h2>
                        <div
                            className="text-gray-600 dark:text-gray-400 text-sm"
                            dangerouslySetInnerHTML={{
                                __html: truncateText(newsData.text || 'News Content Preview...', 150),
                            }}
                        />
                        
                        {newsData.tags && newsData.tags.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                                <FaTags className="text-gray-500 dark:text-gray-400" />
                                <div className="flex flex-wrap gap-2">
                                    {newsData.tags.map((tag, index) => (
                                        <RoundedTag key={index} textKey={tag} className="text-xs" />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-3 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center">
                                    <CreatorLabel creatorId={newsData.creatorId} />
                                </span>
                                <span className="flex items-center">
                                    <FaClock className="mr-1" />
                                    <span>{new Date(newsData.createdAt).toLocaleDateString()}</span>
                                </span>
                            </div>
                            <FaNewspaper className="text-gray-500 dark:text-gray-400" />
                        </div>
                    </div>
                </Container>
            </div>
        </>
    );
};

export default NewsDataElement;