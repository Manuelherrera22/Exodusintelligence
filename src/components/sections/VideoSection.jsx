import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PlayCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const VideoSection = () => {
    const { t } = useTranslation('common');
    const { toast } = useToast();

    const handlePlay = () => {
        toast({
            title: t('video_toast_title'),
            description: t('video_toast_desc'),
        });
    };

    return (
        <section className="py-10 sm:py-16">
            <div className="max-w-5xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20 group cursor-pointer border border-purple-500/20"
                    onClick={handlePlay}
                >
                    <img  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={t('video_alt_text')} src="https://images.unsplash.com/photo-1612058633399-49246186dbe0" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <PlayCircle className="w-20 h-20 text-white/80 drop-shadow-lg transition-transform duration-300 group-hover:scale-110" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default VideoSection;