import React from 'react';

export const countryData = {
    "PA": {
        name: "Panamá",
        flag: "🇵🇦",
        coordinates: [-79.5, 8.5],
        details: {
            "map_detail_cost_of_living": "~$950 USD/mes",
            "map_detail_migration_req": "Programa 'Naciones Amigas', solvencia económica.",
            "map_detail_job_opps": "Altas en logística, finanzas y comercio.",
            "map_detail_tax_benefits": "Sistema territorial (0% sobre ingresos extranjeros).",
            "map_detail_visa_ease": "Muy Alta (9/10)",
            "map_detail_qol_rank": "Buena",
            "map_detail_health_education": "Acceso a servicios privados de alta calidad."
        }
    },
    "MX": {
        name: "México",
        flag: "🇲🇽",
        coordinates: [-102, 23],
        details: {
            "map_detail_cost_of_living": "~$800 USD/mes",
            "map_detail_migration_req": "Demostrar solvencia económica para residencia temporal.",
            "map_detail_job_opps": "Buenas en turismo, manufactura y tecnología.",
            "map_detail_tax_benefits": "Parcial, requiere asesoría fiscal.",
            "map_detail_visa_ease": "Media (7/10)",
            "map_detail_qol_rank": "Vibrante",
            "map_detail_health_education": "Sistema público y privado disponible."
        }
    },
    "PY": {
        name: "Paraguay",
        flag: "🇵🇾",
        coordinates: [-58.4, -23.4],
        details: {
            "map_detail_cost_of_living": "~$650 USD/mes",
            "map_detail_migration_req": "Depósito bancario de ~$5,000 USD para residencia.",
            "map_detail_job_opps": "En crecimiento, especialmente en agronegocios y servicios.",
            "map_detail_tax_benefits": "Impuestos bajos (10% general), sistema territorial.",
            "map_detail_visa_ease": "Muy Alta (10/10)",
            "map_detail_qol_rank": "En desarrollo",
            "map_detail_health_education": "Acceso básico, sector privado en expansión."
        }
    },
    "ES": {
        name: "España",
        flag: "🇪🇸",
        coordinates: [-3.7, 40.4],
        details: {
            "map_detail_cost_of_living": "~$1,200 USD/mes",
            "map_detail_migration_req": "Visa No Lucrativa o Golden Visa (inversión).",
            "map_detail_job_opps": "Competitivas, buenas en TI, turismo y servicios.",
            "map_detail_tax_benefits": "Limitados (impuesto global), Ley Beckham para especialistas.",
            "map_detail_visa_ease": "Media (6/10)",
            "map_detail_qol_rank": "Muy Alta",
            "map_detail_health_education": "Sistemas públicos de excelente calidad."
        }
    },
    "AE": {
        name: "EAU",
        flag: "🇦🇪",
        coordinates: [54.3, 24.4],
        details: {
            "map_detail_cost_of_living": "~$2,500 USD/mes",
            "map_detail_migration_req": "Patrocinio de empleador, visa de inversionista o freelancer.",
            "map_detail_job_opps": "Excelentes en finanzas, tecnología, turismo de lujo.",
            "map_detail_tax_benefits": "0% de impuesto sobre la renta personal.",
            "map_detail_visa_ease": "Alta (8/10)",
            "map_detail_qol_rank": "Muy Alta",
            "map_detail_health_education": "Servicios privados de clase mundial."
        }
    },
    "UY": {
        name: "Uruguay",
        flag: "🇺🇾",
        coordinates: [-56.1, -34.9],
        details: {
            "map_detail_cost_of_living": "~$1,100 USD/mes",
            "map_detail_migration_req": "Demostrar ingresos estables.",
            "map_detail_job_opps": "Estables, especialmente en TI y servicios financieros.",
            "map_detail_tax_benefits": "Exención fiscal de 10 años para nuevos residentes.",
            "map_detail_visa_ease": "Media (7/10)",
            "map_detail_qol_rank": "Alta (país más estable de LatAm).",
            "map_detail_health_education": "Buen acceso a sistemas públicos y privados."
        }
    },
    "CA": {
        name: "Canadá",
        flag: "🇨🇦",
        coordinates: [-106.3, 56.1],
        details: {
            "map_detail_cost_of_living": "~$1,800 USD/mes",
            "map_detail_migration_req": "Sistema de puntos (Express Entry), estudios, experiencia.",
            "map_detail_job_opps": "Altas en sectores calificados (salud, TI, ingeniería).",
            "map_detail_tax_benefits": "Impuesto global, sistema progresivo.",
            "map_detail_visa_ease": "Media-Alta (7/10)",
            "map_detail_qol_rank": "Muy Alta",
            "map_detail_health_education": "Sistemas públicos universales de alta calidad."
        }
    },
    "PT": {
        name: "Portugal",
        flag: "🇵🇹",
        coordinates: [-8.2, 39.4],
        details: {
            "map_detail_cost_of_living": "~$1,100 USD/mes",
            "map_detail_migration_req": "Visa D7 (ingresos pasivos) o Golden Visa (inversión).",
            "map_detail_job_opps": "Moderadas, en crecimiento en tecnología y turismo.",
            "map_detail_tax_benefits": "Régimen NHR con tasa fija del 20% por 10 años.",
            "map_detail_visa_ease": "Alta (8/10)",
            "map_detail_qol_rank": "Alta",
            "map_detail_health_education": "Buen sistema de salud público, acceso a la UE."
        }
    },
    "US": {
        name: "Estados Unidos",
        flag: "🇺🇸",
        coordinates: [-98.5, 39.8],
        special: true,
        details: {
            "map_detail_cost_of_living": "~$2,200 USD/mes (muy variable)",
            "map_detail_migration_req": "Complejo: visas de trabajo (H-1B), inversión (EB-5), lotería de visas.",
            "map_detail_job_opps": "Muy altas en todos los sectores, pero competitivas.",
            "map_detail_tax_benefits": "Impuesto global, sistema complejo.",
            "map_detail_visa_ease": "Baja (4/10)",
            "map_detail_qol_rank": "Variable por estado",
            "map_detail_health_education": "Sistema privado costoso, alta calidad educativa."
        },
        visaInfo: {
            accessibleVisas: ["Visa de Turista (B1/B2) con intención de ajuste", "Programas de patrocinio laboral en sectores de alta demanda (agricultura, hostelería)"],
            alternativeRoutes: ["Visa de Inversión (E-2, EB-5)", "Asilo Político (casos específicos)", "Reunificación Familiar", "Visa de Talento (O-1)"],
            challenges: ["Procesos largos y costosos", "Altos requisitos de elegibilidad", "Competencia elevada", "Sistema migratorio politizado"],
            benefits: ["Potencial de ingresos elevado", "Acceso al mercado más grande del mundo", "Oportunidades de innovación y emprendimiento", "Diversidad cultural"],
            accessibleStates: ["Florida", "Texas", "Arizona", "California"]
        }
    }
};