// ═══════════════════════════════════════════════════════════════════════════════
//  EXODUS MIGRATION ENGINE
//  Real scoring based on CRS (Canada), Points Test (Australia), Blue Card (EU)
// ═══════════════════════════════════════════════════════════════════════════════

// ── Country Database ────────────────────────────────────────────────────────
export const COUNTRIES = [
  { name: 'Colombia', code: 'CO', region: 'latam', lang: 'es', gdpTier: 2 },
  { name: 'México', code: 'MX', region: 'latam', lang: 'es', gdpTier: 2 },
  { name: 'Argentina', code: 'AR', region: 'latam', lang: 'es', gdpTier: 2 },
  { name: 'Venezuela', code: 'VE', region: 'latam', lang: 'es', gdpTier: 1 },
  { name: 'Perú', code: 'PE', region: 'latam', lang: 'es', gdpTier: 2 },
  { name: 'Chile', code: 'CL', region: 'latam', lang: 'es', gdpTier: 3 },
  { name: 'Ecuador', code: 'EC', region: 'latam', lang: 'es', gdpTier: 2 },
  { name: 'Bolivia', code: 'BO', region: 'latam', lang: 'es', gdpTier: 1 },
  { name: 'Uruguay', code: 'UY', region: 'latam', lang: 'es', gdpTier: 3 },
  { name: 'Paraguay', code: 'PY', region: 'latam', lang: 'es', gdpTier: 1 },
  { name: 'Brasil', code: 'BR', region: 'latam', lang: 'pt', gdpTier: 2 },
  { name: 'Costa Rica', code: 'CR', region: 'latam', lang: 'es', gdpTier: 3 },
  { name: 'Panamá', code: 'PA', region: 'latam', lang: 'es', gdpTier: 3 },
  { name: 'Guatemala', code: 'GT', region: 'latam', lang: 'es', gdpTier: 1 },
  { name: 'Honduras', code: 'HN', region: 'latam', lang: 'es', gdpTier: 1 },
  { name: 'El Salvador', code: 'SV', region: 'latam', lang: 'es', gdpTier: 1 },
  { name: 'Nicaragua', code: 'NI', region: 'latam', lang: 'es', gdpTier: 1 },
  { name: 'Cuba', code: 'CU', region: 'latam', lang: 'es', gdpTier: 1 },
  { name: 'Rep. Dominicana', code: 'DO', region: 'latam', lang: 'es', gdpTier: 2 },
  { name: 'España', code: 'ES', region: 'europe', lang: 'es', gdpTier: 4 },
  { name: 'Francia', code: 'FR', region: 'europe', lang: 'fr', gdpTier: 5 },
  { name: 'Alemania', code: 'DE', region: 'europe', lang: 'de', gdpTier: 5 },
  { name: 'Italia', code: 'IT', region: 'europe', lang: 'it', gdpTier: 4 },
  { name: 'Portugal', code: 'PT', region: 'europe', lang: 'pt', gdpTier: 4 },
  { name: 'Reino Unido', code: 'GB', region: 'europe', lang: 'en', gdpTier: 5 },
  { name: 'India', code: 'IN', region: 'asia', lang: 'hi', gdpTier: 2 },
  { name: 'China', code: 'CN', region: 'asia', lang: 'zh', gdpTier: 3 },
  { name: 'Japón', code: 'JP', region: 'asia', lang: 'ja', gdpTier: 5 },
  { name: 'Corea del Sur', code: 'KR', region: 'asia', lang: 'ko', gdpTier: 4 },
  { name: 'Filipinas', code: 'PH', region: 'asia', lang: 'tl', gdpTier: 2 },
  { name: 'Nigeria', code: 'NG', region: 'africa', lang: 'en', gdpTier: 1 },
  { name: 'Sudáfrica', code: 'ZA', region: 'africa', lang: 'en', gdpTier: 2 },
  { name: 'Egipto', code: 'EG', region: 'africa', lang: 'ar', gdpTier: 2 },
  { name: 'Marruecos', code: 'MA', region: 'africa', lang: 'ar', gdpTier: 2 },
  { name: 'Estados Unidos', code: 'US', region: 'northamerica', lang: 'en', gdpTier: 5 },
  { name: 'Canadá', code: 'CA', region: 'northamerica', lang: 'en', gdpTier: 5 },
  { name: 'Australia', code: 'AU', region: 'oceania', lang: 'en', gdpTier: 5 },
  { name: 'Nueva Zelanda', code: 'NZ', region: 'oceania', lang: 'en', gdpTier: 5 },
  { name: 'Turquía', code: 'TR', region: 'asia', lang: 'tr', gdpTier: 3 },
  { name: 'Rusia', code: 'RU', region: 'europe', lang: 'ru', gdpTier: 3 },
  { name: 'Israel', code: 'IL', region: 'asia', lang: 'he', gdpTier: 4 },
  { name: 'Holanda', code: 'NL', region: 'europe', lang: 'nl', gdpTier: 5 },
  { name: 'Suecia', code: 'SE', region: 'europe', lang: 'sv', gdpTier: 5 },
  { name: 'Bélgica', code: 'BE', region: 'europe', lang: 'fr', gdpTier: 5 },
  { name: 'Polonia', code: 'PL', region: 'europe', lang: 'pl', gdpTier: 3 },
];

