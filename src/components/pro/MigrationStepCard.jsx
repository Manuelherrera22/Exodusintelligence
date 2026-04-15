import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, Lock, Lightbulb, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import FileUploadDialog from './FileUploadDialog'; 

const statusConfig = {
    completed: {
        icon: Check,
        iconClass: 'bg-green-500',
        badgeVariant: 'default',
        badgeClass: 'bg-green-500/20 text-green-300 border-green-500/30',
        textKey: 'status.completed'
    },
    active: {
        icon: () => <div className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse"></div>,
        iconClass: 'bg-fuchsia-500',
        badgeVariant: 'default',
        badgeClass: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
        textKey: 'status.active'
    },
    locked: {
        icon: Lock,
        iconClass: 'bg-slate-600',
        badgeVariant: 'outline',
        badgeClass: 'bg-slate-700/50 text-slate-400 border-slate-600',
        textKey: 'status.locked'
    }
};

const MigrationStepCard = ({ step, index, onCompleteStep, isLoading }) => {
    const { t } = useTranslation('my_migration_route');
    const [isOpen, setIsOpen] = useState(false);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    
    useEffect(() => {
        setIsOpen(step.status === 'active');
    }, [step.status]);

    const config = statusConfig[step.status];
    const IconComponent = step.status === 'active' ? config.icon : config.icon;

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, delay: index * 0.1 }
        }
    };
    
    const handleToggle = () => {
        if (step.status !== 'locked') {
            setIsOpen(!isOpen);
        }
    };

    const handleFileUpload = (files) => {
        console.log("Files to upload for step", step.id, files);
        // Here you would call the `upload-step-documents` function
    };

    return (
        <>
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="mb-6 relative"
            >
                <div className="absolute left-[-2rem] top-5 w-8 h-8 rounded-full flex items-center justify-center z-10">
                    <motion.div 
                        layout
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={`w-full h-full rounded-full ${config.iconClass} flex items-center justify-center`}
                    >
                        <IconComponent className="w-4 h-4 text-white" />
                    </motion.div>
                </div>

                <motion.div 
                    layout
                    className={`bg-slate-800/50 rounded-xl border transition-all duration-300 ${isOpen ? 'border-fuchsia-500/50' : 'border-slate-700/50 hover:border-slate-600'}`}
                >
                    <div className={`p-4 ${step.status !== 'locked' ? 'cursor-pointer' : 'cursor-not-allowed'}`} onClick={handleToggle}>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <h3 className={`text-lg font-semibold ${step.status === 'locked' ? 'text-slate-500' : 'text-white'}`}>{step.titulo}</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant={config.badgeVariant} className={config.badgeClass}>{t(config.textKey)}</Badge>
                                {step.status !== 'locked' && (
                                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                )}
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {isOpen && step.status !== 'locked' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                <div className="px-4 pb-4 border-t border-slate-700/50">
                                    <p className="mt-4 text-slate-300 text-sm">{step.descripcion}</p>
                                    
                                    {step.tip_content && (
                                        <div className="mt-4 p-3 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-lg flex items-start gap-3">
                                            <Lightbulb className="w-5 h-5 text-fuchsia-400 flex-shrink-0 mt-1" />
                                            <div>
                                                <h5 className="font-semibold text-fuchsia-300">{t('smart_tip_title')}</h5>
                                                <p className="text-fuchsia-200/80 text-sm">{step.tip_content}</p>
                                            </div>
                                        </div>
                                    )}

                                    {step.adjuntos && step.adjuntos.length > 0 && (
                                        <div className="mt-4">
                                            <h4 className="font-semibold text-slate-200 mb-2">{t('attachments_title')}</h4>
                                            <ul className="space-y-2 list-disc list-inside text-slate-400 text-sm">
                                                {step.adjuntos.map((file, i) => <li key={i}>{file.split('/').pop()}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                    
                                    {step.status === 'active' && (
                                        <div className="mt-6 flex flex-wrap gap-4">
                                            <Button onClick={() => onCompleteStep(step.id)} className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white" disabled={isLoading}>
                                                {isLoading ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Check className="w-4 h-4 mr-2" />
                                                )}
                                                {t('button.mark_complete')}
                                            </Button>
                                            <Button onClick={() => setIsUploadDialogOpen(true)} variant="outline" className="border-fuchsia-500/50 text-fuchsia-300 hover:bg-fuchsia-500/10">{t('button.upload_docs')}</Button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
            <FileUploadDialog 
                isOpen={isUploadDialogOpen}
                setIsOpen={setIsUploadDialogOpen}
                onUpload={handleFileUpload}
                stepTitle={step.titulo}
            />
        </>
    );
};

export default MigrationStepCard;