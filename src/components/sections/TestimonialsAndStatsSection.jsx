import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, User, Briefcase, Globe } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

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

const TestimonialsAndStatsSection = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      type: 'standard',
      icon: User,
      quote: t('testimonial1_quote'),
      name: t('testimonial1_name'),
      imgSrc: "https://images.unsplash.com/photo-1595872018818-97555653a011"
    },
    {
      type: 'investor',
      icon: Briefcase,
      quote: t('testimonial_investor_quote'),
      name: t('testimonial_investor_name'),
      imgSrc: "https://images.unsplash.com/photo-1522071820081-009f0129c71c"
    },
    {
      type: 'entrepreneur',
      icon: Globe,
      quote: t('testimonial_entrepreneur_quote'),
      name: t('testimonial_entrepreneur_name'),
      imgSrc: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1"
    }
  ];

  const stats = [
    { value: 6000, label: t('s6_stat1_label') },
    { value: 3800, label: t('s6_stat2_label') },
    { value: 21, label: t('s6_stat3_label') },
    { value: 100, label: t('s6_stat4_label') },
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center lg:text-left mb-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {t('s6_title')}
              </h2>
            </motion.div>

            <Carousel className="w-full max-w-md mx-auto lg:mx-0">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50">
                        <CardContent className="p-8">
                          <div className="flex items-start gap-6">
                            <img className="w-16 h-16 rounded-full object-cover flex-shrink-0" alt={`Foto de ${testimonial.name}`} src={testimonial.imgSrc} />
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                  <testimonial.icon className="w-5 h-5 text-purple-400" />
                                  <span className="text-sm font-bold text-purple-400 uppercase">{t(`testimonial_type_${testimonial.type}`)}</span>
                              </div>
                              <p className="text-lg mb-4 italic text-gray-300">"{testimonial.quote}"</p>
                              <p className="font-semibold">– {testimonial.name}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-[-50px]" />
              <CarouselNext className="right-[-50px]" />
            </Carousel>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center bg-slate-800/50 p-6 rounded-xl"
              >
                <div className="text-4xl md:text-5xl font-bold text-cyan-400">
                  +<AnimatedNumber value={stat.value} />
                </div>
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsAndStatsSection;