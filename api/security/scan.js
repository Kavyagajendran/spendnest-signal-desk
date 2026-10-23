import { scanTranscript, PROMPT_GUARD_MODEL } from '../../src/services/promptGuardCore.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { text } = req.body || {};
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      res.status(503).json({
        status: 'Scan unavailable',
        error: 'GROQ_API_KEY environment variable is not configured on Vercel deployment settings.',
      });
      return;
    }

    const result = await scanTranscript({
      text,
      apiKey,
      model: PROMPT_GUARD_MODEL,
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      status: 'Scan unavailable',
      error: err.message,
    });
  }
}
