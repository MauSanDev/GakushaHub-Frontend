import { useState, useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { fetchElements } from '../../../services/dataService';
import { UserData } from '../../../data/UserData';

export const useUserInfo = (
    ids: string[]
): {
    data: Record<string, UserData> | undefined,
    isLoading: boolean,
    fetchUserInfo: () => void // Permite el fetch manual 
} => {
    const queryClient = useQueryClient();
    const [data, setData] = useState<Record<string, UserData> | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchUserInfo = useCallback(async () => {
        setIsLoading(true);

        if (!ids || ids.length === 0) {
            setData({});
            return {};
        }
        
        try {
            const result = await fetchElements<UserData>(ids, 'auth/userInfo', queryClient, ['name']);
            setData(result);
        } catch (error) {
            console.error('Error fetching user info:', error);
            setData(undefined);
        } finally {
            setIsLoading(false);
        }
    }, [ids, queryClient]);

    return {
        data,
        isLoading,
        fetchUserInfo,
    };
};