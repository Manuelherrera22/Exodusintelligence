import React from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const InteractiveMap = () => {
  const { toast } = useToast();

  const countries = [
    { name: 'Panamá', pos: { top: '55%', left: '25%' } },
    { name: 'Uruguay', pos: { top: '85%', left: '35%' } },
    { name: 'Portugal', pos: { top: '35%', left: '48%' } },
    { name: 'EAU', pos: { top: '45%', left: '65%' } },
    { name: 'Paraguay', pos: { top: '75%', left: '34%' } },
    { name: 'Estonia', pos: { top: '20%', left: '58%' } },
  ];

  const handleCountryClick = (countryName) => {
    toast({
      title: `📍 ${countryName}`,
      description: "Próximamente: Información detallada del destino.",
    });
  };

  return (
    <div className="relative w-full h-[500px] bg-slate-800/30 rounded-lg overflow-hidden border border-purple-500/20">
      <img 
        className="absolute inset-0 w-full h-full object-cover opacity-20"
        alt="Mapa del mundo estilizado con topografía"
       src="https://images.unsplash.com/photo-1571390689710-c1c4d41a83bc" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
      
      {countries.map((country, index) => (
        <motion.div
          key={country.name}
          className="absolute"
          style={{ top: country.pos.top, left: country.pos.left }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <button
            onClick={() => handleCountryClick(country.name)}
            className="relative flex items-center justify-center group"
          >
            <span className="absolute w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-75 group-hover:animate-none"></span>
            <span className="relative w-3 h-3 bg-yellow-500 rounded-full border-2 border-slate-900"></span>
            <span className="absolute bottom-full mb-2 w-max px-3 py-1 text-sm text-white bg-purple-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {country.name}
            </span>
          </button>
        </motion.div>
      ))}
    </div>
  );
};

export default InteractiveMap;