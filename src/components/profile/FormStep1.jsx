import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FormStep1 = ({ register, control, errors }) => {
    const { t } = useTranslation('migratory_profile');
    const maritalStatuses = ['single', 'married', 'divorced', 'widowed'].map(val => ({ value: val, label: t(`migratory_profile.marital_status_${val}`)}));
    const genders = ['male', 'female', 'other', 'prefer_not_to_say'].map(g => ({ value: g, label: t(`advanced_onboarding.gender_${g}`)}));
    const healthStatuses = ['buena', 'regular', 'con_condiciones'].map(val => ({ value: val, label: t(`migratory_profile.health_status_${val}`)}));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="age">{t('advanced_onboarding.age')}</Label>
                <Input id="age" type="number" {...register('age')} />
                {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="nationality">{t('advanced_onboarding.nationality')}</Label>
                <Input id="nationality" {...register('nationality')} />
                {errors.nationality && <p className="text-red-400 text-sm mt-1">{errors.nationality.message}</p>}
            </div>
            <div className="space-y-2">
                <Label>{t('migratory_profile.marital_status')}</Label>
                <Controller name="marital_status" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder={t('advanced_onboarding.common_select')} /></SelectTrigger>
                        <SelectContent>{maritalStatuses.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                    </Select>
                )} />
                {errors.marital_status && <p className="text-red-400 text-sm mt-1">{errors.marital_status.message}</p>}
            </div>
            <div className="space-y-2">
                <Label>{t('advanced_onboarding.gender')}</Label>
                <Controller name="gender" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder={t('advanced_onboarding.common_select')} /></SelectTrigger>
                        <SelectContent>{genders.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                    </Select>
                )} />
            </div>
            <div className="space-y-2 md:col-span-2">
                <Label>{t('migratory_profile.health_status')}</Label>
                <Controller name="salud" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder={t('advanced_onboarding.common_select')} /></SelectTrigger>
                        <SelectContent>{healthStatuses.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                    </Select>
                )} />
                {errors.salud && <p className="text-red-400 text-sm mt-1">{errors.salud.message}</p>}
            </div>
        </div>
    );
};

export default FormStep1;