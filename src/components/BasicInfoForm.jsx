import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Target, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useSupabaseFunctions } from '@/hooks/useSupabaseFunctions';

const BasicInfoForm = () => {
    const { t } = useTranslation('basic_info');
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    
    // Fixed generically via hook parameter and capturing invoke function
    const { invokeFunction, loading } = useSupabaseFunctions('calculateScore');
    const [isSaving, setIsSaving] = useState(false);

    const educationLevels = [
        { value: 'primary', label: "Primaria / Básica" },
        { value: 'high_school', label: "Secundaria / Bachillerato" },
        { value: 'technical', label: "Técnico / Tecnólogo" },
        { value: 'university', label: "Título Universitario / Profesional" },
        { value: 'postgraduate', label: "Maestría / Doctorado" },
    ];

    const basicInfoSchema = z.object({
        country_of_origin: z.string().min(2, t('zod.country_min')),
        age: z.coerce.number().min(18, t('zod.age_invalid')).max(99, t('zod.age_invalid')),
        education_level: z.string().min(1, t('zod.education_required')),
    });
    
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        resolver: zodResolver(basicInfoSchema),
    });

    const onSubmit = async (data) => {
        if (!user) {
            toast({ variant: "destructive", title: "Error", description: "Inicia sesión nuevamente." });
            return;
        }

        setIsSaving(true);
        try {
            // 1. Save strictly required fields to DB immediately. 
            // Give fallback defaults to others so they don't break advanced form schemas.
            const profileUpdateData = {
                country_of_origin: data.country_of_origin,
                age: data.age,
                education_level: data.education_level,
                languages: ['Español'],
                work_experience_years: 0,
                onboarding_completed: true,
                updated_at: new Date().toISOString()
            };

            const { error: dbError } = await supabase
                .from('profiles')
                .update(profileUpdateData)
                .eq('user_id', user.id);

            if (dbError) throw dbError;

            // 2. Invoke the serverless function to quickly assess risk/viability.
            // Even if this fails, we can proceed. The backend handles this asynchronously or safely.
            const payload = {
                user_id: user.id,
                ...data
            };
            
            await invokeFunction(payload);

            toast({ title: t('common:success_title'), description: t('save_success_desc') });
            
            // Bypass the 40-question form (UpdateProfilePage) entirely -> ZERO FRICTION!
            navigate('/dashboard');

        } catch (error) {
            console.error("Migration check error:", error);
            toast({
                variant: 'destructive',
                title: t('error_title'),
                description: error.message || t('error_desc'),
            });
        } finally {
            setIsSaving(false);
        }
    };

    const isBusy = isSaving || loading;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 p-8 max-w-lg mx-auto glass-card border border-purple-500/30 rounded-2xl shadow-[0_0_40px_rgba(139,92,246,0.15)]"
        >
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-3 text-white">{t('form_title')}</h1>
                <p className="text-slate-400">{t('form_subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                <div>
                    <Label htmlFor="country_of_origin" className="text-white">{t('country_label')}</Label>
                    <Input 
                        id="country_of_origin" 
                        type="text" 
                        placeholder={t('country_placeholder')}
                        {...register('country_of_origin')} 
                        className="mt-1 bg-slate-900/50" 
                    />
                    {errors.country_of_origin && <p className="text-red-400 text-sm mt-1">{errors.country_of_origin.message}</p>}
                </div>
                
                <div>
                    <Label htmlFor="age" className="text-white">{t('age_label')}</Label>
                    <Input 
                        id="age" 
                        type="number" 
                        placeholder={t('age_placeholder')}
                        {...register('age')} 
                        className="mt-1 bg-slate-900/50" 
                    />
                    {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age.message}</p>}
                </div>

                <div>
                    <Label htmlFor="education_level" className="text-white">{t('education_label')}</Label>
                    <Controller
                        name="education_level"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="mt-1 bg-slate-900/50 text-white">
                                    <SelectValue placeholder={t('education_placeholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {educationLevels.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.education_level && <p className="text-red-400 text-sm mt-1">{errors.education_level.message}</p>}
                </div>

                <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-500/20 font-bold text-base py-6" disabled={isBusy}>
                    {isBusy ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            {t('status_loading')}
                        </>
                    ) : (
                        <>
                            <Target className="mr-2 h-5 w-5" />
                            {t('cta_submit')}
                        </>
                    )}
                </Button>
            </form>
        </motion.div>
    );
};

export default BasicInfoForm;