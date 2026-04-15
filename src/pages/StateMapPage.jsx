import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Maximize, Minus, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StateMapPage = () => {
    const { t } = useTranslation('state_map');
    const { countryCode } = useParams();
    const navigate = useNavigate();
    const [geoData, setGeoData] = useState(null);
    const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
    const [countryName, setCountryName] = useState('');

    useEffect(() => {
        const fetchGeoData = async () => {
            try {
                const worldData = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(res => res.json());
                const country = worldData.objects.countries.geometries.find(g => g.properties.ISO_A3 === countryCode);
                if (country) {
                    setCountryName(country.properties.NAME);
                }

                const stateDataUrl = `https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/states-${countryCode === 'USA' ? '10m' : '50m'}.json`;
                const response = await fetch(stateDataUrl);
                if (!response.ok) throw new Error('State data not found');
                const data = await response.json();
                setGeoData(data);
            } catch (error) {
                console.error("Error fetching geographic data:", error);
                setGeoData(null);
            }
        };

        fetchGeoData();
    }, [countryCode]);

    const handleZoomIn = () => setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.5 }));
    const handleZoomOut = () => setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.5 }));
    const handleReset = () => setPosition({ coordinates: [0, 0], zoom: 1 });

    return (
        <>
            <Helmet>
                <title>{t('page_title', { country: countryName || countryCode })}</title>
            </Helmet>
            <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white flex flex-col">
                <header className="p-4 flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/options-map')} className="flex-shrink-0">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t('back_to_options')}
                    </Button>
                </header>

                <main className="flex-grow flex flex-col p-4 md:p-8 pt-0">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                            {t('main_title', { country: countryName || countryCode })}
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto">{t('main_subtitle')}</p>
                    </motion.div>

                    <Card className="flex-grow bg-slate-800/30 rounded-2xl overflow-hidden border border-cyan-500/20 relative">
                        {geoData ? (
                            <ComposableMap
                                projection="geoMercator"
                                projectionConfig={{
                                    scale: 400,
                                }}
                                className="w-full h-full"
                            >
                                <ZoomableGroup
                                    zoom={position.zoom}
                                    center={position.coordinates}
                                    onMoveEnd={(pos) => setPosition(pos)}
                                    style={{ transition: "all 300ms" }}
                                >
                                    <Geographies geography={geoData}>
                                        {({ geographies }) =>
                                            geographies.map(geo => (
                                                <Geography
                                                    key={geo.rsmKey}
                                                    geography={geo}
                                                    className="fill-cyan-500/30 stroke-slate-800/50 transition-colors"
                                                    style={{
                                                        default: { outline: "none" },
                                                        hover: { fill: "#22d3ee", outline: "none" },
                                                        pressed: { fill: "#06b6d4", outline: "none" },
                                                    }}
                                                />
                                            ))
                                        }
                                    </Geographies>
                                </ZoomableGroup>
                            </ComposableMap>
                        ) : (
                            <div className="flex items-center justify-center h-full">{t('loading_map')}</div>
                        )}
                        <div className="absolute bottom-4 left-4 flex flex-col gap-2">
                            <Button size="icon" onClick={handleZoomIn} className="bg-slate-700 hover:bg-slate-600"><Plus className="w-4 h-4" /></Button>
                            <Button size="icon" onClick={handleZoomOut} className="bg-slate-700 hover:bg-slate-600"><Minus className="w-4 h-4" /></Button>
                            <Button size="icon" onClick={handleReset} className="bg-slate-700 hover:bg-slate-600"><Maximize className="w-4 h-4" /></Button>
                        </div>
                    </Card>
                </main>
            </div>
        </>
    );
};

export default StateMapPage;