export function findCountry(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return COUNTRIES.filter(c => {
    const n = c.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return n.includes(q);
  }).slice(0, 5);
}

// ── Real CRS Score Tables (Canada) ──────────────────────────────────────────
// Based on: https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/criteria-comprehensive-ranking-system/grid.html

const CRS_AGE = { // Single applicant
  17: 0, 18: 99, 19: 105, 20: 110, 21: 110, 22: 110, 23: 110, 24: 110,
  25: 110, 26: 110, 27: 110, 28: 110, 29: 110, 30: 105, 31: 99,
  32: 94, 33: 88, 34: 83, 35: 77, 36: 72, 37: 66, 38: 61, 39: 55,
  40: 50, 41: 39, 42: 28, 43: 17, 44: 6, 45: 0,
};

const CRS_EDUCATION = {
  primary: 0,
  high_school: 30,
  one_year_diploma: 90,
  two_year_diploma: 98,
  technical: 98,      // Maps to 2-year diploma
  bachelor: 120,
  university: 120,    // Maps to bachelor
  two_or_more: 128,
  masters: 135,
  postgraduate: 135,  // Maps to masters
  doctoral: 150,
};

const CRS_LANGUAGE_CLB = { // First official language, per ability
  10: 34, 9: 31, 8: 23, 7: 16, 6: 9, 5: 6, 4: 6,
};

const CLB_FROM_LEVEL = {
  native: 12, c2: 12, c1: 10, b2: 8, b1: 6, a2: 4, a1: 3, none: 0,
};

const CRS_EXPERIENCE_CANADA = { // Canadian work experience
  0: 0, 1: 40, 2: 53, 3: 64, 4: 72, 5: 80,
};

const CRS_EXPERIENCE_FOREIGN = { // Foreign work experience (with good language)
  0: 0, 1: 13, 2: 25, 3: 50,
};

