import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck } from 'lucide-react';

const AnimatedNumber = ({ value }) => {
  const spring = useSpring(0, { mass: 0.8, stiffness: 20, damping: 20 });
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString('en-US')
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
};

const TrustAndSocialProofSection = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      quote: t('testimonial1_quote'),
      name: t('testimonial1_name'),
      destination: t('common:testimonial1_destination'),
      imgSrc: "https://images.unsplash.com/photo-1595872018818-97555653a011"
    },
    {
      quote: t('testimonial_investor_quote'),
      name: t('testimonial_investor_name'),
      destination: t('common:testimonial2_destination'),
      imgSrc: "https://images.unsplash.com/photo-1522071820081-009f0129c71c"
    },
    {
      quote: t('testimonial_entrepreneur_quote'),
      name: t('testimonial_entrepreneur_name'),
      destination: t('common:testimonial3_destination'),
      imgSrc: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1"
    }
  ];

  const stats = [
    { value: 5140, label: t('s6_stat1_label') },
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
        >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t('s6_title')}
            </h2>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Carousel className="w-full max-w-md mx-auto lg:mx-0">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-4 mb-4">
                                <img className="w-16 h-16 rounded-full object-cover flex-shrink-0" alt={`Foto de ${testimonial.name}`} src={testimonial.imgSrc} />
                                <div>
                                <p className="font-bold text-lg">{testimonial.name}</p>
                                <p className="text-sm text-gray-400">
                                    {t('common:testimonial1_origin')} → {testimonial.destination}
                                </p>
                                </div>
                            </div>
                            <p className="text-lg mb-4 italic text-gray-300">"{testimonial.quote}"</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-[-50px] hidden sm:flex" />
              <CarouselNext className="right-[-50px] hidden sm:flex" />
            </Carousel>
          
          <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center bg-slate-800/50 p-6 rounded-xl"
              >
                <div className="text-4xl md:text-5xl font-bold text-cyan-400">
                  +<AnimatedNumber value={stats[0].value} />
                </div>
                <p className="text-gray-400 mt-2">{stats[0].label}</p>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center bg-slate-800/50 p-6 rounded-xl flex items-center justify-center gap-4"
              >
                <ShieldCheck className="w-8 h-8 text-green-400" />
                <p className="font-semibold text-lg">{t('common:allies_seal_text')}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustAndSocialProofSection;