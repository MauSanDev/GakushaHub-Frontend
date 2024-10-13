import { useElements } from '../useElements';
import {UserData} from "../../../data/UserData.ts";

export const useUserInfo = (
    ids: string[]
): ReturnType<typeof useElements<UserData>> => {
    return useElements<UserData>(ids, 'auth/userInfo', ["name"]);
};