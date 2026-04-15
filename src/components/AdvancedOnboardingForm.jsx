import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useTranslation } from 'react-i18next';
import { useSupabaseFunctions } from '@/hooks/useSupabaseFunctions';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const mapAdvancedOnboardingToPayload = (data, userId) => {
    const sanitize = (value) => {
        if (typeof value === 'boolean') return value;
        if (value === 0) return 0;
        return value || null;
    };

    return {
        user_id: userId,
        nationality: sanitize(data.nationality),
        current_residence: sanitize(data.current_residence),
        age: Number(data.age) || null,
        gender: sanitize(data.gender),
        education_level: sanitize(data.education_level),
        studied_abroad: data.studied_abroad,
        has_validated_certificates: data.has_validated_certificates,
        languages: data.languages && data.languages.length > 0 ? data.languages : null,
        has_language_certification: data.has_language_certification,
        profession: sanitize(data.profession),
        work_experience_years: Number(data.work_experience_years) || 0,
        profession_is_regulated: data.profession_is_regulated,
        estimated_savings: sanitize(data.estimated_savings),
        income_source: sanitize(data.income_source),
        target_country: sanitize(data.target_country),
        main_interest: sanitize(data.main_interest),
        willing_to_consider_other_countries: data.willing_to_consider_other_countries,
        documents_checklist: data.documents_checklist || null,
    };
};

const getOnboardingSchema = (t) => {
    const requiredMsg = t('advanced_onboarding.validation.required');
    return z.object({
        nationality: z.string().min(1, requiredMsg),
        current_residence: z.string().min(1, requiredMsg),
        age: z.number().min(18, t('advanced_onboarding.validation.number_min', {min: 18})),
        gender: z.string().optional(),
        
        education_level: z.string().min(1, requiredMsg),
        studied_abroad: z.boolean().default(false),
        has_validated_certificates: z.boolean().default(false),
        
        languages: z.array(z.object({
            name: z.string().min(1, t('advanced_onboarding.validation.lang_name_required')),
            level: z.string().min(1, t('advanced_onboarding.validation.lang_level_required')),
        })).min(1),
        has_language_certification: z.boolean().default(false),

        profession: z.string().min(1, requiredMsg),
        work_experience_years: z.number().min(0),
        profession_is_regulated: z.boolean().default(false),

        estimated_savings: z.string().min(1, requiredMsg),
        income_source: z.string().min(1, requiredMsg),

        target_country: z.string().min(1, requiredMsg),
        main_interest: z.string().min(1, requiredMsg),
        willing_to_consider_other_countries: z.boolean().default(false),

        documents_checklist: z.object({
            passport: z.boolean().default(false),
            academic_certs: z.boolean().default(false),
            work_certs: z.boolean().default(false),
            lang_certs: z.boolean().default(false),
            intent_letter: z.boolean().default(false),
            references: z.boolean().default(false),
            bank_history: z.boolean().default(false),
        }).default({}),
    });
};

const steps = [
    { id: 1, title: 'section1_title', fields: ['nationality', 'current_residence', 'age', 'gender'] },
    { id: 2, title: 'section2_title', fields: ['education_level', 'studied_abroad', 'has_validated_certificates'] },
    { id: 3, title: 'section3_title', fields: ['languages', 'has_language_certification'] },
    { id: 4, title: 'section4_title', fields: ['profession', 'work_experience_years', 'profession_is_regulated'] },
    { id: 5, title: 'section5_title', fields: ['estimated_savings', 'income_source'] },
    { id: 6, title: 'section6_title', fields: ['target_country', 'main_interest', 'willing_to_consider_other_countries'] },
    { id: 7, title: 'section7_title', fields: ['documents_checklist'] },
];

