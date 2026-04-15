import * as z from 'zod';
import FormStep1 from './FormStep1';
import FormStep2 from './FormStep2';
import FormStep3 from './FormStep3';
import FormStep4 from './FormStep4';
import FormStep5 from './FormStep5';
import FormStep6 from './FormStep6';
import FormStep7 from './FormStep7';
import FormStep8 from './FormStep8';
import FormStep9 from './FormStep9';

export const validationSchema = (t) => {
    const requiredMsg = t ? t('advanced_onboarding.validation.required') : 'Este campo es requerido';
    const numberMsg = t ? t('common:zod_number_invalid', 'Invalid number') : 'Debe ser un número válido';

    return z.object({
        // Step 1: Personal Data
        age: z.preprocess(
            (val) => (val === '' || val === null ? 0 : Number(val)),
            z.number({ invalid_type_error: numberMsg }).min(18, t ? t('advanced_onboarding.validation.number_min', {min: 18}) : 'Debe ser mayor de 18')
        ),
        nationality: z.string().min(1, requiredMsg),
        marital_status: z.string().min(1, requiredMsg),
        gender: z.string().optional(),
        salud: z.string().min(1, requiredMsg),

        // Step 2: Academic Formation
        education_level: z.string().min(1, requiredMsg),
        field_of_study: z.string().min(1, requiredMsg),
        is_title_validated: z.boolean().default(false),
        is_institution_recognized: z.boolean().default(false),

        // Step 3: Occupation and Work Experience
        occupation: z.string().min(1, requiredMsg),
        work_experience_years: z.preprocess(
            (val) => (val === '' || val === null ? 0 : Number(val)),
            z.number({ invalid_type_error: numberMsg }).min(0, "Cannot be negative")
        ),
        has_international_experience: z.boolean().default(false),
        is_remote_worker: z.boolean().default(false),
        nivel_tecnologico: z.string().min(1, requiredMsg),
        perfil_emprendedor: z.boolean().default(false),

        // Step 4: Languages and Certifications
        english_level: z.string().min(1, requiredMsg),
        has_language_certification: z.boolean().default(false),
        english_certification_score: z.string().optional(),
        languages: z.array(z.object({
            name: z.string().min(1, t ? t('advanced_onboarding.validation.lang_name_required') : 'El nombre del idioma es requerido'),
            level: z.string().min(1, t ? t('advanced_onboarding.validation.lang_level_required') : 'El nivel del idioma es requerido'),
        })).optional(),

        // Step 5: Economic Resources
        estimated_savings: z.string().min(1, requiredMsg),
        has_work_offer: z.boolean().default(false),
        has_support_network: z.boolean().default(false),
        pais_familia: z.string().optional(),

        // Step 6: Family Composition
        family_migration_plan: z.string().min(1, requiredMsg),
        children_count: z.preprocess(
            (val) => (val === '' || val === null ? 0 : Number(val)),
            z.number({ invalid_type_error: numberMsg }).min(0).optional()
        ),
        children_ages: z.string().optional(),
        partner_works: z.boolean().default(false),

        // Step 7: Migratory Objectives
        main_interest: z.string().min(1, requiredMsg),
        target_country: z.string().min(1, requiredMsg),
        willing_to_consider_other_countries: z.boolean().default(false),
        residency_type_interest: z.string().min(1, requiredMsg),
        disponibilidad_para_viajar: z.string().min(1, requiredMsg),

        // Step 8: Legal Status and Passport
        has_valid_passport: z.boolean().default(false),
        has_active_visa: z.boolean().default(false),
        has_legal_antecedents: z.boolean().default(false),

        // Step 9: Post-Migration and Settlement
        housing_plan: z.string().min(1, requiredMsg),
        transport_plan: z.boolean().default(false),
        preferred_zone: z.string().min(1, requiredMsg),
        interested_in_post_migration_services: z.boolean().default(false),
    });
};

export const formStepsConfig = [
    { 
      id: 1, 
      title: 'section1_title', 
      fields: ['age', 'nationality', 'marital_status', 'gender', 'salud'],
      component: FormStep1,
    },
    { 
      id: 2, 
      title: 'section2_title', 
      fields: ['education_level', 'field_of_study', 'is_title_validated', 'is_institution_recognized'],
      component: FormStep2,
    },
    { 
      id: 3, 
      title: 'section3_title', 
      fields: ['occupation', 'work_experience_years', 'has_international_experience', 'is_remote_worker', 'nivel_tecnologico', 'perfil_emprendedor'],
      component: FormStep3,
    },
    { 
      id: 4, 
      title: 'section4_title', 
      fields: ['english_level', 'has_language_certification', 'english_certification_score', 'languages'],
      component: FormStep4,
    },
    { 
      id: 5, 
      title: 'section5_title', 
      fields: ['estimated_savings', 'has_work_offer', 'has_support_network', 'pais_familia'],
      component: FormStep5,
    },
    { 
      id: 6, 
      title: 'section6_title', 
      fields: ['family_migration_plan', 'children_count', 'children_ages', 'partner_works'],
      component: FormStep6,
    },
    { 
      id: 7, 
      title: 'section7_title', 
      fields: ['main_interest', 'target_country', 'willing_to_consider_other_countries', 'residency_type_interest', 'disponibilidad_para_viajar'],
      component: FormStep7,
    },
    { 
      id: 8, 
      title: 'section8_title', 
      fields: ['has_valid_passport', 'has_active_visa', 'has_legal_antecedents'],
      component: FormStep8,
    },
    { 
      id: 9, 
      title: 'section9_title', 
      fields: ['housing_plan', 'transport_plan', 'preferred_zone', 'interested_in_post_migration_services'],
      component: FormStep9,
    },
];