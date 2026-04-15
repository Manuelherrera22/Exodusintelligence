import { useState, useEffect, useCallback } from 'react';
import { useSupabaseFunctions } from './useSupabaseFunctions';

export const useSupabaseDashboard = (initialProfile) => {
    const { 
        invokeFunction: getScoreHistory, 
        data: scoreHistoryData, 
        loading: loadingScoreHistory,
        error: errorScoreHistory 
    } = useSupabaseFunctions('get-migration-score-history');

    const [profile, setProfile] = useState(initialProfile);
    const [analysis, setAnalysis] = useState(null);
    
    const fetchData = useCallback(async () => {
        // For now, it only fetches score history.
        // Can be expanded to fetch more dashboard data.
        await getScoreHistory({}, { method: 'GET' });
    }, [getScoreHistory]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    // This is just an example of how analysis might be set.
    // In a real scenario, this would come from another function call.
    useEffect(() => {
        if (profile) {
            setAnalysis({
                score_details: {
                    documentos: 20,
                    idioma: 15,
                    formacion: 25,
                    laboral: 10,
                    finanzas: 10,
                },
                pais_sugerido: 'Canadá',
                paises_alternativos: ['Australia', 'Nueva Zelanda'],
                recomendacion_clave: 'Fortalecer el nivel de idioma con una certificación oficial.'
            });
        }
    }, [profile]);

    return { 
        profile, 
        analysis,
        scoreHistory: scoreHistoryData?.history || [], 
        loading: loadingScoreHistory, // Consolidate loading states here in the future
        error: errorScoreHistory, // Consolidate errors here in the future
        refetch: fetchData
    };
};