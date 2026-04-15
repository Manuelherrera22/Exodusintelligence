import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const BlogSection = () => {
    const { t } = useTranslation('common');

    const articles = [
        {
            titleKey: 'blog_article1_title',
            descKey: 'blog_article1_desc',
            image: 'Mapa del mundo con pines en países de bajo costo de vida',
        },
        {
            titleKey: 'blog_article2_title',
            descKey: 'blog_article2_desc',
            image: 'Balanza comparando dos pasaportes dorados',
        },
        {
            titleKey: 'blog_article3_title',
            descKey: 'blog_article3_desc',
            image: 'Paisaje sereno de Paraguay con bandera superpuesta',
        },
    ];

    return (
        <section className="py-20 sm:py-24 bg-slate-900">
            <div className="max-w-7xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
                        {t('blog_title')}
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">{t('blog_subtitle')}</p>
                </motion.div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="bg-slate-800/50 border-slate-700 text-white overflow-hidden h-full flex flex-col hover-glow">
                                <div className="aspect-video overflow-hidden">
                                    <img  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt={t(article.titleKey)} src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                                </div>
                                <CardContent className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold mb-2">{t(article.titleKey)}</h3>
                                    <p className="text-gray-400 mb-4 flex-grow">{t(article.descKey)}</p>
                                    <Button variant="link" className="p-0 h-auto text-purple-400 self-start">
                                        {t('blog_read_more')} <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogSection;