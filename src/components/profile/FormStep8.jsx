import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const FormStep8 = ({ control }) => {
    const { t } = useTranslation('migratory_profile');
    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2">
                <Controller name="has_valid_passport" control={control} render={({ field }) => <Checkbox id="has_valid_passport" checked={field.value} onCheckedChange={field.onChange} />} />
                <Label htmlFor="has_valid_passport">{t('migratory_profile.has_valid_passport')}</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Controller name="has_active_visa" control={control} render={({ field }) => <Checkbox id="has_active_visa" checked={field.value} onCheckedChange={field.onChange} />} />
                <Label htmlFor="has_active_visa">{t('migratory_profile.has_active_visa')}</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Controller name="has_legal_antecedents" control={control} render={({ field }) => <Checkbox id="has_legal_antecedents" checked={field.value} onCheckedChange={field.onChange} />} />
                <Label htmlFor="has_legal_antecedents">{t('migratory_profile.has_legal_antecedents')}</Label>
            </div>
        </div>
    );
};

export default FormStep8;