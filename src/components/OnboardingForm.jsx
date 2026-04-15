import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useTranslation } from 'react-i18next';
import { useSupabaseFunctions } from '@/hooks/useSupabaseFunctions.js';
import { useNavigate } from 'react-router-dom';

const mapOnboardingToPayload = (data, userId) => {
    const sanitize = (value) => value || null;
    return {
        user_id: userId,
        age: Number(data.age) || null,
        country_of_origin: sanitize(data.country_of_origin),
        languages: data.languages ? data.languages.split(',').map(lang => lang.trim()) : null,
        education_level: sanitize(data.education_level),
        profession: sanitize(data.profession),
        work_experience_years: Number(data.work_experience_years) || 0,
        estimated_income: sanitize(data.estimated_income),
        main_interest: sanitize(data.main_interest),
    };
};

const OnboardingForm = ({ onCompleted }) => {
  const { t } = useTranslation('dashboard');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { calculateScore, loadingCalculateScore: scoreLoading } = useSupabaseFunctions();

  const educationLevels = [
    { value: 'primary', label: t('onboarding_education_primary', { ns: 'dashboard' }) },
    { value: 'high_school', label: t('onboarding_education_high_school', { ns: 'dashboard' }) },
    { value: 'technical', label: t('onboarding_education_technical', { ns: 'dashboard' }) },
    { value: 'university', label: t('onboarding_education_university', { ns: 'dashboard' }) },
    { value: 'postgraduate', label: t('onboarding_education_postgraduate', { ns: 'dashboard' }) },
  ];

  const incomeLevels = [
    { value: '0-10k', label: '$0 - $10,000' },
    { value: '10k-30k', label: '$10,001 - $30,000' },
    { value: '30k-60k', label: '$30,001 - $60,000' },
    { value: '60k-100k', label: '$60,001 - $100,000' },
    { value: '100k+', label: '$100,001+' },
  ];

  const interests = [
    { value: 'work', label: t('onboarding_interest_work', { ns: 'dashboard' }) },
    { value: 'study', label: t('onboarding_interest_study', { ns: 'dashboard' }) },
    { value: 'invest', label: t('onboarding_interest_invest', { ns: 'dashboard' }) },
    { value: 'family', label: t('onboarding_interest_family', { ns: 'dashboard' }) },
    { value: 'quality_of_life', label: t('onboarding_interest_quality', { ns: 'dashboard' }) },
  ];

  const onboardingSchema = z.object({
    age: z.number().min(18, t('onboarding_zod_age_min')).max(99, t('onboarding_zod_age_max')),
    country_of_origin: z.string().min(1, t('onboarding_zod_country_required')),
    languages: z.string().min(1, t('onboarding_zod_languages_required')),
    education_level: z.string().min(1, t('onboarding_zod_education_required')),
    profession: z.string().min(1, t('onboarding_zod_profession_required')),
    work_experience_years: z.number().min(0, t('onboarding_zod_experience_min')),
    estimated_income: z.string().min(1, t('onboarding_zod_income_required')),
    main_interest: z.string().min(1, t('onboarding_zod_interest_required')),
  });

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
        work_experience_years: 0,
        age: 18,
    }
  });
  
  const onSubmit = async (data) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se ha encontrado un usuario autenticado.",
      });
      return;
    }
    try {
      // 1. Update profile in Supabase
      const profileUpdateData = {
        ...data,
        languages: data.languages.split(',').map(lang => lang.trim()),
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(profileUpdateData)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      
      // 2. Trigger score calculation
      const payload = mapOnboardingToPayload(data, user.id);
      const { data: scoreResult, error: scoreError } = await calculateScore(payload);
      if (scoreError) throw scoreError;

      // Note: El Edge Function "calculateScore" ahora debería encargarse internamente
      // de realizar el UPDATE en la tabla 'profiles' para evitar inyecciones desde el cliente.
      // Ya no actualizamos el 'migratory_score' visual o manualmente desde aquí.

      toast({
        title: t('onboarding_success_title'),
        description: t('onboarding_success_desc'),
      });
      
      // Pass welcome message state to dashboard
      navigate('/dashboard', { 
        state: { 
          welcomeMessage: t('onboarding_welcome_message', {
            name: user.user_metadata.full_name || 'camarada',
            score: scoreResult.score,
            country: 'Canadá' // This should be dynamic in the future
          }),
          welcomeSubMessage: t('onboarding_welcome_submessage'),
          welcomeCta: t('onboarding_welcome_cta'),
        },
        replace: true 
      });

    } catch (error) {
      console.error('Onboarding error:', error);
      toast({
        variant: 'destructive',
        title: t('onboarding_error_title'),
        description: error.message || t('onboarding_error_desc'),
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('onboarding_page_title')}</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 shadow-2xl shadow-purple-500/10"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{t('onboarding_title')}</h1>
            <p className="text-gray-400">{t('onboarding_subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Age */}
                <div>
                    <Label htmlFor="age">{t('onboarding_age_label')}</Label>
                    <Input id="age" type="number" {...register('age', { valueAsNumber: true })} />
                    {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age.message}</p>}
                </div>
                {/* Country of Origin */}
                <div>
                    <Label htmlFor="country_of_origin">{t('onboarding_country_label')}</Label>
                    <Input id="country_of_origin" type="text" {...register('country_of_origin')} />
                    {errors.country_of_origin && <p className="text-red-400 text-sm mt-1">{errors.country_of_origin.message}</p>}
                </div>
                 {/* Languages */}
                <div className="md:col-span-2">
                    <Label htmlFor="languages">{t('onboarding_languages_label')}</Label>
                    <Input id="languages" type="text" {...register('languages')} />
                    {errors.languages && <p className="text-red-400 text-sm mt-1">{errors.languages.message}</p>}
                </div>
                 {/* Education Level */}
                <div>
                    <Label htmlFor="education_level">{t('onboarding_education_label')}</Label>
                    <Controller
                        name="education_level"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger><SelectValue placeholder={t('onboarding_select_placeholder')} /></SelectTrigger>
                                <SelectContent>
                                    {educationLevels.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.education_level && <p className="text-red-400 text-sm mt-1">{errors.education_level.message}</p>}
                </div>
                {/* Profession */}
                <div>
                    <Label htmlFor="profession">{t('onboarding_profession_label')}</Label>
                    <Input id="profession" type="text" {...register('profession')} />
                    {errors.profession && <p className="text-red-400 text-sm mt-1">{errors.profession.message}</p>}
                </div>
                {/* Work Experience */}
                <div>
                    <Label htmlFor="work_experience_years">{t('onboarding_experience_label')}</Label>
                    <Input id="work_experience_years" type="number" {...register('work_experience_years', { valueAsNumber: true })} />
                    {errors.work_experience_years && <p className="text-red-400 text-sm mt-1">{errors.work_experience_years.message}</p>}
                </div>
                {/* Estimated Income */}
                <div>
                    <Label htmlFor="estimated_income">{t('onboarding_income_label')}</Label>
                     <Controller
                        name="estimated_income"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger><SelectValue placeholder={t('onboarding_select_placeholder')} /></SelectTrigger>
                                <SelectContent>
                                    {incomeLevels.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.estimated_income && <p className="text-red-400 text-sm mt-1">{errors.estimated_income.message}</p>}
                </div>
                 {/* Main Interest */}
                 <div className="md:col-span-2">
                    <Label htmlFor="main_interest">{t('onboarding_interest_label')}</Label>
                     <Controller
                        name="main_interest"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger><SelectValue placeholder={t('onboarding_select_placeholder')} /></SelectTrigger>
                                <SelectContent>
                                    {interests.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.main_interest && <p className="text-red-400 text-sm mt-1">{errors.main_interest.message}</p>}
                </div>
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-base py-6" disabled={isSubmitting || scoreLoading}>
              {isSubmitting || scoreLoading ? t('onboarding_cta_loading') : t('onboarding_cta')}
            </Button>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default OnboardingForm;