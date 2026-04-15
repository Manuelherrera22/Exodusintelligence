// src/lib/kaiAgent.js — Calls local proxy (API key stays server-side)

const SYSTEM_PROMPT = [
  'Eres KAI, el Coach Migratorio más avanzado del mundo. No eres un chatbot genérico. Eres un SISTEMA EXPERTO de gestión migratoria creado por Exodus Intelligence.',
  '',
  '== TU PERSONALIDAD ==',
  'Eres cálido como un amigo que ya migró exitosamente, pero preciso como un abogado migratorio certificado.',
  'Siempre que el usuario comparta información, REACCIONA con empatía genuina y vincula sus datos con oportunidades reales.',
  'Ejemplo: "Ingeniería de software y 28 años... eso te pone en el TOP 5% de perfiles para Express Entry."',
  '',
  '== TU MISIÓN ==',
  'Hacer un perfilamiento natural del usuario a través de conversación. Necesitas obtener:',
  "1. country: País de origen (nombre o código ISO)",
  "2. age: Edad",
  "3. education: Nivel de estudios (primary, high_school, technical, university, postgraduate)",
  "4. field: Área (stem, health, business, arts, trades, other)",
  "5. englishLevel: Nivel de inglés (none, a1, a2, b1, b2, c1, c2, native)",
  "6. workYears: Años de experiencia laboral",
  "7. targetCountry: País destino deseado o null para recomendación",
  "8. challenges: Dificultades (language, money, documents, family, experience, uncertainty)",
  '',
  '== REGLAS CRÍTICAS ==',
  '1. MÁXIMO 2 preguntas por mensaje. Reacciona SIEMPRE al dato anterior con insight experto.',
  '2. Usa la tool update_profile CADA VEZ que detectes un dato del esquema.',
  '3. Cuando tengas mínimo: país, edad, educación, inglés, área y experiencia, PREGÚNTALE al usuario si desea ver su reporte migratorio interactivo (con su score, destinos ideales y plan de acción). SOLO cuando el usuario acepte explícitamente, llama a complete_profiling.',
  '4. Respond in the user\'s language. If language is "en", speak English. If "es", speak Spanish. Be premium and motivating. Avoid repetitive greetings.',
  '5. Si el usuario tiene perfil académico, MENCIONA becas y universidades específicas.',
  '6. Si el usuario sube un documento o imagen, analízalo y extrae información relevante.',
  '',
  '== CONOCIMIENTO ESPECIALIZADO ==',
  '- Express Entry (Canadá): CRS, FSW, CEC, FST, PNP',
  '- Points Test (Australia): Skilled 189/190/491',
  '- EU Blue Card, Chancenkarte (Alemania)',
  '- Visa Nómada Digital (España/Portugal)',
  '- H-1B, EB-2 NIW, O-1 (USA)',
  '- Becas: Chevening, DAAD, Erasmus Mundus, Fulbright, Vanier/Trudeau',
  '- Universidades top para latinos: U of Toronto, UBC, Melbourne, TU Munich, KTH Stockholm',
  '',
  '== FORMATO ==',
  'Usa **negritas** para datos clave. Máximo 1-2 emojis por mensaje.',
  'Mensajes concisos (máximo 3-4 líneas). No des monólogos.',
].join('\n');

export { SYSTEM_PROMPT };

export const TOOLS = [
  {
    type: "function",
    function: {
      name: "update_profile",
      description: "Actualiza el perfil migratorio del usuario con datos extraídos de la conversación.",
      parameters: {
        type: "object",
        properties: {
          country: { type: "string", description: "Código ISO o nombre del país de origen" },
          age: { type: "number", description: "Edad del usuario" },
          education: { type: "string", enum: ["primary", "high_school", "technical", "university", "postgraduate"] },
          field: { type: "string", enum: ["stem", "health", "business", "arts", "trades", "other"] },
          englishLevel: { type: "string", enum: ["none", "a1", "a2", "b1", "b2", "c1", "c2", "native"] },
          workYears: { type: "number", description: "Años de experiencia laboral" },
          targetCountry: { type: "string", description: "Código ISO del país destino o null" },
          challenges: { type: "array", items: { type: "string", enum: ["language", "money", "documents", "family", "experience", "uncertainty"] } }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "complete_profiling",
      description: "Finaliza la recolección cuando tienes: país, edad, educación, inglés, área y experiencia.",
      parameters: {
        type: "object",
        properties: { ready: { type: "boolean" } },
        required: ["ready"]
      }
    }
  }
];

export async function chatWithKAI(messages, imageBase64 = null, lang = 'es') {
  // Build language instruction
  const langInstruction = lang?.startsWith('en')
    ? '\n\n== LANGUAGE ==\nThe user speaks ENGLISH. You MUST respond ONLY in English. Do NOT use Spanish.'
    : '\n\n== IDIOMA ==\nEl usuario habla ESPAÑOL. Responde SIEMPRE en español.';

  // Build messages with system prompt
  const formattedMessages = [
    { role: "system", content: SYSTEM_PROMPT + langInstruction },
    ...messages
  ];

  // If there's an image, modify the last user message to be multimodal
  if (imageBase64 && formattedMessages.length > 0) {
    const lastMsg = formattedMessages[formattedMessages.length - 1];
    if (lastMsg.role === 'user') {
      formattedMessages[formattedMessages.length - 1] = {
        role: 'user',
        content: [
          { type: 'text', text: lastMsg.content || 'Analiza este documento/imagen.' },
          { type: 'image_url', image_url: { url: imageBase64 } }
        ]
      };
    }
  }

  // Call our LOCAL proxy — API key never touches the browser
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: formattedMessages,
      tools: TOOLS,
      temperature: 0.7,
      max_tokens: 500,
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('API Error:', response.status, errText);
    throw new Error('Error conectando con KAI: ' + response.status);
  }

  return await response.json();
}
