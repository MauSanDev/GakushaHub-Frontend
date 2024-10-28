import { useMutation, useQueryClient, QueryClient } from 'react-query';
import { useAuth } from "../../../context/AuthContext.tsx";
import { createElement } from '../../../services/dataService';
import { CollectionTypes } from "../../../data/CollectionTypes.tsx";
import { NewsData } from '../../../data/NewsData.ts';

interface CreateNewsPayload {
    title: string;
    text: string;
    creatorId: string;
    institutionId: string;
    tags: string[];
}

const createNewNews = async ({ title, text, creatorId, tags, institutionId }: CreateNewsPayload, queryClient: QueryClient): Promise<NewsData> => {
    const data: Record<string, unknown> = {
        title,
        text,
        creatorId,
        tags,
        institutionId
    };

    return await createElement(CollectionTypes.News, data, queryClient) as NewsData;
};

export const useCreateNews = () => {
    const { userData } = useAuth();
    const queryClient = useQueryClient();

    return useMutation(
        async ({ title, text, tags, institutionId}: { title: string; text: string; tags: string[], institutionId: string }) => {
            if (!title || title.trim() === '') {
                throw new Error("News title is required");
            }

            if (!userData || !userData._id) {
                throw new Error("User data not available");
            }

            return await createNewNews({
                institutionId,
                title,
                text,
                creatorId: userData._id,
                tags,
            }, queryClient);
        },
        {
            onError: (error) => {
                console.error("Error creating news:", error);
            }
        }
    );
};