const LanguageFields = ({ control, register, errors, t }) => {
    const { fields, append, remove } = useFieldArray({ control, name: 'languages' });

    return (
        <div className="space-y-4">
            {fields.map((item, index) => (
                <div key={item.id} className="flex gap-2 items-end p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex-grow">
                        <Label>{t('advanced_onboarding.languages_spoken')}</Label>
                        <Input {...register(`languages.${index}.name`)} placeholder="e.g., English"/>
                        {errors.languages?.[index]?.name && <p className="text-red-400 text-sm mt-1">{errors.languages[index].name.message}</p>}
                    </div>
                     <div className="w-40">
                        <Label>{t('advanced_onboarding.language_level')}</Label>
                        <Controller
                            name={`languages.${index}.level`}
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger><SelectValue placeholder={t('advanced_onboarding.common_select')} /></SelectTrigger>
                                    <SelectContent>
                                        {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                         {errors.languages?.[index]?.level && <p className="text-red-400 text-sm mt-1">{errors.languages[index].level.message}</p>}
                    </div>
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={fields.length === 1}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            <Button type="button" variant="outline" onClick={() => append({ name: '', level: '' })}>
                <Plus className="h-4 w-4 mr-2" />
                {t('advanced_onboarding.language_add')}
            </Button>
        </div>
    );
}

const AdvancedOnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useTranslation('dashboard');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { calculateScore, loadingCalculateScore: scoreLoading } = useSupabaseFunctions();

  const onboardingSchema = getOnboardingSchema(t);

  const { register, handleSubmit, control, trigger, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
        age: 18,
        work_experience_years: 0,
        languages: [{name: '', level: ''}],
        documents_checklist: {
            passport: false,
            academic_certs: false,
            work_certs: false,
            lang_certs: false,
            intent_letter: false,
            references: false,
            bank_history: false,
        }
    }
  });

  const onSubmit = async (data) => {
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          ...data,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      
      const payload = mapAdvancedOnboardingToPayload(data, user.id);

      const { data: scoreData, error: scoreError } = await calculateScore(payload);
      if (scoreError) throw scoreError;

      await supabase
        .from('profiles')
        .update({ migratory_score: scoreData.score })
        .eq('user_id', user.id);

      toast({
        title: t('advanced_onboarding.success_title'),
        description: t('advanced_onboarding.success_desc'),
      });
      
      navigate('/dashboard', { 
        state: { 
          welcomeMessage: t('onboarding_welcome_message', {
            name: user.user_metadata.full_name || 'camarada',
            score: scoreData.score,
            country: data.target_country || 'your destination'
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
        title: t('advanced_onboarding.error_title'),
        description: error.message || t('advanced_onboarding.error_desc'),
      });
    }
  };

  const handleNext = async () => {
    const fields = steps[currentStep].fields;
    const isValid = await trigger(fields);
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  const renderStep = () => {
    // Re-usable options
    const educationLevels = ['primary', 'high_school', 'technical', 'university', 'postgraduate'].map(val => ({ value: val, label: t(`onboarding_education_${val}`)}));
    const incomeSources = ['employment', 'freelance', 'business', 'investments', 'other'].map(val => ({ value: val, label: t(`advanced_onboarding.income_source_${val}`)}));
    const migrationPurposes = ['work', 'study', 'invest', 'family', 'quality_of_life'].map(val => ({ value: val, label: t(`onboarding_interest_${val}`)}));
    const savingsRanges = ['0-5k', '5k-10k', '10k-25k', '25k-50k', '50k-100k', '100k+'].map(val => ({ value: val, label: `$${val.replace('k','K')}`}));
    const documentChecklistItems = [ 'passport', 'academic_certs', 'work_certs', 'lang_certs', 'intent_letter', 'references', 'bank_history' ];

    switch (currentStep) {
        case 0: return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><Label htmlFor="nationality">{t('advanced_onboarding.nationality')}</Label><Input id="nationality" {...register('nationality')} />{errors.nationality && <p className="text-red-400 text-sm mt-1">{errors.nationality.message}</p>}</div>
                <div className="space-y-2"><Label htmlFor="current_residence">{t('advanced_onboarding.current_residence')}</Label><Input id="current_residence" {...register('current_residence')} />{errors.current_residence && <p className="text-red-400 text-sm mt-1">{errors.current_residence.message}</p>}</div>
                <div className="space-y-2"><Label htmlFor="age">{t('advanced_onboarding.age')}</Label><Input id="age" type="number" {...register('age', { valueAsNumber: true })} />{errors.age && <p className="text-red-400 text-sm mt-1">{errors.age.message}</p>}</div>
                <div className="space-y-2"><Label>{t('advanced_onboarding.gender')}</Label><Controller name="gender" control={control} render={({ field }) => (<Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue placeholder={t('advanced_onboarding.common_select')} /></SelectTrigger><SelectContent>{['male', 'female', 'other', 'prefer_not_to_say'].map(g => <SelectItem key={g} value={g}>{t(`advanced_onboarding.gender_${g}`)}</SelectItem>)}</SelectContent></Select>)} /></div>
            </div>
        );
        case 1: return(
             <div className="space-y-6">
                 <div className="space-y-2"><Label>{t('advanced_onboarding.education_level')}</Label><Controller name="education_level" control={control} render={({ field }) => (<Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue placeholder={t('advanced_onboarding.common_select')} /></SelectTrigger><SelectContent>{educationLevels.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select>)} />{errors.education_level && <p className="text-red-400 text-sm mt-1">{errors.education_level.message}</p>}</div>
                 <div className="flex items-center space-x-2"><Controller name="studied_abroad" control={control} render={({ field }) => <Checkbox id="studied_abroad" checked={field.value} onCheckedChange={field.onChange} />} /><Label htmlFor="studied_abroad">{t('advanced_onboarding.studied_abroad')}</Label></div>
                 <div className="flex items-center space-x-2"><Controller name="has_validated_certificates" control={control} render={({ field }) => <Checkbox id="has_validated_certificates" checked={field.value} onCheckedChange={field.onChange} />} /><Label htmlFor="has_validated_certificates">{t('advanced_onboarding.has_validated_certificates')}</Label></div>
             </div>
        );
        case 2: return(
             <div className="space-y-6">
                <LanguageFields control={control} register={register} errors={errors} t={t} />
                <div className="flex items-center space-x-2"><Controller name="has_language_certification" control={control} render={({ field }) => <Checkbox id="has_language_certification" checked={field.value} onCheckedChange={field.onChange} />} /><Label htmlFor="has_language_certification">{t('advanced_onboarding.language_certification')}</Label></div>
             </div>
        );
        case 3: return (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                 <div className="space-y-2"><Label htmlFor="profession">{t('advanced_onboarding.profession')}</Label><Input id="profession" {...register('profession')} />{errors.profession && <p className="text-red-400 text-sm mt-1">{errors.profession.message}</p>}</div>
                 <div className="space-y-2"><Label htmlFor="work_experience_years">{t('advanced_onboarding.work_experience_years')}</Label><Input id="work_experience_years" type="number" {...register('work_experience_years', { valueAsNumber: true })} />{errors.work_experience_years && <p className="text-red-400 text-sm mt-1">{errors.work_experience_years.message}</p>}</div>
                 <div className="md:col-span-2 flex items-center space-x-2 pt-4"><Controller name="profession_is_regulated" control={control} render={({ field }) => <Checkbox id="profession_is_regulated" checked={field.value} onCheckedChange={field.onChange} />} /><Label htmlFor="profession_is_regulated">{t('advanced_onboarding.profession_is_regulated')}</Label></div>
             </div>
        );
        case 4: return(
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><Label>{t('advanced_onboarding.estimated_savings')}</Label><Controller name="estimated_savings" control={control} render={({ field }) => (<Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue placeholder={t('advanced_onboarding.common_select')} /></SelectTrigger><SelectContent>{savingsRanges.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select>)} />{errors.estimated_savings && <p className="text-red-400 text-sm mt-1">{errors.estimated_savings.message}</p>}</div>
                <div className="space-y-2"><Label>{t('advanced_onboarding.income_source')}</Label><Controller name="income_source" control={control} render={({ field }) => (<Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue placeholder={t('advanced_onboarding.common_select')} /></SelectTrigger><SelectContent>{incomeSources.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select>)} />{errors.income_source && <p className="text-red-400 text-sm mt-1">{errors.income_source.message}</p>}</div>
             </div>
        );
         case 5: return(
             <div className="space-y-6">
                <div className="space-y-2"><Label htmlFor="target_country">{t('advanced_onboarding.target_country')}</Label><Input id="target_country" {...register('target_country')} />{errors.target_country && <p className="text-red-400 text-sm mt-1">{errors.target_country.message}</p>}</div>
                <div className="space-y-2"><Label>{t('advanced_onboarding.migration_purpose')}</Label><Controller name="main_interest" control={control} render={({ field }) => (<Select onValueChange={field.onChange} defaultValue={field.value}><SelectTrigger><SelectValue placeholder={t('advanced_onboarding.common_select')} /></SelectTrigger><SelectContent>{migrationPurposes.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select>)} />{errors.main_interest && <p className="text-red-400 text-sm mt-1">{errors.main_interest.message}</p>}</div>
                <div className="flex items-center space-x-2"><Controller name="willing_to_consider_other_countries" control={control} render={({ field }) => <Checkbox id="willing_to_consider_other_countries" checked={field.value} onCheckedChange={field.onChange} />} /><Label htmlFor="willing_to_consider_other_countries">{t('advanced_onboarding.willing_to_consider_other_countries')}</Label></div>
             </div>
        );
        case 6: return(
            <div className="space-y-4">
                <Label>{t('advanced_onboarding.documents_checklist')}</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-700/50 rounded-lg">
                    {documentChecklistItems.map(item => (
                        <div key={item} className="flex items-center space-x-2">
                           <Controller name={`documents_checklist.${item}`} control={control} render={({ field }) => <Checkbox id={item} checked={field.value} onCheckedChange={field.onChange} />} />
                           <Label htmlFor={item}>{t(`advanced_onboarding.doc_${item}`)}</Label>
                        </div>
                    ))}
                </div>
            </div>
        );
        default: return null;
    }
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-purple-500/10">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">{t('advanced_onboarding.main_title')}</h1>
        <p className="text-gray-400">{t('advanced_onboarding.main_subtitle')}</p>
      </div>
      
      <div className="mb-6 space-y-2">
        <p className="text-center text-sm text-purple-300">{t('advanced_onboarding.step', { current: currentStep + 1, total: steps.length })} - {t(`advanced_onboarding.${steps[currentStep].title}`)}</p>
        <Progress value={((currentStep + 1) / steps.length) * 100} className="w-full [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-cyan-500 h-2" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
         <AnimatePresence mode="wait">
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="min-h-[280px] py-4"
            >
                {renderStep()}
            </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-between">
          <Button type="button" variant="outline" onClick={handleBack} disabled={currentStep === 0} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('advanced_onboarding.back')}
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={handleNext} className="gap-2 bg-purple-600 hover:bg-purple-700">
                {t('advanced_onboarding.next')}
                <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting || scoreLoading} className="bg-green-600 hover:bg-green-700">
              {isSubmitting || scoreLoading ? t('advanced_onboarding.loading') : t('advanced_onboarding.finish')}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdvancedOnboardingForm;