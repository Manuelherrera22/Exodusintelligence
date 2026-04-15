import React from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

const LanguageFields = ({ control, register, errors }) => {
    const { t } = useTranslation('migratory_profile');
    const { fields, append, remove } = useFieldArray({ control, name: 'languages' });

    return (
        <div className="space-y-4">
            <Label>{t('migratory_profile.other_languages')}</Label>
            {fields.map((item, index) => (
                <div key={item.id} className="flex gap-2 items-end p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex-grow">
                        <Input {...register(`languages.${index}.name`)} placeholder={t('migratory_profile.language_placeholder')}/>
                        {errors.languages?.[index]?.name && <p className="text-red-400 text-sm mt-1">{errors.languages[index].name.message}</p>}
                    </div>
                     <div className="w-40">
                        <Controller
                            name={`languages.${index}.level`}
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger><SelectValue placeholder={t('advanced_onboarding.language_level')} /></SelectTrigger>
                                    <SelectContent>
                                        {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lvl => <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                         {errors.languages?.[index]?.level && <p className="text-red-400 text-sm mt-1">{errors.languages[index].level.message}</p>}
                    </div>
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
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

const FormStep4 = ({ control, register, errors }) => {
    const { t } = useTranslation('migratory_profile');
    const languageLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>{t('migratory_profile.english_level')}</Label>
                <Controller name="english_level" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder={t('advanced_onboarding.common_select')} /></SelectTrigger>
                        <SelectContent>{languageLevels.map(lvl => <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>)}</SelectContent>
                    </Select>
                )} />
                {errors.english_level && <p className="text-red-400 text-sm mt-1">{errors.english_level.message}</p>}
            </div>
            <div className="flex items-center space-x-2">
                <Controller name="has_language_certification" control={control} render={({ field }) => <Checkbox id="has_language_certification" checked={field.value} onCheckedChange={field.onChange} />} />
                <Label htmlFor="has_language_certification">{t('advanced_onboarding.language_certification')}</Label>
            </div>
            <div className="space-y-2">
                <Label htmlFor="english_certification_score">{t('migratory_profile.english_certification_score')}</Label>
                <Input id="english_certification_score" {...register('english_certification_score')} placeholder="e.g., IELTS 7.5" />
            </div>
            <LanguageFields control={control} register={register} errors={errors} />
        </div>
    );
};

export default FormStep4;