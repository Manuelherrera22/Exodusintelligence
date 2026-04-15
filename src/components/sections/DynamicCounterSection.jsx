import React, { useEffect } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Users, CheckCircle } from 'lucide-react';

const AnimatedNumber = ({ value }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });
    const spring = useSpring(0, { mass: 0.8, stiffness: 20, damping: 20 });
    const display = useTransform(spring, (current) =>
        Math.round(current).toLocaleString('es-ES')
    );

    useEffect(() => {
        if (isInView) {
            spring.set(value);
        }
    }, [spring, value, isInView]);

    return <motion.span ref={ref}>{display}</motion.span>;
};

const DynamicCounterSection = () => {
    const { t } = useTranslation('common');

    const stats = [
        { icon: Users, value: 5140, textKey: 'counter_stat1_text' },
        { icon: CheckCircle, value: 92, textKey: 'counter_stat2_text' },
    ];

    return (
        <section className="py-16 bg-slate-900/70">
            <div className="max-w-4xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex items-center gap-6"
                        >
                            <stat.icon className="w-12 h-12 text-cyan-400 flex-shrink-0" />
                            <div>
                                <p className="text-4xl font-bold text-white">
                                    <AnimatedNumber value={stat.value} />
                                </p>
                                <p className="text-gray-400">{t(stat.textKey)}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DynamicCounterSection;