// ── Destination Programs ────────────────────────────────────────────────────
const DESTINATIONS = [
  {
    country: 'Canadá', code: 'CA',
    programs: [
      { name: 'Express Entry (FSW)', cutoff: 520, type: 'points' },
      { name: 'Provincial Nominee (PNP)', cutoff: 400, type: 'nomination', bonus: 600 },
      { name: 'Atlantic Immigration (AIP)', cutoff: 0, type: 'employer' },
    ],
    idealAge: [20, 35],
    languageReq: 'CLB 7+ (IELTS 6.0+)',
    advantages: ['Sistema transparente de puntos', 'PR en 6-12 meses', 'Salud pública universal'],
  },
  {
    country: 'Australia', code: 'AU',
    programs: [
      { name: 'Skilled Independent (189)', cutoff: 65, type: 'points' },
      { name: 'Skilled Nominated (190)', cutoff: 60, type: 'nomination' },
      { name: 'Skilled Work Regional (491)', cutoff: 50, type: 'regional' },
    ],
    idealAge: [25, 32],
    languageReq: 'IELTS 6.0+ (Competent)',
    advantages: ['Salario mínimo más alto del mundo', 'Ciudadanía en 4 años', 'Calidad de vida excepcional'],
  },
  {
    country: 'Alemania', code: 'DE',
    programs: [
      { name: 'EU Blue Card', cutoff: 0, type: 'salary', minSalary: '€43,800' },
      { name: 'Chancenkarte (Opportunity Card)', cutoff: 6, type: 'points' },
      { name: 'Job Seeker Visa', cutoff: 0, type: 'qualification' },
    ],
    idealAge: [23, 40],
    languageReq: 'Alemán A2+ o Inglés B2+',
    advantages: ['Motor económico de Europa', 'Universidad gratuita', 'Altísima demanda STEM'],
  },
  {
    country: 'España', code: 'ES',
    programs: [
      { name: 'Visa Nómada Digital', cutoff: 0, type: 'income', minIncome: '€2,520/mes' },
      { name: 'Arraigo Social', cutoff: 0, type: 'residency', minYears: 3 },
      { name: 'Visa No Lucrativa', cutoff: 0, type: 'income' },
    ],
    idealAge: [22, 50],
    languageReq: 'Español nativo = ventaja',
    advantages: ['Idioma español', 'Puerta a toda la UE', 'Calidad de vida excepcional'],
  },
  {
    country: 'Estados Unidos', code: 'US',
    programs: [
      { name: 'H-1B Specialty Occupation', cutoff: 0, type: 'employer', lottery: true },
      { name: 'EB-2/EB-3 Green Card', cutoff: 0, type: 'employer' },
      { name: 'O-1 Extraordinary Ability', cutoff: 0, type: 'merit' },
    ],
    idealAge: [22, 45],
    languageReq: 'Inglés profesional',
    advantages: ['Mercado laboral más grande', 'Salarios competitivos', 'Hub de innovación global'],
  },
  {
    country: 'Portugal', code: 'PT',
    programs: [
      { name: 'Tech Visa', cutoff: 0, type: 'employer' },
      { name: 'Digital Nomad Visa', cutoff: 0, type: 'income', minIncome: '€3,040/mes' },
      { name: 'Visa D7 Passive Income', cutoff: 0, type: 'income' },
    ],
    idealAge: [22, 50],
    languageReq: 'Portugués o Inglés B1+',
    advantages: ['Costo accesible en la UE', 'Clima mediterráneo', 'Comunidad latina activa'],
  },
  {
    country: 'Nueva Zelanda', code: 'NZ',
    programs: [
      { name: 'Skilled Migrant Category', cutoff: 160, type: 'points' },
      { name: 'Work to Residence', cutoff: 0, type: 'employer' },
    ],
    idealAge: [20, 39],
    languageReq: 'IELTS 6.5+',
    advantages: ['Top 5 calidad de vida', 'Seguridad', 'Balance trabajo-vida'],
  },
  {
    country: 'Irlanda', code: 'IE',
    programs: [
      { name: 'Critical Skills Permit', cutoff: 0, type: 'salary', minSalary: '€38,000' },
      { name: 'General Employment Permit', cutoff: 0, type: 'employer' },
    ],
    idealAge: [22, 40],
    languageReq: 'Inglés (país angloparlante)',
    advantages: ['Hub tech europeo', 'Inglés nativo', 'Sede corporaciones globales'],
  },
];

// ── Profile Defaults ────────────────────────────────────────────────────────
export function createEmptyProfile() {
  return {
    country: null,       // { name, code, region, lang, gdpTier }
    age: null,           // number
    education: null,     // 'primary' | 'high_school' | 'technical' | 'university' | 'postgraduate'
    field: null,         // 'stem' | 'business' | 'health' | 'arts' | 'trades' | 'other'
    englishLevel: null,  // 'none' | 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2' | 'native'
    frenchLevel: null,   // same scale
    workYears: null,     // number
    targetCountry: null, // code or null (open)
    maritalStatus: null, // 'single' | 'married' | 'partner'
    savings: null,       // 'none' | 'low' | 'medium' | 'high'
    challenges: [],      // ['language', 'money', 'documents', 'family', 'experience']
  };
}

