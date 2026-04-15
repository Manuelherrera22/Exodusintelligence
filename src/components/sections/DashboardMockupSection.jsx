import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Circle, ArrowRight, UploadCloud, FileText, Calendar, User, GraduationCap, Briefcase, Languages, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const scoreData = [
  { name: 'mockup_score_personal', value: 16, color: '#8B5CF6' },
  { name: 'mockup_score_educational', value: 14, color: '#3B82F6' },
  { name: 'mockup_score_work', value: 12, color: '#10B981' },
  { name: 'mockup_score_languages', value: 18, color: '#F97316' },
  { name: 'mockup_score_economic', value: 12, color: '#EC4899' },
];

const CustomTooltip = ({ active, payload, t }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
        <p className="label">{`${t(payload[0].name)} : ${payload[0].value}/20`}</p>
      </div>
    );
  }
  return null;
};

const DashboardMockupSection = () => {
    const { t } = useTranslation('common');
    const navigate = useNavigate();

    const totalScore = scoreData.reduce((acc, curr) => acc + curr.value, 0);

    const checklistItems = [
        { text: t('mockup_checklist_nationality'), checked: true },
        { text: t('mockup_checklist_education'), checked: true },
        { text: t('mockup_checklist_income'), checked: false },
        { text: t('mockup_checklist_language'), checked: false },
        { text: t('mockup_checklist_funds'), checked: false },
    ];

    const timelineItems = [
        { text: t('mockup_timeline_evaluation'), status: 'completed' },
        { text: t('mockup_timeline_documentation'), status: 'in_progress' },
        { text: t('mockup_timeline_appointment'), status: 'pending' },
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="w-6 h-6 text-green-500" />;
            case 'in_progress': return <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}><Circle className="w-6 h-6 text-yellow-500" /></motion.div>;
            case 'pending': return <XCircle className="w-6 h-6 text-red-500" />;
            default: return null;
        }
    };
    
    const scoreIcons = [
        { Icon: User, color: 'text-purple-400' },
        { Icon: GraduationCap, color: 'text-blue-400' },
        { Icon: Briefcase, color: 'text-green-400' },
        { Icon: Languages, color: 'text-orange-400' },
        { Icon: DollarSign, color: 'text-pink-400' },
    ];

    return (
        <section className="py-20 sm:py-32 px-4 bg-slate-900 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    className="relative bg-slate-800/50 rounded-2xl p-6 md:p-8 border border-slate-700 shadow-2xl shadow-purple-900/20 backdrop-blur-sm"
                >
                    <div className="grid lg:grid-cols-5 gap-8">
                        {/* Score Card */}
                        <div className="lg:col-span-3 bg-slate-900/40 p-6 rounded-xl border border-slate-700 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-300">{t('mockup_score_title')}</h3>
                                <p className="text-sm text-gray-500 mb-4">{t('mockup_score_subtitle')}</p>
                                <div className="relative w-full h-64 sm:h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={scoreData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" fill="#8884d8" paddingAngle={5}>
                                                {scoreData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip t={t} />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-6xl font-bold text-white">{totalScore}</span>
                                        <span className="text-xl text-gray-400">/ 100</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                                    {scoreData.map((item, index) => (
                                        <div key={item.name} className="flex items-center gap-2 text-sm">
                                            <div className={`w-3 h-3 rounded-full`} style={{backgroundColor: item.color}}></div>
                                            <span className="text-gray-400">{t(item.name)}:</span>
                                            <span className="font-bold text-white">{item.value}/20</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Side Panel */}
                        <div className="lg:col-span-2 bg-slate-900/40 p-6 rounded-xl border border-slate-700 flex flex-col">
                            <div className="flex-grow">
                                <h4 className="font-bold text-lg text-cyan-300 mb-4">🚀 {t('mockup_checklist_title')}</h4>
                                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 mb-6 text-center">
                                    <p className="text-cyan-300 font-medium">{t('mockup_checklist_suggestion')}</p>
                                </div>
                                <ul className="space-y-3">
                                    {checklistItems.map((item, index) => (
                                        <li key={index} className="flex items-center gap-3 text-gray-300">
                                            {item.checked ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> : <Circle className="w-5 h-5 text-gray-600 flex-shrink-0" />}
                                            <span>{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Button size="lg" className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                                {t('mockup_checklist_cta')} <FileText className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>

                    {/* Bottom Panel */}
                    <div className="mt-8 bg-slate-900/40 p-6 rounded-xl border border-slate-700">
                        <h4 className="font-bold text-lg text-gray-300 mb-4">{t('mockup_timeline_title')}</h4>
                        <div className="relative flex justify-between items-center">
                            <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-700 -translate-y-1/2"></div>
                            <div className="absolute left-0 top-1/2 w-1/2 h-1 bg-gradient-to-r from-green-500 to-yellow-500 -translate-y-1/2"></div>
                            
                            {timelineItems.map((item, index) => (
                                <div key={index} className="z-10 flex flex-col items-center text-center">
                                    {getStatusIcon(item.status)}
                                    <p className="text-xs mt-2 text-gray-400 w-24">{item.text}</p>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-6">
                            <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300">
                                {t('mockup_timeline_cta')} <Calendar className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-16"
                >
                    <h3 className="text-2xl md:text-3xl font-bold mb-6 max-w-2xl mx-auto bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                        {t('mockup_final_cta_text')}
                    </h3>
                    <Button onClick={() => navigate('/register')} size="lg" className="px-10 py-7 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/20">
                        {t('mockup_final_cta_button')} <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default DashboardMockupSection;