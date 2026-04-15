import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { validationSchema } from '@/components/profile/formConfig.jsx';

export const useMigratoryProfile = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const { t } = useTranslation(['migratory_profile', 'common']);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm({
        resolver: zodResolver(validationSchema(t)),
        defaultValues: async () => {
            if (user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();
                if (error && error.code !== 'PGRST116') {
                    console.error('Error fetching profile for default values:', error);
                }
                
                const defaultData = {
                    age: 18, nationality: '', marital_status: '', gender: '', salud: '',
                    education_level: '', field_of_study: '', is_title_validated: false, is_institution_recognized: false,
                    occupation: '', work_experience_years: 0, has_international_experience: false, is_remote_worker: false, nivel_tecnologico: '', perfil_emprendedor: false,
                    english_level: '', has_language_certification: false, english_certification_score: '', languages: [],
                    estimated_savings: '', has_work_offer: false, has_support_network: false, pais_familia: '',
                    family_migration_plan: '', children_count: 0, children_ages: '', partner_works: false,
                    main_interest: '', target_country: '', willing_to_consider_other_countries: false, residency_type_interest: '', disponibilidad_para_viajar: '',
                    has_valid_passport: false, has_active_visa: false, has_legal_antecedents: false,
                    housing_plan: '', transport_plan: false, preferred_zone: '', interested_in_post_migration_services: false,
                };

                if (data) {
                    Object.keys(defaultData).forEach(key => {
                        if (data[key] !== null && data[key] !== undefined) {
                            defaultData[key] = data[key];
                        }
                    });
                }
                
                return defaultData;
            }
            return {};
        },
    });

    const saveProfile = async (formData) => {
        setLoading(true);
        setIsSuccess(false);
        try {
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ ...formData, onboarding_completed: true, updated_at: new Date().toISOString() })
                .eq('user_id', user.id);

            if (profileError) throw profileError;
            
            if (formData.target_country) {
                const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
                if (sessionError) throw new Error("Could not get user session for route assignment.");

                const token = sessionData.session?.access_token;
                if (!token) throw new Error("Authentication token not found for route assignment.");

                const response = await fetch(
                    `${supabase.supabaseUrl}/functions/v1/assign-default-route`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            pais_destino: formData.target_country
                        }),
                    }
                );

                if (response.ok) {
                    toast({
                        title: t('common:success_title'),
                        description: t('toast.route_assigned_success'),
                    });
                } else {
                    const errorData = await response.json();
                    console.error('Error assigning default route:', errorData);
                    toast({
                        variant: 'destructive',
                        title: t('common:error_title'),
                        description: t('toast.route_assigned_error'),
                    });
                }
            }
            
            setIsSuccess(true);
        } catch (error) {
            console.error("Error saving profile:", error);
            toast({
                title: t('common:error_title'),
                description: error.message || t('common:error_desc'),
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return { form, loading, saveProfile, isSuccess };
};