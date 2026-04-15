import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PlayCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const VideoStorySection = () => {
  const { toast } = useToast();
  const { t } = useTranslation();

  const handlePlayVideo = () => {
    toast({
      title: t('video_story_toast_title'),
      description: t('video_story_toast_desc'),
    });
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="relative aspect-video max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/20 group cursor-pointer"
          onClick={handlePlayVideo}
        >
          <img  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Primer plano de un migrante contando su historia de éxito con subtítulos activados" src="https://images.unsplash.com/photo-1695938542997-a2c3f39d0dbf" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center justify-center p-8">
            <PlayCircle className="w-20 h-20 text-white/80 drop-shadow-lg transition-transform duration-300 group-hover:scale-110" />
            <p className="text-xl md:text-2xl font-bold text-white mt-4 text-center">
              {t('video_story_quote')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoStorySection;