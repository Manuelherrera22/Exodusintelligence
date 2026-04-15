import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useSimulator } from '@/contexts/SimulatorContext';
import { ArrowRight, Check, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ToggleButton = ({ value, onClick, selected, text }) => (
    <button
        type="button"
        onClick={onClick}
        className={`px-4 py-2 rounded-md transition-colors text-sm font-medium flex items-center gap-2 ${
        selected ? 'bg-purple-600 text-white' : 'bg-slate-700 hover:bg-slate-600'
        }`}
    >
        {value === 'yes' ? <Check size={16} /> : <X size={16} />}
        {text}
    </button>
);


const Step2_Profile = () => {
    const { t } = useTranslation('exodus');
    const { answers, setAnswer, nextStep } = useSimulator();

    const questions = {
        education: {
            label: t('simulator.step2_q1'),
            options: [
                { value: 'none', label: t('simulator.step2_q1_opt1') },
                { value: 'high_school', label: t('simulator.step2_q1_opt2') },
                { value: 'technical', label: t('simulator.step2_q1_opt3') },
                { value: 'university', label: t('simulator.step2_q1_opt4') },
                { value: 'postgraduate', label: t('simulator.step2_q1_opt5') },
            ],
        },
        work: {
            label: t('simulator.step2_q2'),
            options: [
                { value: 'contract', label: t('simulator.step2_q2_opt1') },
                { value: 'informal', label: t('simulator.step2_q2_opt2') },
                { value: 'no', label: t('simulator.step2_q2_opt3') },
            ],
        },
        languages: {
            label: t('simulator.step2_q4'),
            options: [
                { value: 'yes', label: t('simulator.step2_q_yes') },
                { value: 'no', label: t('simulator.step2_q_no') },
                { value: 'learning', label: t('simulator.step2_q_learning') },
            ],
        },
    };
    
    const binaryQuestions = {
        dependents: { label: t('simulator.step2_q3') },
        passport: { label: t('simulator.step2_q5') },
    }

    const isNextDisabled = !answers.education || !answers.work || !answers.dependents || !answers.languages || !answers.passport;

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
        >
            <h3 className="text-2xl font-semibold mb-6 text-center text-gray-300">{t('simulator.step2_title')}</h3>
            <div className="space-y-6">
                {Object.entries(questions).map(([key, q]) => (
                    <div key={key}>
                        <Label className="text-gray-400 mb-2 block">{q.label}</Label>
                        <Select onValueChange={(value) => setAnswer(key, value)} value={answers[key]}>
                            <SelectTrigger className="w-full bg-slate-800 border-slate-700">
                                <SelectValue placeholder="Selecciona una opción..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                {q.options.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                ))}
                 {Object.entries(binaryQuestions).map(([key, q]) => (
                    <div key={key}>
                        <Label className="text-gray-400 mb-2 block">{q.label}</Label>
                         <div className="flex gap-2">
                             <ToggleButton value="yes" text={t('simulator.step2_q_yes')} onClick={() => setAnswer(key, 'yes')} selected={answers[key] === 'yes'} />
                             <ToggleButton value="no" text={t('simulator.step2_q_no')} onClick={() => setAnswer(key, 'no')} selected={answers[key] === 'no'} />
                         </div>
                    </div>
                ))}
            </div>
            <div className="mt-10 text-center">
                <Button onClick={nextStep} size="lg" disabled={isNextDisabled} className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-10 py-6 text-lg">
                    Siguiente <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>
        </motion.div>
    );
};

export default Step2_Profile;