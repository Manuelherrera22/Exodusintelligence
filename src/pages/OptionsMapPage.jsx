import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Filter, Maximize, Minus, Plus, Route, X, Bell, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';
import { useRouteSelector } from '@/hooks/useRouteSelector';
import { useUserProfile } from '@/hooks/useUserProfile';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// This data would ideally come from a dynamic calculation based on the user's full profile
const countryCompatibilityData = {
    "CAN": { score: 92, objective: "study", name: "Canadá" }, "USA": { score: 25, objective: "work", name: "Estados Unidos" }, "MEX": { score: 68, objective: "invest", name: "México" },
    "PAN": { score: 88, objective: "invest", name: "Panamá" }, "COL": { score: 100, objective: "origin", name: "Colombia" }, "BRA": { score: 70, objective: "work", name: "Brasil" },
    "ARG": { score: 85, objective: "study", name: "Argentina" }, "CHL": { score: 78, objective: "work", name: "Chile" }, "PRY": { score: 95, objective: "invest", name: "Paraguay" },
    "URY": { score: 85, objective: "invest", name: "Uruguay" }, "ESP": { score: 90, objective: "work", name: "España" }, "PRT": { score: 93, objective: "invest", name: "Portugal" },
    "FRA": { score: 62, objective: "study", name: "Francia" }, "DEU": { score: 59, objective: "work", name: "Alemania" }, "ITA": { score: 49, objective: "family", name: "Italia" },
    "GBR": { score: 41, objective: "work", name: "Reino Unido" }, "AUS": { score: 37, objective: "study", name: "Australia" }, "NZL": { score: 36, objective: "work", name: "Nueva Zelanda" },
    "ARE": { score: 14, objective: "invest", name: "EAU" }, "JPN": { score: 5, objective: "work", name: "Japón" }, "CHN": { score: 2, objective: "invest", name: "China" }
};

const getCountryStyle = (score, isOrigin) => {
    if (isOrigin) {
        return {
            default: "fill-blue-500/80 stroke-slate-800/50",
            hover: "fill-blue-400 stroke-slate-700",
            pressed: "fill-blue-600 stroke-slate-700",
        };
    }
    if (score >= 85) return { default: "fill-green-500/80", hover: "fill-green-400", pressed: "fill-green-600" }; // Dark Green
    if (score >= 65) return { default: "fill-emerald-500/70", hover: "fill-emerald-400", pressed: "fill-emerald-600" }; // Light Green
    if (score >= 40) return { default: "fill-yellow-500/70", hover: "fill-yellow-400", pressed: "fill-yellow-600" }; // Yellow (transition)
    if (score >= 20) return { default: "fill-red-500/70", hover: "fill-red-400", pressed: "fill-red-600" }; // Red
    if (score > 0) return { default: "fill-rose-800/80", hover: "fill-rose-700", pressed: "fill-rose-900" }; // Dark Red
    return { default: "fill-slate-700/50", hover: "fill-slate-600", pressed: "fill-slate-800" }; // Default/No data
};


const MapControls = ({ onZoomIn, onZoomOut, onReset }) => (
    <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-10">
        <Button size="icon" onClick={onZoomIn} className="bg-slate-700 hover:bg-slate-600"><Plus className="w-4 h-4" /></Button>
        <Button size="icon" onClick={onZoomOut} className="bg-slate-700 hover:bg-slate-600"><Minus className="w-4 h-4" /></Button>
        <Button size="icon" onClick={onReset} className="bg-slate-700 hover:bg-slate-600"><Maximize className="w-4 h-4" /></Button>
    </div>
);

