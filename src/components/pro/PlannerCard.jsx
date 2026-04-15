import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

const PlannerCard = ({ icon: Icon, title, subtitle, status, onAction, delay }) => {
    const statusConfig = {
        "Sin definir": "default",
        "Requiere información": "destructive",
        "Opcional": "secondary",
        "Pendiente de evaluación": "outline",
        "Sin revisar": "outline",
        "Requiere más datos": "destructive",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 300 }}
            className="bg-slate-800/50 p-6 rounded-2xl h-full flex flex-col justify-between border border-fuchsia-500/20 hover:border-fuchsia-500/50 transition-all cursor-pointer hover-glow"
            onClick={onAction}
        >
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-fuchsia-500/10 rounded-lg">
                        <Icon className="w-8 h-8 text-fuchsia-400" />
                    </div>
                    <Badge variant={statusConfig[status] || 'default'}>{status}</Badge>
                </div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
            </div>
            <Button variant="link" className="text-fuchsia-400 p-0 mt-6 justify-start hover:text-fuchsia-300">
                Abrir planificador <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </motion.div>
    );
};

export default PlannerCard;