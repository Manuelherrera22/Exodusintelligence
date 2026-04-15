import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { X, Globe, Layers, Star } from 'lucide-react';
import { countryData } from '@/data/countries';
import { useNavigate } from 'react-router-dom';
import UsaVisaModal from '@/components/UsaVisaModal';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const CountryDetailPanel = ({ country, onClose, t }) => {
    const navigate = useNavigate();

    if (!country) return null;

    const details = country.details || {};

    const handleQualifyClick = () => {
        navigate('/registro');
    };

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute top-0 right-0 h-full w-full max-w-sm bg-slate-800/80 backdrop-blur-lg border-l border-slate-700 shadow-2xl z-20 p-6 flex flex-col"
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                    <span className="text-3xl">{country.flag}</span>
                    {t(`map_country_${country.name.toLowerCase()}`, { ns: 'common' })}
                </h3>
                <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
            </div>
            <div className="flex-grow overflow-y-auto pr-2">
                <ul className="space-y-3">
                    {Object.entries(details).map(([key, value]) => (
                         <li key={key} className="flex flex-col text-sm p-3 bg-slate-900/50 rounded-md">
                             <span className="text-gray-400 font-semibold mb-1">{t(key, { ns: 'common' })}:</span>
                             <span className="text-right text-white">{value}</span>
                         </li>
                    ))}
                </ul>
            </div>
            <div className="mt-6 space-y-3">
                <Button onClick={handleQualifyClick} className="w-full bg-purple-600 hover:bg-purple-700">
                    <Layers className="w-4 h-4 mr-2" /> {t('map_cta', { ns: 'common' })}
                </Button>
            </div>
        </motion.div>
    );
};

const InteractiveMapSection = () => {
    const { t } = useTranslation('exodus');
    const { t: tCommon } = useTranslation('common');
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [isUsaModalOpen, setIsUsaModalOpen] = useState(false);

    const handleCountryClick = (countryCode) => {
        const data = countryData[countryCode];
        if (data.special) {
            setIsUsaModalOpen(true);
        } else {
            setSelectedCountry({ ...data, name: countryCode });
        }
    };

    return (
        <section className="py-20 sm:py-24 px-4 bg-slate-900/70 relative overflow-hidden">
            <div className="max-w-7xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
                        🌐 {t('map.title')}
                    </h2>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto">{t('map.subtitle')}</p>
                </motion.div>
                <div className="relative aspect-[16/10] max-w-5xl mx-auto bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
                    <ComposableMap projectionConfig={{ scale: 180 }} className="w-full h-full">
                         <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill="#2E3A59"
                                        stroke="#1E293B"
                                        style={{
                                            default: { outline: 'none' },
                                            hover: { fill: '#3E4A69', outline: 'none' },
                                            pressed: { fill: '#4E5A79', outline: 'none' },
                                        }}
                                    />
                                ))
                            }
                        </Geographies>
                        {Object.entries(countryData).map(([code, { name, coordinates, flag, special }]) => (
                            <Marker key={name} coordinates={coordinates}>
                                <motion.g
                                    onClick={() => handleCountryClick(code)}
                                    className="cursor-pointer group"
                                    whileHover={{ scale: 1.5 }}
                                    transition={{ type: 'spring' }}
                                >
                                    {special ? (
                                        <>
                                            <Star r={8} fill="#FFD700" stroke="#fff" strokeWidth={1.5} className="animate-pulse" />
                                            <Star r={10} fill="transparent" />
                                        </>
                                    ) : (
                                        <>
                                            <circle r={6} fill="#7C3AED" stroke="#fff" strokeWidth={1} />
                                            <circle r={8} fill="transparent" />
                                        </>
                                    )}
                                    <text
                                        textAnchor="middle"
                                        y={-15}
                                        className="text-sm font-bold fill-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                    >
                                        {tCommon(`map_country_${name.toLowerCase()}`)} {flag}
                                    </text>
                                </motion.g>
                            </Marker>
                        ))}
                    </ComposableMap>
                     <AnimatePresence>
                        {selectedCountry && <CountryDetailPanel country={selectedCountry} onClose={() => setSelectedCountry(null)} t={tCommon} />}
                    </AnimatePresence>
                </div>
            </div>
            <UsaVisaModal isOpen={isUsaModalOpen} onClose={() => setIsUsaModalOpen(false)} />
        </section>
    );
};

export default InteractiveMapSection;