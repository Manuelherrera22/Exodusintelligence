import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from 'lucide-react';

const TestimonialsMixedSection = () => {
  const testimonials = [
    {
      quote: "Nunca creí que pudiera migrar legalmente. Exodus me dio una ruta viable y clara en semanas. Totalmente recomendado.",
      name: "Adriana V.",
      title: "Migrante estándar",
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
      type: "standard"
    },
    {
      quote: "La optimización fiscal era un dolor de cabeza. El equipo de Exodus Premium me ayudó a crear una estructura eficiente y legal en Panamá. Ahorré miles.",
      name: "Carlos S.",
      title: "Inversionista",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
      type: "premium"
    },
    {
      quote: "Como nómada digital, necesitaba una base de operaciones. Exodus me mostró cómo obtener la residencia en Portugal. El proceso fue transparente.",
      name: "Sofia L.",
      title: "Emprendedora Digital",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      type: "standard"
    },
    {
      quote: "Buscaba diversificar mi patrimonio. A través de Exodus accedí a un proyecto inmobiliario en Uruguay con excelentes proyecciones. Todo el due diligence fue impecable.",
      name: "Roberto G.",
      title: "Family Office",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
      type: "premium"
    }
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-gray-900 to-slate-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Historias que inspiran, resultados que transforman
          </h2>
          <p className="text-lg text-gray-300">Desde el primer paso migratorio hasta la estrategia de inversión global.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className={`h-full flex flex-col ${testimonial.type === 'premium' ? 'bg-yellow-900/10 border-yellow-500/20' : 'bg-gray-800/40 border-purple-500/20'}`}>
                      <CardContent className="flex flex-col flex-grow items-center justify-center p-6 text-center">
                        <img 
                          className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-gray-700"
                          alt={`Retrato de ${testimonial.name}`}
                         src="https://images.unsplash.com/photo-1603668406695-0ccbce58bc05" />
                        <p className="text-lg font-semibold text-white mb-1">{testimonial.name}</p>
                        <p className={`text-sm mb-4 ${testimonial.type === 'premium' ? 'text-yellow-400' : 'text-purple-400'}`}>{testimonial.title}</p>
                        <p className="text-gray-300 flex-grow">"{testimonial.quote}"</p>
                        {testimonial.type === 'premium' && (
                           <div className="flex mt-4 text-yellow-400">
                             {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                           </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsMixedSection;