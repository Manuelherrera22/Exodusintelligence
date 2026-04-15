// ═══════════════════════════════════════════════════════════════════════════════
// EXODUS API PROXY — Keeps OpenAI key server-side
// ═══════════════════════════════════════════════════════════════════════════════
import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually (no dotenv needed for 1 var)
let OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  try {
    const envFile = readFileSync(resolve(__dirname, '.env'), 'utf-8');
    const match = envFile.match(/^OPENAI_API_KEY=(.+)$/m);
    if (match) OPENAI_API_KEY = match[1].trim();
  } catch (e) {}
}

if (!OPENAI_API_KEY) {
  console.error('⚠ OPENAI_API_KEY not found in .env');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // support base64 images

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, tools, temperature = 0.7, max_tokens = 500 } = req.body;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + OPENAI_API_KEY,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        tools,
        temperature,
        max_tokens,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('OpenAI Error:', response.status, err);
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Proxy Error:', err.message);
    res.status(500).json({ error: 'Internal proxy error' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Exodus API Proxy running on http://localhost:${PORT}`);
});
