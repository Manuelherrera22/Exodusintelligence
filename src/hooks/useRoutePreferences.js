import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { countryData } from '@/data/countries';

export const useRoutePreferences = () => {
    const { user } = useAuth();
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [initialPreferences, setInitialPreferences] = useState({ primary: '', alternatives: [] });

    useEffect(() => {
        const formattedCountries = Object.entries(countryData).map(([code, data]) => ({
            value: data.name,
            label: `${data.flag} ${data.name}`
        }));
        setCountries(formattedCountries);
    }, []);

    const fetchPreferences = useCallback(async () => {
        if (user) {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('target_country, alternative_countries')
                    .eq('user_id', user.id)
                    .single();

                if (error) throw error;

                if (data) {
                    setInitialPreferences({
                        primary: data.target_country || '',
                        alternatives: data.alternative_countries || []
                    });
                }
            } catch (error) {
                console.error("Error fetching route preferences:", error);
            } finally {
                setLoading(false);
            }
        }
    }, [user]);

    useEffect(() => {
        fetchPreferences();
    }, [fetchPreferences]);

    const savePreferences = async (primary, alternatives) => {
        if (!user) return { success: false, error: "User not authenticated." };

        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    target_country: primary,
                    alternative_countries: alternatives
                })
                .eq('user_id', user.id);

            if (error) throw error;

            // Also assign the primary route as the main one
            const { error: assignError } = await supabase.rpc('assign-default-route', {
                pais_destino: primary
            });

            if (assignError) {
                console.warn("Could not assign default route, but preferences saved:", assignError);
            }


            await fetchPreferences(); // Refresh data
            return { success: true };
        } catch (error) {
            console.error("Error saving preferences:", error);
            return { success: false, error: error.message };
        } finally {
            setSaving(false);
        }
    };

    return {
        countries,
        loading,
        saving,
        savePreferences,
        initialPreferences
    };
};