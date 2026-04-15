import React, { useState, useEffect, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Loader2, Eye, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { validationSchema, formStepsConfig } from '@/components/profile/formConfig.jsx';
import { supabase } from '@/lib/customSupabaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMigratoryProfile } from '@/hooks/useMigratoryProfile.js';

const MigratoryProfileForm = () => {
  const { t } = useTranslation(['migratory_profile', 'common', 'advanced_onboarding']);
  const { toast } = useToast();
  const { user } = useAuth();
  const { saveProfile, loading: isSubmitting, isSuccess } = useMigratoryProfile();
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  const currentSchema = validationSchema(t);

  const methods = useForm({
    resolver: zodResolver(currentSchema),
    mode: 'onChange',
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
            
            const defaultValues = {
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
                Object.keys(defaultValues).forEach(key => {
                    if (data[key] !== null && data[key] !== undefined) {
                        defaultValues[key] = data[key];
                    }
                });
            }
            return defaultValues;
        }
        return {};
    },
  });

  const { register, control, handleSubmit, trigger, formState: { errors }, watch } = methods;

  const fetchProfile = useCallback(async () => {
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not fetch your profile data.',
        });
      } else if (data) {
        setProfileData(data);
        Object.keys(data).forEach(key => {
          if (key in methods.getValues()) {
            methods.setValue(key, data[key], { shouldValidate: true });
          }
        });
      }
    }
  }, [user, toast, methods]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: t('common:success_title'),
        description: t('migratory_profile:toast.success_desc'),
      });
      navigate('/dashboard', { replace: true });
    }
  }, [isSuccess, navigate, t, toast]);

  const nextStep = async () => {
    const fieldsToValidate = formStepsConfig[currentStep].fields;
    const isValidStep = await trigger(fieldsToValidate);
    if (isValidStep) {
      setCurrentStep(prev => Math.min(prev + 1, formStepsConfig.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data) => {
    await saveProfile(data);
  };

  const CurrentStepComponent = formStepsConfig[currentStep].component;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="relative p-8 bg-slate-800/50 rounded-2xl border border-slate-700 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              {t(`migratory_profile:${formStepsConfig[currentStep].title}`)}
            </h2>
            <span className="text-sm font-medium text-slate-400">
              {t('common:step')} {currentStep + 1} / {formStepsConfig.length}
            </span>
          </div>

          <div className="w-full bg-slate-700 rounded-full h-2 mb-8">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / formStepsConfig.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentStepComponent
                register={register}
                control={control}
                errors={errors}
                watch={watch}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-center">
          <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('common:previous')}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant="ghost">
                <Eye className="mr-2 h-4 w-4" /> Ver Datos (Debug)
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 text-white border-slate-700 max-w-2xl">
              <DialogHeader>
                <DialogTitle>Datos del Formulario (Payload)</DialogTitle>
              </DialogHeader>
              <pre className="mt-4 bg-slate-800 rounded-md p-4 text-sm overflow-x-auto">
                {JSON.stringify(watch(), null, 2)}
              </pre>
            </DialogContent>
          </Dialog>

          {currentStep < formStepsConfig.length - 1 ? (
            <Button type="button" onClick={nextStep}>
              {t('common:next')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common:submitting')}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t('migratory_profile:evaluate_profile')}
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default MigratoryProfileForm;