import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

// This is a generic function invoker hook
const useSupabaseFunctions = (functionName) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const { toast } = useToast();
    const { t } = useTranslation('common');

    const invokeFunction = useCallback(async (payload = {}, options = { method: 'POST' }) => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) throw new Error("Could not get user session.");
            
            const token = sessionData.session?.access_token;
            if (!token) throw new Error("Authentication token not found.");

            const functionUrl = `${supabase.supabaseUrl}/functions/v1/${functionName}`;
            
            const fetchOptions = {
                method: options.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            };

            if (options.method === 'POST') {
                fetchOptions.body = JSON.stringify(payload);
            }

            const response = await fetch(functionUrl, fetchOptions);

            const responseData = await response.json();

            if (!response.ok || (responseData.success === false && responseData.error)) {
                 throw new Error(responseData.error || `Request failed with status ${response.status}`);
            }
            
            setData(responseData);
            return { data: responseData, error: null };
            
        } catch (err) {
            console.error(`Error invoking function ${functionName}:`, err);
            setError(err);
            
            // We remove the generic toast from here.
            // The calling hook/component is responsible for showing specific toasts.
            
            return { data: null, error: err };
        } finally {
            setLoading(false);
        }
    }, [functionName, t, supabase.supabaseUrl]);

    return { invokeFunction, loading, error, data };
};


export { useSupabaseFunctions };