import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const FormStep7 = ({ register, control, errors }) => {
    const { t } = useTranslation('migratory_profile');
    const migrationPurposes = ['work', 'study', 'invest', 'family', 'quality_of_life'].map(val => ({ value: val, label: t(`onboarding_interest.${val}`)}));
    const residencyTypes = ['temporary', 'permanent'].map(val => ({ value: val, label: t(`migratory_profile.residency_type_${val}`)}));
    const travelAvailabilities = ['inmediata', '1-3 meses', '3-6 meses', 'mas_de_6_meses'].map(val => ({ value: val, label: t(`migratory_profile.travel_availability_${val.replace(' ', '_')}`)}));

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>{t('advanced_onboarding.migration_purpose')}</Label>
                <Controller name="main_interest" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder={t('advanced_onboarding.common_select')} /></SelectTrigger>
                        <SelectContent>{migrationPurposes.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                    </Select>
                )} />
                {errors.main_interest && <p className="text-red-400 text-sm mt-1">{errors.main_interest.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="target_country">{t('advanced_onboarding.target_country')}</Label>
                <Input id="target_country" {...register('target_country')} />
                {errors.target_country && <p className="text-red-400 text-sm mt-1">{errors.target_country.message}</p>}
            </div>
            <div className="flex items-center space-x-2">
                <Controller name="willing_to_consider_other_countries" control={control} render={({ field }) => <Checkbox id="willing_to_consider_other_countries" checked={field.value} onCheckedChange={field.onChange} />} />
                <Label htmlFor="willing_to_consider_other_countries">{t('advanced_onboarding.willing_to_consider_other_countries')}</Label>
            </div>
            <div className="space-y-2">
                <Label>{t('migratory_profile.residency_type_interest')}</Label>
                <Controller name="residency_type_interest" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder={t('advanced_onboarding.common_select')} /></SelectTrigger>
                        <SelectContent>{residencyTypes.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                    </Select>
                )} />
                {errors.residency_type_interest && <p className="text-red-400 text-sm mt-1">{errors.residency_type_interest.message}</p>}
            </div>
            <div className="space-y-2">
                <Label>{t('migratory_profile.travel_availability')}</Label>
                <Controller name="disponibilidad_para_viajar" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder={t('advanced_onboarding.common_select')} /></SelectTrigger>
                        <SelectContent>{travelAvailabilities.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                    </Select>
                )} />
                {errors.disponibilidad_para_viajar && <p className="text-red-400 text-sm mt-1">{errors.disponibilidad_para_viajar.message}</p>}
            </div>
        </div>
    );
};

export default FormStep7;