import React, { useEffect } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Users, Globe, UserCheck } from 'lucide-react';

const AnimatedNumber = ({ value }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const spring = useSpring(0, { mass: 0.8, stiffness: 20, damping: 20 });
    const display = useTransform(spring, (current) =>
        `+${Math.round(current).toLocaleString('es-ES')}`
    );

    useEffect(() => {
        if (isInView) {
            spring.set(value);
        }
    }, [spring, value, isInView]);

    return <motion.span ref={ref}>{display}</motion.span>;
};


const ImpactCounter = () => {
    const { t } = useTranslation('general');

    const stats = [
        { icon: Users, value: 12370, textKey: 'impact_users' },
        { icon: Globe, value: 72, textKey: 'impact_countries' },
        { icon: UserCheck, value: 1640, textKey: 'impact_profiles' },
    ];

    return (
        <section className="py-24 bg-transparent">
            <div className="max-w-5xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                            className="glass-card p-8 flex flex-col items-center text-center hover-glow"
                        >
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mb-5">
                               <stat.icon className="w-8 h-8 text-white" />
                            </div>
                            <p className="text-5xl font-bold text-white mb-2">
                                <AnimatedNumber value={stat.value} />
                            </p>
                            <p className="text-gray-400 font-medium">{t(stat.textKey)}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ImpactCounter;