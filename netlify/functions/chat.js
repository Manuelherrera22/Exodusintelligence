export const handler = async (event, context) => {
  // Solo permitir POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'OPENAI_API_KEY no detectada en Netlify.' })
    };
  }

  try {
    const { messages, tools, temperature = 0.7, max_tokens = 500 } = JSON.parse(event.body);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        tools,
        temperature,
        max_tokens
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI Error:', response.status, errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errorText })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Serverless Function Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error procesando la solicitud a OpenAI' })
    };
  }
};
