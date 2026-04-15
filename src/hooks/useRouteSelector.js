import { useState, useCallback } from 'react';
import { useSupabaseFunctions } from './useSupabaseFunctions';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export const useRouteSelector = () => {
    const { user } = useAuth();
    const { 
        invokeFunction: assignRoute, 
        loading 
    } = useSupabaseFunctions('assign-default-route');

    const selectRoute = useCallback(async (countryName) => {
        if (!user) {
            return { success: false, error: 'Usuario no autenticado.' };
        }

        const { data, error } = await assignRoute({
            pais_destino: countryName
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data };
    }, [user, assignRoute]);

    return { selectRoute, loading };
};