// ── Normalize profile from KAI (string fields → proper objects) ─────────────
export function normalizeProfile(raw) {
  const p = { ...createEmptyProfile(), ...raw };

  // Country: KAI might send "CO" or "Colombia" — resolve to full object
  if (p.country && typeof p.country === 'string') {
    const q = p.country.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const found = COUNTRIES.find(c =>
      c.code.toLowerCase() === q ||
      c.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q)
    );
    p.country = found || { name: p.country, code: p.country.slice(0, 2).toUpperCase(), region: 'other', lang: 'es', gdpTier: 2 };
  }

  // Age: ensure number
  if (typeof p.age === 'string') p.age = parseInt(p.age) || 25;

  // WorkYears: ensure number
  if (typeof p.workYears === 'string') p.workYears = parseInt(p.workYears) || 0;

  // TargetCountry: KAI might send 'null' as string
  if (p.targetCountry === 'null' || p.targetCountry === '') p.targetCountry = null;

  // Defaults for missing optional fields
  if (!p.englishLevel) p.englishLevel = 'none';
  if (!p.frenchLevel) p.frenchLevel = 'none';
  if (!p.education) p.education = 'high_school';
  if (!p.field) p.field = 'other';
  if (!p.challenges) p.challenges = [];

  return p;
}

// ── CRS Calculator ──────────────────────────────────────────────────────────
export function calculateCRS(profile) {
  const breakdown = {
    age: 0,
    education: 0,
    language: 0,
    experience: 0,
    transferability: 0,
    additional: 0,
    total: 0,
    maxPossible: 600,
  };

  // Age (max 110)
  const age = Math.min(Math.max(profile.age || 25, 17), 45);
  breakdown.age = CRS_AGE[age] ?? 0;

  // Education (max 150)
  breakdown.education = CRS_EDUCATION[profile.education] || 0;

  // Language - First Official (max 136 = 34 per ability × 4)
  const clb = CLB_FROM_LEVEL[profile.englishLevel] || 0;
  const perAbility = CRS_LANGUAGE_CLB[Math.min(clb, 10)] || 0;
  breakdown.language = perAbility * 4; // listening, reading, writing, speaking

  // Canadian Experience (max 80) — assume 0 for new immigrants
  // Foreign Experience (max 50)
  const years = Math.min(profile.workYears || 0, 5);
  const foreignYears = Math.min(years, 3);
  breakdown.experience = CRS_EXPERIENCE_FOREIGN[foreignYears] || 0;

  // Transferability bonus (education + language combo, max 50)
  if (clb >= 7 && breakdown.education >= 120) breakdown.transferability += 25;
  if (clb >= 7 && foreignYears >= 2) breakdown.transferability += 25;
  breakdown.transferability = Math.min(breakdown.transferability, 50);

  // Additional (French bonus, job offer, etc)
  const frenchClb = CLB_FROM_LEVEL[profile.frenchLevel] || 0;
  if (frenchClb >= 7) breakdown.additional += 25;
  if (frenchClb >= 7 && clb >= 5) breakdown.additional += 25;

  breakdown.total = breakdown.age + breakdown.education + breakdown.language +
    breakdown.experience + breakdown.transferability + breakdown.additional;

  return breakdown;
}

// ── Overall Migration Score (0-100) ─────────────────────────────────────────
export function calculateOverallScore(profile) {
  let score = 30; // baseline passivity

  // Age (max +20)
  const age = profile.age || 25;
  if (age >= 20 && age <= 29) score += 20;
  else if (age <= 35) score += 17;
  else if (age <= 40) score += 13;
  else if (age <= 45) score += 9;
  else if (age <= 50) score += 6;
  else score += 3;

  // Education (max +20)
  const eduMap = { postgraduate: 20, university: 16, technical: 12, high_school: 7, primary: 3 };
  score += eduMap[profile.education] || 5;

  // Language (max +20)
  const langMap = { native: 20, c2: 20, c1: 17, b2: 14, b1: 10, a2: 6, a1: 3, none: 0 };
  score += langMap[profile.englishLevel] || 0;
  // French bonus
  const frMap = { native: 5, c2: 5, c1: 4, b2: 3, b1: 2, a2: 1, a1: 0, none: 0 };
  score += frMap[profile.frenchLevel] || 0;

  // Work Experience (max +15)
  const years = profile.workYears || 0;
  if (years >= 5) score += 15;
  else if (years >= 3) score += 12;
  else if (years >= 1) score += 8;
  else score += 2;

  // STEM Bonus (max +5)
  if (profile.field === 'stem' || profile.field === 'health') score += 5;
  else if (profile.field === 'business' || profile.field === 'trades') score += 3;

  return Math.min(score, 98);
}

