import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FormStep3 = ({ register, control, errors }) => {
    const { t } = useTranslation('migratory_profile');
    const techLevels = ['bajo', 'medio', 'alto'].map(val => ({ value: val, label: t(`migratory_profile.tech_level_${val}`)}));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-2">
                <Label htmlFor="occupation">{t('migratory_profile.occupation')}</Label>
                <Input id="occupation" {...register('occupation')} />
                {errors.occupation && <p className="text-red-400 text-sm mt-1">{errors.occupation.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="work_experience_years">{t('advanced_onboarding.work_experience_years')}</Label>
                <Input id="work_experience_years" type="number" {...register('work_experience_years')} />
                {errors.work_experience_years && <p className="text-red-400 text-sm mt-1">{errors.work_experience_years.message}</p>}
            </div>
            <div className="space-y-2">
                <Label>{t('migratory_profile.tech_level')}</Label>
                <Controller name="nivel_tecnologico" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder={t('advanced_onboarding.common_select')} /></SelectTrigger>
                        <SelectContent>{techLevels.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                    </Select>
                )} />
                {errors.nivel_tecnologico && <p className="text-red-400 text-sm mt-1">{errors.nivel_tecnologico.message}</p>}
            </div>
            <div className="space-y-2 pt-8">
                 <div className="flex items-center space-x-2">
                    <Controller name="perfil_emprendedor" control={control} render={({ field }) => <Checkbox id="perfil_emprendedor" checked={field.value} onCheckedChange={field.onChange} />} />
                    <Label htmlFor="perfil_emprendedor">{t('migratory_profile.entrepreneur_profile')}</Label>
                </div>
            </div>
            <div className="md:col-span-2 flex items-center space-x-2">
                <Controller name="has_international_experience" control={control} render={({ field }) => <Checkbox id="has_international_experience" checked={field.value} onCheckedChange={field.onChange} />} />
                <Label htmlFor="has_international_experience">{t('migratory_profile.has_international_experience')}</Label>
            </div>
            <div className="md:col-span-2 flex items-center space-x-2">
                <Controller name="is_remote_worker" control={control} render={({ field }) => <Checkbox id="is_remote_worker" checked={field.value} onCheckedChange={field.onChange} />} />
                <Label htmlFor="is_remote_worker">{t('migratory_profile.is_remote_worker')}</Label>
            </div>
        </div>
    );
};

export default FormStep3;