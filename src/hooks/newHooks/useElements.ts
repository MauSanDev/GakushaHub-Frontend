import { useMutation, useQueryClient, UseMutationResult } from 'react-query';
import { ApiClient } from '../../services/ApiClient';

// Función para obtener los elementos por IDs con campos opcionales
const fetchElementsByIds = async <T>(ids: string[], key: string, fields?: string[]): Promise<Record<string, Partial<T>>> => {
    const idsParam = ids.join(',');
    const fieldsParam = fields ? `?fields=${fields.join(',')}` : '';
    console.log(`Fetching ${key} for IDs: ${idsParam}, with fields: ${fields || 'full'}`);
    return ApiClient.get<Record<string, Partial<T>>>(`/api/${key}/get/${idsParam}${fieldsParam}`);
};

// Hook para gestionar los elementos cacheados
export const useElements = <T>(
    ids: string[],
    key: string,
    fields?: string[]  // Soporte para obtener propiedades específicas
): UseMutationResult<Record<string, T>, Error, string[]> & { resetQueries: () => void } => {
    const queryClient = useQueryClient();

    const mutationResult = useMutation<Record<string, T>, Error, string[]>(
        async (ids) => {
            const cachedData: Record<string, T> = {};
            const idsToFetch: string[] = [];

            console.log(`Received IDs for fetching ${key}:`, ids);

            ids.forEach(id => {
                const cachedElement = queryClient.getQueryData<Partial<T>>([key, id]);

                if (cachedElement) {
                    // Comprobar si el cache tiene los campos que necesitamos
                    const missingFields = fields && fields.some(field => !(field in cachedElement));
                    if (!missingFields) {
                        console.log(`${key} with ID ${id} found in cache and has all required fields`);
                        cachedData[id] = cachedElement as T;  // Añadimos el objeto completo al cache
                    } else {
                        console.log(`${key} with ID ${id} missing some fields, adding to fetch list`);
                        idsToFetch.push(id);
                    }
                } else {
                    console.log(`${key} with ID ${id} not found in cache, adding to fetch list`);
                    idsToFetch.push(id);  // Si no está en caché, lo añadimos a idsToFetch
                }
            });

            // Si no hace falta fetch, devolvemos el cache completo
            if (idsToFetch.length === 0) {
                console.log(`All ${key} found in cache with required fields, no need to fetch`);
                return cachedData;
            }

            // Si falta algún dato, hacemos el fetch para obtenerlo
            console.log(`Fetching ${key} for IDs:`, idsToFetch);
            const fetchedData = await fetchElementsByIds<T>(idsToFetch, key, fields);

            // Combinamos los datos cacheados con los recién obtenidos
            Object.entries(fetchedData).forEach(([id, fetchedElement]) => {
                const cachedElement = cachedData[id] || {};
                const updatedElement = { ...cachedElement, ...fetchedElement };  // Completamos el objeto
                console.log(`Updating cache for ${key} with ID ${id}`);

                // Actualizamos el cache con el objeto combinado
                queryClient.setQueryData([key, id], updatedElement);
                cachedData[id] = updatedElement as T;
            });

            return cachedData;
        },
        {
            onSuccess: (data) => {
                console.log(`Mutation successful, caching result for ${key} IDs:`, ids);
                queryClient.setQueryData([`${key}ByIds`, ids], data);
            }
        }
    );

    const resetQueries = () => {
        console.log(`Invalidating queries for ${key} IDs:`, ids);
        queryClient.invalidateQueries([`${key}ByIds`, ids]);
    };

    return { ...mutationResult, resetQueries };
};