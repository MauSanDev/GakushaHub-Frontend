import React from 'react';
import { FaNewspaper, FaUser, FaClock, FaTags } from 'react-icons/fa';
import { Link } from "react-router-dom";
import Container from "../../../components/ui/containers/Container.tsx";
import DeleteButton from "../../../components/DeleteButton.tsx";
import RoundedTag from "../../../components/ui/text/RoundedTag.tsx";
import { CollectionTypes } from "../../../data/CollectionTypes.tsx";

interface NewsData {
    _id: string;
    title: string;
    text: string;
    tags: string[];
    creatorId: string;
    createdAt: string;
}

interface NewsDataElementProps {
    newsData: NewsData;
    canDelete?: boolean;
}

const NewsDataElement: React.FC<NewsDataElementProps> = ({ newsData, canDelete = false }) => {
    return (
        <Link to={`/news/${newsData._id}`}>
            <Container className="w-full max-w-4xl my-2 relative">

                {canDelete &&
                    <div className="absolute top-2 right-2">
                        <DeleteButton
                            creatorId={newsData.creatorId}
                            elementId={newsData._id}
                            elementType={CollectionTypes.News}
                            deleteRelations={false} // Asumiendo que las noticias no tienen relaciones que eliminar
                        />
                    </div>
                }

                <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                        {newsData.title || 'News Title'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {newsData.text || 'News Content Preview...'}
                    </p>

                    {/* Tags */}
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

                    {/* Info */}
                    <div className="flex items-center justify-between mt-3 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center">
                                <FaUser className="mr-1" />
                                <span>{newsData.creatorId || 'Unknown Creator'}</span>
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
        </Link>
    );
};

export default NewsDataElement;