// ── Destination Scoring ─────────────────────────────────────────────────────
export function scoreDestinations(profile) {
  const available = DESTINATIONS.filter(d => d.code !== profile.country?.code);

  return available.map(dest => {
    let score = 0;
    const age = profile.age || 25;

    // Age fit (max 25)
    const [minAge, maxAge] = dest.idealAge;
    if (age >= minAge && age <= maxAge) score += 25;
    else if (age < minAge) score += Math.max(10, 25 - (minAge - age) * 3);
    else score += Math.max(5, 25 - (age - maxAge) * 2);

    // Education fit (max 20)
    const eduScore = { postgraduate: 20, university: 16, technical: 10, high_school: 5, primary: 2 };
    score += eduScore[profile.education] || 5;

    // Language compatibility (max 20)
    const clb = CLB_FROM_LEVEL[profile.englishLevel] || 0;
    if (['CA', 'AU', 'NZ', 'US', 'IE', 'GB'].includes(dest.code)) {
      score += Math.min(clb * 2.5, 20);
    } else if (['ES', 'PT'].includes(dest.code) && profile.country?.lang === 'es') {
      score += 18; // Spanish speakers advantage
    } else if (dest.code === 'DE') {
      score += Math.min(clb * 2, 16); // German programs accept English
    } else {
      score += 10;
    }

    // Origin corridor bonus (max 10)
    if (profile.country?.region === 'latam' && ['CA', 'ES', 'US'].includes(dest.code)) score += 8;
    if (profile.country?.region === 'asia' && ['CA', 'AU', 'NZ'].includes(dest.code)) score += 8;
    if (profile.country?.region === 'africa' && ['FR', 'CA'].includes(dest.code)) score += 8;

    // Work experience fit (max 15)
    const years = profile.workYears || 0;
    if (years >= 3) score += 15;
    else if (years >= 1) score += 10;
    else score += 4;

    // STEM bonus (max 10)
    if (profile.field === 'stem' && ['CA', 'AU', 'DE', 'IE'].includes(dest.code)) score += 10;
    if (profile.field === 'health' && ['CA', 'AU', 'NZ'].includes(dest.code)) score += 10;

    const normalizedScore = Math.min(Math.round(score), 99);

    return {
      ...dest,
      score: normalizedScore,
      bestProgram: dest.programs[0],
    };
  }).sort((a, b) => b.score - a.score).slice(0, 5);
}

