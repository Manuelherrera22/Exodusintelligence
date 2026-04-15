import { useState, useEffect, useCallback } from 'react';
import { useSupabaseFunctions } from './useSupabaseFunctions';

export const useMigrationRoute = () => {
    const { 
        invokeFunction: getSteps, 
        loading: loadingSteps 
    } = useSupabaseFunctions('get-my-migration-steps');
    const { 
        invokeFunction: markStepCompleted, 
        loading: loadingMarkStep 
    } = useSupabaseFunctions('mark-step-as-completed');
    const { 
        invokeFunction: getAlerts, 
        loading: loadingAlerts 
    } = useSupabaseFunctions('get-my-alerts');
    const { 
        invokeFunction: getAlternatives, 
        loading: loadingAlternatives 
    } = useSupabaseFunctions('get-route-alternatives');

    const [steps, setSteps] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [alternatives, setAlternatives] = useState([]);
    const [routeInfo, setRouteInfo] = useState(null);
    const [error, setError] = useState(null);
    const [noRouteAssigned, setNoRouteAssigned] = useState(false);

    const fetchAllData = useCallback(async () => {
        setError(null);
        setNoRouteAssigned(false);
        setSteps([]);
        setAlerts([]);
        setAlternatives([]);
        
        const { data: stepsData, error: stepsError } = await getSteps();

        if (stepsError) {
            if (stepsError.message && (stepsError.message.includes("Ruta migratoria no asignada") || stepsError.message.includes("No migration route assigned"))) {
                setNoRouteAssigned(true);
            } else {
                setError(stepsError.message || 'Unknown error fetching migration steps.');
            }
            return;
        }

        if (!stepsData || !stepsData.steps || stepsData.steps.length === 0) {
            setNoRouteAssigned(true);
            return;
        }

        let activeStepFound = false;
        const processedSteps = (stepsData?.steps || []).map(step => {
            let status = 'locked';
            if (step.completado) {
                status = 'completed';
            } else if (!activeStepFound) {
                status = 'active';
                activeStepFound = true;
            }
            return { ...step, status };
        });
        setSteps(processedSteps);
        if (stepsData?.routeInfo) {
            setRouteInfo(stepsData.routeInfo);
        }

        const { data: alertsData, error: alertsError } = await getAlerts();
        if (alertsError) {
             console.error("Error fetching alerts:", alertsError.message);
        } else {
            setAlerts(alertsData?.alerts || []);
        }

        const { data: alternativesData, error: alternativesError } = await getAlternatives();
        if (alternativesError) {
            console.error("Error fetching alternatives:", alternativesError.message);
        } else {
            setAlternatives(alternativesData?.alternatives || []);
        }

    }, [getSteps, getAlerts, getAlternatives]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const completeStep = useCallback(async (paso_id) => {
        const { data, error } = await markStepCompleted({ paso_id });
        if (!error) {
            await fetchAllData();
            return { success: true, data };
        }
        return { success: false, error };
    }, [markStepCompleted, fetchAllData]);
    
    const loading = loadingSteps || loadingAlerts || loadingAlternatives;

    return { 
        steps, 
        alerts, 
        alternatives,
        routeInfo,
        loading, 
        loadingMarkStep,
        error, 
        noRouteAssigned,
        completeStep,
        refetch: fetchAllData
    };
};