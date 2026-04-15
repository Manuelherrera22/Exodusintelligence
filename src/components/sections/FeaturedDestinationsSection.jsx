import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ArrowRight } from 'lucide-react';

const featured = [
    { code: 'PA', flag: '🇵🇦', countryKey: 'map_country_panamá', reasonKey: 'featured_reason_panama', ctaKey: 'featured_cta_panama' },
    { code: 'CA', flag: '🇨🇦', countryKey: 'map_country_canadá', reasonKey: 'featured_reason_canada', ctaKey: 'featured_cta_canada' },
    { code: 'PY', flag: '🇵🇾', countryKey: 'map_country_paraguay', reasonKey: 'featured_reason_paraguay', ctaKey: 'featured_cta_paraguay' },
    { code: 'UY', flag: '🇺🇾', countryKey: 'map_country_uruguay', reasonKey: 'featured_reason_uruguay', ctaKey: 'featured_cta_uruguay' },
    { code: 'ES', flag: '🇪🇸', countryKey: 'map_country_españa', reasonKey: 'featured_reason_spain', ctaKey: 'featured_cta_spain' },
    { code: 'PT', flag: '🇵🇹', countryKey: 'map_country_portugal', reasonKey: 'featured_reason_portugal', ctaKey: 'featured_cta_portugal' },
    { code: 'AE', flag: '🇦🇪', countryKey: 'map_country_eau', reasonKey: 'featured_reason_uae', ctaKey: 'featured_cta_uae' },
];

const FeaturedDestinationsSection = () => {
    const { t } = useTranslation('common');

    return (
        <section className="py-20 sm:py-24 px-4 bg-slate-900">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                        🌟 {t('featured_title')}
                    </h2>
                </motion.div>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {featured.map((item, index) => (
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                <div className="p-1">
                                    <Card className="bg-slate-800/50 border-slate-700 text-white overflow-hidden h-full flex flex-col">
                                        <CardContent className="p-6 flex flex-col flex-grow">
                                            <div className="flex items-center gap-4 mb-4">
                                                <span className="text-5xl">{item.flag}</span>
                                                <h3 className="text-2xl font-bold">{t(item.countryKey)}</h3>
                                            </div>
                                            <p className="text-gray-400 mb-6 flex-grow">{t(item.reasonKey)}</p>
                                            <Button className="w-full mt-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                                                {t(item.ctaKey)} <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="text-white border-slate-600 bg-slate-800 hover:bg-slate-700 hover:text-white" />
                    <CarouselNext className="text-white border-slate-600 bg-slate-800 hover:bg-slate-700 hover:text-white" />
                </Carousel>
            </div>
        </section>
    );
};

export default FeaturedDestinationsSection;