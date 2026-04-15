import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const FormStep9 = ({ control, errors }) => {
    const { t } = useTranslation('migratory_profile');
    const housingPlans = ['rent', 'buy'].map(val => ({ value: val, label: t(`migratory_profile.housing_plan_${val}`)}));
    const zonePreferences = ['urban', 'rural'].map(val => ({ value: val, label: t(`migratory_profile.zone_preference_${val}`)}));

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>{t('migratory_profile.housing_plan')}</Label>
                <Controller name="housing_plan" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder={t('advanced_onboarding.common_select')} /></SelectTrigger>
                        <SelectContent>{housingPlans.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                    </Select>
                )} />
                {errors.housing_plan && <p className="text-red-400 text-sm mt-1">{errors.housing_plan.message}</p>}
            </div>
            <div className="flex items-center space-x-2">
                <Controller name="transport_plan" control={control} render={({ field }) => <Checkbox id="transport_plan" checked={field.value} onCheckedChange={field.onChange} />} />
                <Label htmlFor="transport_plan">{t('migratory_profile.transport_plan')}</Label>
            </div>
            <div className="space-y-2">
                <Label>{t('migratory_profile.zone_preference')}</Label>
                <Controller name="preferred_zone" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder={t('advanced_onboarding.common_select')} /></SelectTrigger>
                        <SelectContent>{zonePreferences.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                    </Select>
                )} />
                {errors.preferred_zone && <p className="text-red-400 text-sm mt-1">{errors.preferred_zone.message}</p>}
            </div>
            <div className="flex items-center space-x-2">
                <Controller name="interested_in_post_migration_services" control={control} render={({ field }) => <Checkbox id="interested_in_post_migration_services" checked={field.value} onCheckedChange={field.onChange} />} />
                <Label htmlFor="interested_in_post_migration_services">{t('migratory_profile.interested_in_post_migration_services')}</Label>
            </div>
        </div>
    );
};

export default FormStep9;