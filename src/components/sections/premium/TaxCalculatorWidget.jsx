import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Calculator } from 'lucide-react';

const TaxCalculatorWidget = () => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [income, setIncome] = useState(100000);
    const [country, setCountry] = useState('usa');
    const [savings, setSavings] = useState(null);

    const taxRates = {
        usa: 0.24,
        canada: 0.205,
        uk: 0.40,
        australia: 0.325,
        panama: 0,
        portugal: 0,
        uruguay: 0,
    };
    
    const calculateSavings = (e) => {
        e.preventDefault();
        const currentTax = income * taxRates[country];
        const newTax = income * taxRates.panama; // Assuming Panama as the target
        const calculatedSavings = currentTax - newTax;
        setSavings(calculatedSavings.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
    };

    const handleAnalysisRequest = () => {
        toast({
            title: t('tax_calc_cta2'),
            description: t('footer_toast_wip_desc'),
        });
    };

    return (
        <section className="py-24 px-4">
            <div className="max-w-2xl mx-auto bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/20 rounded-2xl p-8 shadow-xl shadow-amber-900/10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">{t('tax_calc_title')}</h2>
                    <p className="text-center text-gray-400 mb-8">{t('tax_calc_subtitle')}</p>
                    <form onSubmit={calculateSavings} className="space-y-6">
                        <div>
                            <Label htmlFor="income" className="text-gray-300">{t('tax_calc_income_label')}</Label>
                            <Input 
                                id="income" 
                                type="number" 
                                value={income}
                                onChange={(e) => setIncome(parseInt(e.target.value, 10))}
                                placeholder="e.g., 100000" 
                                className="mt-2"
                            />
                        </div>
                        <div>
                             <Label htmlFor="country-select" className="text-gray-300">{t('tax_calc_country_label')}</Label>
                             <Select onValueChange={setCountry} defaultValue={country}>
                                <SelectTrigger id="country-select" className="mt-2">
                                    <SelectValue placeholder={t('tax_calc_country_placeholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="usa">{t('tax_calc_c_usa')}</SelectItem>
                                    <SelectItem value="canada">{t('tax_calc_c_canada')}</SelectItem>
                                    <SelectItem value="uk">{t('tax_calc_c_uk')}</SelectItem>
                                    <SelectItem value="australia">{t('tax_calc_c_australia')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold">
                            <Calculator className="w-5 h-5 mr-2" />
                            {t('tax_calc_cta1')}
                        </Button>
                    </form>
                    
                    {savings !== null && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-8 text-center bg-green-900/20 border border-green-500/30 p-4 rounded-lg"
                        >
                            <p className="text-gray-300">{t('tax_calc_result_title')}</p>
                            <p className="text-3xl font-bold text-green-400 my-2">{savings}/year</p>
                            <p className="text-xs text-gray-400 mb-4">{t('tax_calc_result_disclaimer')}</p>
                            <Button onClick={handleAnalysisRequest} variant="link" className="text-amber-300">{t('tax_calc_cta2')}</Button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default TaxCalculatorWidget;