// ── Diagnosis Generator ─────────────────────────────────────────────────────
export function diagnose(profile) {
  const strengths = [];
  const weaknesses = [];
  const opportunities = [];

  const age = profile.age || 25;
  const clb = CLB_FROM_LEVEL[profile.englishLevel] || 0;
  const years = profile.workYears || 0;

  // Age analysis
  if (age >= 20 && age <= 29) strengths.push({ area: 'Edad', detail: `${age} años — rango óptimo para programas de puntos (CRS máximo: 110 pts)`, impact: 'high' });
  else if (age <= 35) strengths.push({ area: 'Edad', detail: `${age} años — aún competitivo en la mayoría de programas`, impact: 'medium' });
  else if (age <= 40) opportunities.push({ area: 'Edad', detail: `A los ${age}, algunos puntos se reducen. Compensable con educación y experiencia.`, impact: 'medium' });
  else weaknesses.push({ area: 'Edad', detail: `A los ${age}, los programas de puntos CRS/Points penalizan significativamente. Considerar rutas alternativas (PNP, employer-sponsored).`, impact: 'high' });

  // Education
  if (['postgraduate', 'university'].includes(profile.education)) {
    strengths.push({ area: 'Educación', detail: `Título ${profile.education === 'postgraduate' ? 'de posgrado' : 'universitario'} — altamente valorado en todos los sistemas`, impact: 'high' });
  } else if (profile.education === 'technical') {
    opportunities.push({ area: 'Educación', detail: 'Título técnico tiene buen valor. Un curso adicional de 1 año podría sumar +7 pts CRS.', impact: 'medium' });
  } else {
    weaknesses.push({ area: 'Educación', detail: 'Nivel educativo bajo reduce opciones. Considerar certificaciones técnicas o diplomas cortos.', impact: 'high' });
  }

  // Language
  const engLabel = (profile.englishLevel || 'none').toUpperCase();
  if (clb >= 9) strengths.push({ area: 'Idioma Inglés', detail: `Nivel ${engLabel} — excelente, máximo o cerca de máximo puntaje CLB`, impact: 'high' });
  else if (clb >= 7) strengths.push({ area: 'Idioma Inglés', detail: `Nivel ${engLabel} — cumple requisitos mínimos de la mayoría de programas`, impact: 'medium' });
  else if (clb >= 5) weaknesses.push({ area: 'Idioma Inglés', detail: `Nivel ${engLabel} (CLB ${clb}) — por debajo del mínimo competitivo. Subir a B2/C1 puede significar +80-130 pts CRS. Este es probablemente tu mayor cuello de botella.`, impact: 'critical' });
  else weaknesses.push({ area: 'Idioma Inglés', detail: 'Sin nivel de inglés suficiente. Prioridad absoluta antes de aplicar a cualquier programa angloparlante.', impact: 'critical' });

  // French
  const frClb = CLB_FROM_LEVEL[profile.frenchLevel || 'none'] || 0;
  if (frClb >= 7) strengths.push({ area: 'Francés', detail: `Nivel ${(profile.frenchLevel || 'none').toUpperCase()} — bonus significativo para Canadá (+25-50 pts CRS)`, impact: 'high' });
  else if (frClb === 0 && profile.targetCountry === 'CA') {
    opportunities.push({ area: 'Francés', detail: 'Aprender francés puede darte hasta +50 pts CRS adicionales sin necesidad de nivel avanzado.', impact: 'medium' });
  }

  // Experience
  if (years >= 5) strengths.push({ area: 'Experiencia', detail: `${years} años de experiencia — cumple requisitos máximos de la mayoría de programas`, impact: 'high' });
  else if (years >= 3) strengths.push({ area: 'Experiencia', detail: `${years} años — buena base de experiencia profesional`, impact: 'medium' });
  else if (years >= 1) opportunities.push({ area: 'Experiencia', detail: `${years} año(s) — cada año adicional de experiencia calificada suma puntos significativos`, impact: 'medium' });
  else weaknesses.push({ area: 'Experiencia', detail: 'Sin experiencia laboral formal. Buscar empleo en tu área es prioritario.', impact: 'high' });

  // Field
  if (profile.field === 'stem') strengths.push({ area: 'Sector STEM', detail: 'Los profesionales de tecnología/ingeniería/ciencias tienen listas de ocupaciones prioritarias en Canadá, Australia y Alemania', impact: 'high' });
  if (profile.field === 'health') strengths.push({ area: 'Sector Salud', detail: 'Profesionales de salud tienen la mayor demanda global. Rutas aceleradas en Canadá, Australia y NZ.', impact: 'high' });

  // CRS estimate for Canada
  const crs = calculateCRS(profile);
  const crsGap = 520 - crs.total;

  return {
    strengths,
    weaknesses,
    opportunities,
    crs,
    crsGap: Math.max(0, crsGap),
    criticalBottleneck: weaknesses.find(w => w.impact === 'critical')?.area || weaknesses[0]?.area || null,
    summary: generateSummaryText(profile, crs, strengths, weaknesses),
  };
}

function generateSummaryText(profile, crs, strengths, weaknesses) {
  const critical = weaknesses.find(w => w.impact === 'critical');
  const strongCount = strengths.filter(s => s.impact === 'high').length;

  if (strongCount >= 3 && !critical) {
    return `Tu perfil es altamente competitivo. Con ${strengths.length} fortalezas sólidas y un CRS estimado de ${crs.total}, estás en posición favorable para múltiples programas migratorios. Enfócate en optimizar los detalles y preparar tu documentación.`;
  } else if (critical) {
    return `Tu perfil tiene buena base pero un cuello de botella crítico: ${critical.area}. Resolver esto primero puede agregar más de 100 puntos a tu CRS (actual: ${crs.total}, objetivo: 520+). La buena noticia: es completamente solucionable con un plan de acción.`;
  } else {
    return `Tu perfil tiene potencial moderado (CRS: ${crs.total}). Con mejoras estratégicas en ${weaknesses.map(w => w.area).join(' y ')}, puedes subir significativamente tu competitividad en 6-12 meses.`;
  }
}

