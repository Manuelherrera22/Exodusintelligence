import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const FaqSection = () => {
  const { t } = useTranslation('common');
  const { toast } = useToast();

  const faqs = [
    { qKey: 'faq1_q', aKey: 'faq1_a' },
    { qKey: 'faq2_q', aKey: 'faq2_a' },
    { qKey: 'faq3_q', aKey: 'faq3_a' },
    { qKey: 'faq4_q', aKey: 'faq4_a' },
    { qKey: 'faq5_q', aKey: 'faq5_a' },
  ];

  const handleAIChatClick = () => {
    toast({
      title: t('faq_toast_title'),
      description: t('faq_toast_desc'),
    });
  };

  return (
    <section className="py-20 sm:py-24 px-4 bg-slate-900/50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-300 to-purple-300 bg-clip-text text-transparent">
            {t('faq_title')}
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{t(faq.qKey)}</AccordionTrigger>
              <AccordionContent>{t(faq.aKey)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Button onClick={handleAIChatClick} size="lg" className="bg-cyan-600 hover:bg-cyan-700">
            <MessageCircle className="w-5 h-5 mr-2" />
            {t('faq_ai_chat_button')}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;