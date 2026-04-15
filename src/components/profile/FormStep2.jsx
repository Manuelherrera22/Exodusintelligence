import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const FormStep2 = ({ register, control, errors }) => {
    const { t } = useTranslation('migratory_profile');
    const educationLevels = ['primary', 'high_school', 'technical', 'university', 'postgraduate'].map(val => ({ value: val, label: t(`onboarding_education.${val}`)}));

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>{t('advanced_onboarding.education_level')}</Label>
                <Controller name="education_level" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder={t('advanced_onboarding.common_select')} /></SelectTrigger>
                        <SelectContent>{educationLevels.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                    </Select>
                )} />
                {errors.education_level && <p className="text-red-400 text-sm mt-1">{errors.education_level.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="field_of_study">{t('migratory_profile.field_of_study')}</Label>
                <Input id="field_of_study" {...register('field_of_study')} />
                {errors.field_of_study && <p className="text-red-400 text-sm mt-1">{errors.field_of_study.message}</p>}
            </div>
            <div className="flex items-center space-x-2">
                <Controller name="is_title_validated" control={control} render={({ field }) => <Checkbox id="is_title_validated" checked={field.value} onCheckedChange={field.onChange} />} />
                <Label htmlFor="is_title_validated">{t('migratory_profile.is_title_validated')}</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Controller name="is_institution_recognized" control={control} render={({ field }) => <Checkbox id="is_institution_recognized" checked={field.value} onCheckedChange={field.onChange} />} />
                <Label htmlFor="is_institution_recognized">{t('migratory_profile.is_institution_recognized')}</Label>
            </div>
        </div>
    );
};

export default FormStep2;