// ── Task Generator ──────────────────────────────────────────────────────────
export function generateTasks(profile, diagnosis) {
  const tasks = [];
  const clb = CLB_FROM_LEVEL[profile.englishLevel] || 0;

  // Critical: Language
  if (clb < 7) {
    tasks.push({
      id: 'lang-1', category: 'language', priority: 'critical',
      title: 'Registrarse en plataforma de inglés',
      description: 'Descarga ELSA Speak o Duolingo y completa la evaluación inicial',
      duration: '15 min', points: 10, week: 1,
    });
    tasks.push({
      id: 'lang-2', category: 'language', priority: 'critical',
      title: 'Práctica de listening diaria',
      description: 'Escucha un podcast en inglés de 20 minutos (recomendado: BBC Learning English)',
      duration: '20 min', points: 5, week: 1, recurring: true,
    });
    tasks.push({
      id: 'lang-3', category: 'language', priority: 'critical',
      title: 'Investigar fechas de IELTS/CELPIP',
      description: 'Busca centros de examen IELTS en tu ciudad y próximas fechas disponibles',
      duration: '30 min', points: 15, week: 1,
    });
    tasks.push({
      id: 'lang-4', category: 'language', priority: 'critical',
      title: 'Escribir 1 párrafo en inglés',
      description: 'Escribe 100 palabras sobre tu experiencia profesional en inglés',
      duration: '15 min', points: 5, week: 1, recurring: true,
    });
  }

  // Education validation
  if (['university', 'postgraduate'].includes(profile.education)) {
    tasks.push({
      id: 'edu-1', category: 'documents', priority: 'high',
      title: 'Iniciar validación de título (WES/ECA)',
      description: 'Busca World Education Services (WES) y comienza el proceso de equivalencia de tu título',
      duration: '45 min', points: 20, week: 1,
    });
    tasks.push({
      id: 'edu-2', category: 'documents', priority: 'high',
      title: 'Solicitar copias certificadas de tu diploma',
      description: 'Contacta tu universidad para obtener copias oficiales selladas de tu título y notas',
      duration: '30 min', points: 15, week: 2,
    });
  }

  // Express Entry / Profile creation
  if (profile.targetCountry === 'CA' || !profile.targetCountry) {
    tasks.push({
      id: 'profile-1', category: 'profile', priority: 'medium',
      title: 'Crear cuenta en IRCC (Canadá)',
      description: 'Registrarte en el portal de Inmigración de Canadá (IRCC GCKey)',
      duration: '30 min', points: 20, week: 2,
    });
  }

  // Passport
  tasks.push({
    id: 'doc-1', category: 'documents', priority: 'high',
    title: 'Verificar vigencia del pasaporte',
    description: 'Asegúrate de que tu pasaporte tenga mínimo 18 meses de vigencia. Si no, inicia renovación.',
    duration: '10 min', points: 10, week: 1,
  });

  // Work letters
  if ((profile.workYears || 0) >= 1) {
    tasks.push({
      id: 'work-1', category: 'documents', priority: 'high',
      title: 'Solicitar carta laboral',
      description: 'Pide a tus empleadores actuales/anteriores una carta con: cargo, fecha de inicio/fin, horas semanales y responsabilidades.',
      duration: '20 min', points: 15, week: 2,
    });
  }

  // Savings
  if (profile.savings === 'none' || profile.savings === 'low') {
    tasks.push({
      id: 'fin-1', category: 'financial', priority: 'medium',
      title: 'Crear plan de ahorro migratorio',
      description: 'Estima costos totales del proceso (exámenes, traducciones, vuelos, settlement funds) y crea un plan de ahorro mensual.',
      duration: '30 min', points: 15, week: 1,
    });
  }

  // Research
  tasks.push({
    id: 'research-1', category: 'research', priority: 'medium',
    title: 'Investigar mercado laboral del destino',
    description: `Busca ofertas de empleo en tu sector en ${profile.targetCountry ? DESTINATIONS.find(d => d.code === profile.targetCountry)?.country || 'tu destino' : 'Canadá/Australia'}. Usa LinkedIn, Indeed o Glassdoor.`,
    duration: '30 min', points: 10, week: 2,
  });

  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return tasks;
}
