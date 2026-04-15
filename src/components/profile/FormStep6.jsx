import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const FormStep6 = ({ register, control, errors, watch }) => {
    const { t } = useTranslation('migratory_profile');
    const familyPlans = ['alone', 'with_partner', 'with_family'].map(val => ({ value: val, label: t(`migratory_profile.family_plan_${val}`)}));
    const watchFamilyPlan = watch("family_migration_plan");

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>{t('migratory_profile.family_plan')}</Label>
                <Controller name="family_migration_plan" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder={t('advanced_onboarding.common_select')} /></SelectTrigger>
                        <SelectContent>{familyPlans.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                    </Select>
                )} />
                {errors.family_migration_plan && <p className="text-red-400 text-sm mt-1">{errors.family_migration_plan.message}</p>}
            </div>
            {watchFamilyPlan === 'with_family' && (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="children_count">{t('migratory_profile.children_count')}</Label>
                        <Input id="children_count" type="number" {...register('children_count')} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="children_ages">{t('migratory_profile.children_ages')}</Label>
                        <Input id="children_ages" {...register('children_ages')} placeholder={t('migratory_profile.children_ages_placeholder')} />
                    </div>
                </>
            )}
            {watchFamilyPlan !== 'alone' && (
                <div className="flex items-center space-x-2">
                    <Controller name="partner_works" control={control} render={({ field }) => <Checkbox id="partner_works" checked={field.value} onCheckedChange={field.onChange} />} />
                    <Label htmlFor="partner_works">{t('migratory_profile.partner_works')}</Label>
                </div>
            )}
        </div>
    );
};

export default FormStep6;