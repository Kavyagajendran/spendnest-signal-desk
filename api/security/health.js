import { PROMPT_GUARD_MODEL } from '../../src/services/promptGuardCore.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  res.status(200).json({
    status: 'online',
    model: PROMPT_GUARD_MODEL,
    isKeyConfigured: Boolean(apiKey && apiKey.trim().length > 0),
  });
}
