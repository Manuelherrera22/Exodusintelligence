import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileDown, ShieldCheck, Eye, Ban } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';

const DataPrivacySection = () => {
  const { t } = useTranslation('general');
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: t('s8_toast_title'),
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const points = [
    { icon: Eye, text: t('s7_point1') },
    { icon: ShieldCheck, text: t('s7_point2') },
    { icon: Ban, text: t('s7_point3') },
  ];

  return (
    <section className="py-24 px-4 bg-slate-900">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-card p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">{t('s7_title')}</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12 text-left">
            {points.map((point, index) => (
              <div key={index} className="flex items-start gap-4">
                <point.icon className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1" />
                <p className="text-gray-300">{point.text}</p>
              </div>
            ))}
          </div>
          <Button onClick={handleDownload} variant="outline" className="border-slate-600 hover:bg-slate-700">
            <FileDown className="w-5 h-5 mr-2" />
            {t('s7_cta')}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default DataPrivacySection;