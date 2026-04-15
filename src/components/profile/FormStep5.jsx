import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

const FormStep5 = ({ control, errors, register, watch }) => {
    const { t } = useTranslation('migratory_profile');
    const savingsRanges = ['0-5k', '5k-10k', '10k-25k', '25k-50k', '50k-100k', '100k+'].map(val => ({ value: val, label: `${val.replace('k','K')} USD`}));
    const hasSupportNetwork = watch('has_support_network');

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>{t('advanced_onboarding.estimated_savings')}</Label>
                <Controller name="estimated_savings" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder={t('advanced_onboarding.common_select')} /></SelectTrigger>
                        <SelectContent>{savingsRanges.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                    </Select>
                )} />
                {errors.estimated_savings && <p className="text-red-400 text-sm mt-1">{errors.estimated_savings.message}</p>}
            </div>
            <div className="flex items-center space-x-2">
                <Controller name="has_work_offer" control={control} render={({ field }) => <Checkbox id="has_work_offer" checked={field.value} onCheckedChange={field.onChange} />} />
                <Label htmlFor="has_work_offer">{t('migratory_profile.has_work_offer')}</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Controller name="has_support_network" control={control} render={({ field }) => <Checkbox id="has_support_network" checked={field.value} onCheckedChange={field.onChange} />} />
                <Label htmlFor="has_support_network">{t('migratory_profile.has_support_network')}</Label>
            </div>
            {hasSupportNetwork && (
                 <div className="space-y-2">
                    <Label htmlFor="pais_familia">{t('migratory_profile.family_country')}</Label>
                    <Input id="pais_familia" {...register('pais_familia')} placeholder={t('migratory_profile.family_country_placeholder')} />
                </div>
            )}
        </div>
    );
};

export default FormStep5;