const OptionsMapPage = () => {
    const { t } = useTranslation(['dashboard', 'caminoMigratorio']);
    const navigate = useNavigate();
    const { toast } = useToast();
    const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
    const [filter, setFilter] = useState("all");
    const { selectRoute, loading: selectingRoute } = useRouteSelector();
    const { profile, loading: loadingProfile } = useUserProfile();

    const handleZoomIn = () => setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.5 }));
    const handleZoomOut = () => setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.5 }));
    const handleReset = () => setPosition({ coordinates: [0, 0], zoom: 1 });

    const filteredCountries = useMemo(() => {
        if (filter === 'all') return countryCompatibilityData;
        return Object.entries(countryCompatibilityData).reduce((acc, [key, value]) => {
            if (value.objective === filter) {
                acc[key] = value;
            }
            return acc;
        }, {});
    }, [filter]);

    const handleCountryClick = async (geo) => {
        if (selectingRoute) return;

        const countryName = geo.properties.NAME;
        const countryCode = geo.properties.ISO_A3;
        const countryData = countryCompatibilityData[countryCode];

        if (countryData?.objective === 'origin') {
            toast({
                title: "Este es tu país de origen",
                description: "No puedes seleccionarlo como destino.",
                variant: "info"
            });
            return;
        }
        
        toast({
            title: `Activando ruta para ${countryName}...`,
            description: 'Un momento por favor.',
        });

        const { success, error } = await selectRoute(countryName);

        if (success) {
            toast({
                title: "¡Ruta Activada!",
                description: `Tu ruta migratoria para ${countryName} ha sido seleccionada.`,
                variant: 'success'
            });
            navigate('/my-migration-route');
        } else {
            toast({
                title: "Error al activar la ruta",
                description: error?.message || `No se pudo seleccionar la ruta para ${countryName}. Inténtalo de nuevo o elige otro país.`,
                variant: "destructive",
            });
        }
    };

    const originCountryCode = useMemo(() => {
        const originEntry = Object.entries(countryCompatibilityData).find(([, value]) => value.objective === 'origin');
        return originEntry ? originEntry[0] : null;
    }, []);

    if (loadingProfile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{t('options_map.page_title')}</title>
                <meta name="description" content={t('options_map.page_description')} />
            </Helmet>
            <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white flex flex-col">
                <header className="p-4 flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/dashboard')} className="flex-shrink-0">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al Dashboard
                    </Button>
                </header>
                
                <main className="flex-grow flex flex-col p-4 md:p-8 pt-0">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
                            {t('options_map.emotional_banner_title')}
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto">{t('options_map.emotional_banner_desc')}</p>
                    </motion.div>

                    <Card className="mb-6 bg-slate-800/50 border-slate-700">
                        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                             <div className="flex items-center gap-3">
                                <Bell className="w-6 h-6 text-amber-400" />
                                <div>
                                    <p className="font-bold text-amber-300">{t('options_map.alert.title')}</p>
                                    <p className="text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: t('options_map.alert.text')}} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Filter className="w-5 h-5 text-gray-400" />
                                <Select onValueChange={setFilter} defaultValue="all">
                                    <SelectTrigger className="w-[200px] bg-slate-800 border-slate-600">
                                        <SelectValue placeholder={t('options_map.filters.label')} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 text-white border-slate-600">
                                        <SelectItem value="all">Todos los objetivos</SelectItem>
                                        <SelectItem value="work">{t('options_map.filters.options.work')}</SelectItem>
                                        <SelectItem value="study">{t('options_map.filters.options.study')}</SelectItem>
                                        <SelectItem value="invest">{t('options_map.filters.options.invest')}</SelectItem>
                                        <SelectItem value="family">{t('options_map.filters.options.family')}</SelectItem>
                                        <SelectItem value="refuge">{t('options_map.filters.options.refuge')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex-grow relative bg-slate-800/30 rounded-2xl overflow-hidden border border-slate-700">
                        {(selectingRoute || loadingProfile) && (
                            <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center z-30">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                        )}
                        <TooltipProvider>
                            <ComposableMap projectionConfig={{ center: [-30, 0], scale: 160 }} className="w-full h-full">
                                <ZoomableGroup
                                    zoom={position.zoom}
                                    center={position.coordinates}
                                    onMoveEnd={(pos) => setPosition(pos)}
                                    style={{transition: "all 300ms"}}
                                >
                                    <Geographies geography={geoUrl}>
                                        {({ geographies }) =>
                                            geographies.map((geo) => {
                                                const countryCode = geo.properties.ISO_A3;
                                                const countryData = filteredCountries[countryCode];
                                                const isOrigin = countryCode === originCountryCode;
                                                const score = countryData ? countryData.score : 0;
                                                const styles = getCountryStyle(score, isOrigin);
                                                const isClickable = !selectingRoute && !isOrigin;

                                                return (
                                                    <Tooltip key={geo.rsmKey}>
                                                        <TooltipTrigger asChild>
                                                            <Geography
                                                                geography={geo}
                                                                className={`transition-colors ${isClickable ? 'cursor-pointer' : 'cursor-default'} ${styles.default}`}
                                                                style={{
                                                                    default: { outline: "none" },
                                                                    hover: { fill: isClickable ? styles.hover : styles.default, outline: "none" },
                                                                    pressed: { fill: isClickable ? styles.pressed : styles.default, outline: "none" },
                                                                }}
                                                                onClick={() => isClickable && handleCountryClick(geo)}
                                                            />
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-slate-800 border-slate-700 text-white">
                                                            <p>{geo.properties.NAME} {isOrigin && "(Origen)"}</p>
                                                            {countryData && !isOrigin && <p>Compatibilidad: {score}%</p>}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                );
                                            })
                                        }
                                    </Geographies>
                                </ZoomableGroup>
                            </ComposableMap>
                        </TooltipProvider>
                        <MapControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onReset={handleReset} />
                    </div>
                </main>
            </div>
        </>
    );
};

export default OptionsMapPage;