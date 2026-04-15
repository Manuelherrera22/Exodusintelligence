import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

const HowItWorksAccordion = () => {
    const { t } = useTranslation();
    const { toast } = useToast();

    const items = [
        { key: 'q1', q: t('how_it_works_q1'), a: t('how_it_works_a1')},
        { key: 'q2', q: t('how_it_works_q2'), a: t('how_it_works_a2')},
        { key: 'q3', q: t('how_it_works_q3'), a: t('how_it_works_a3')},
        { key: 'q4', q: t('how_it_works_q4'), a: t('how_it_works_a4')},
    ];

    const handleDownload = () => {
        toast({
            title: t('s7_toast_title'),
            description: t('s7_toast_desc'),
        });
    };

    return (
        <section className="py-24 px-4 bg-slate-900">
             <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-300 to-purple-300 bg-clip-text text-transparent">
                        {t('how_it_works_title_tech')}
                    </h2>
                </motion.div>
                <Accordion type="single" collapsible className="w-full">
                    {items.map(item => (
                         <AccordionItem value={item.key} key={item.key}>
                            <AccordionTrigger>{item.q}</AccordionTrigger>
                            <AccordionContent>
                                {item.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                <div className="text-center mt-12">
                     <Button onClick={handleDownload} variant="outline" size="lg">
                        <Download className="mr-2 h-4 w-4" />
                        {t('how_it_works_cta')}
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default HowItWorksAccordion;