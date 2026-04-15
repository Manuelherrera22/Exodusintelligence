import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const PlansSection = () => {
  const { t } = useTranslation('general');
  const navigate = useNavigate();

  const features = [
    'plans_feat_simulator',
    'plans_feat_comparison',
    'plans_feat_ai_rec',
    'plans_feat_lawyers',
    'plans_feat_tax',
  ];

  const plans = [
    {
      name: 'plans_free_name',
      price: '$0',
      desc: 'Para empezar a explorar',
      features: [true, false, false, false, false],
    },
    {
      name: 'plans_advanced_name',
      price: '$49',
      desc: 'Para un análisis profundo',
      features: [true, true, true, false, false],
    },
    {
      name: 'plans_premium_name',
      price: '$99',
      desc: 'Para asesoría experta',
      features: [true, true, true, true, false],
      isFeatured: true,
    },
    {
      name: 'plans_elite_name',
      price: 'Contacto',
      desc: 'Soluciones a medida',
      features: [true, true, true, true, true],
    },
  ];

  return (
    <section id="plans" className="py-24 px-4 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {t('plans_title')}
          </h2>
          <p className="text-lg text-gray-400">{t('plans_subtitle')}</p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan) => (
                <motion.div 
                    key={plan.name}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    className={cn(
                        "glass-card p-8 flex flex-col hover-glow",
                        plan.isFeatured && "border-purple-500 scale-105"
                    )}
                >
                    {plan.isFeatured && (
                         <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                            <span className="bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase">Más Popular</span>
                        </div>
                    )}
                   
                    <h3 className="text-2xl font-bold mb-2">{t(plan.name)}</h3>
                    <p className="text-gray-400 mb-6">{plan.desc}</p>
                    <p className="text-4xl font-extrabold mb-6">
                        {plan.price}
                         {plan.name !== 'plans_free_name' && plan.name !== 'plans_elite_name' && <span className="text-base font-normal text-gray-400">/mes</span>}
                    </p>
                    
                    <ul className="space-y-4 mb-8 text-left flex-grow">
                        {features.map((feature, index) => (
                            <li key={feature} className="flex items-start gap-3">
                                {plan.features[index] ? <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" /> : <X className="w-5 h-5 text-red-500/60 mt-0.5 flex-shrink-0" />}
                                <span className="text-gray-300">{t(feature)}</span>
                            </li>
                        ))}
                    </ul>

                    <Button 
                        onClick={() => navigate('/register')}
                        className={cn(
                            "w-full mt-auto py-3 text-lg",
                            plan.isFeatured 
                                ? "bg-purple-600 hover:bg-purple-700" 
                                : "bg-slate-700 hover:bg-slate-600"
                        )}
                    >
                        Comenzar
                    </Button>
                </motion.div>
            ))}
        </div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-16"
        >
            <Button onClick={() => navigate('/register')} size="lg" variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300">
                {t('plans_cta')}
            </Button>
        </motion.div>

      </div>
    </section>
  );
};

export default PlansSection;