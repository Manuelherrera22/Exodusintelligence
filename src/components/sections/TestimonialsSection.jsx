import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { PlayCircle, Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const TestimonialsSection = () => {
  const { t } = useTranslation('general');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePlayVideo = () => {
    toast({
      title: "📹 Video-Testimonio Próximamente",
      description: "Estamos preparando historias reales que te inspirarán. ¡Vuelve pronto!",
    });
  };

  const handleRegisterClick = () => {
    navigate('/registro');
  };

  return (
    <section className="py-20 sm:py-24 px-4 bg-transparent">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12 items-center">
        
        <motion.div 
          className="lg:col-span-3 relative aspect-video rounded-2xl overflow-hidden group cursor-pointer glass-card p-1"
          onClick={handlePlayVideo}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Mujer sonriendo mientras hace una videollamada, representando un testimonio de éxito" src="https://images.unsplash.com/photo-1554224155-82a42a259b2b?w=1920&auto=format&fit=crop" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center justify-center p-8 text-center">
              <PlayCircle className="w-20 h-20 text-white/80 drop-shadow-lg transition-transform duration-300 group-hover:scale-110 mb-4" />
              <p className="text-xl md:text-2xl font-bold text-white leading-tight">
                {t('testimonial_video_title')}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex text-yellow-400 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 fill-current" />)}
          </div>
          <p className="text-xl lg:text-2xl text-gray-300 italic mb-6">
            "{t('testimonial_written_quote')}"
          </p>
          <p className="font-semibold text-lg text-white mb-8">– {t('testimonial_written_name')}</p>

          <div className="border-t border-slate-700 pt-8">
             <p className="text-lg text-cyan-300 font-semibold mb-4">{t('testimonial_cta_title')}</p>
             <Button onClick={handleRegisterClick} size="lg" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
               {t('testimonial_cta_button')}
             </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;