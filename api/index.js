// api/index.js
export default async function handler(req, res) {
  // --- CORS: erlaubte Webseiten (OHNE Slash am Ende!) ---
  const allowed = new Set([
    'https://www.texttuner.app',
    'https://texttuner.app',
    'https://texttuner-app.vercel.app'   // <-- als String + ohne /
  ]);

  const origin = req.headers.origin;

  if (allowed.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST erlaubt' });
  }

  try {
    const body = req.body ?? {};
    const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/5vrvdectpu55v7bdvc47rzlivgjufl1';

    const makeResp = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await makeResp.text();

    if (allowed.has(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    return res.status(200).send(text);
  } catch (err) {
    console.error('Proxy-Fehler:', err);
    return res.status(500).json({ error: 'Interner Serverfehler' });
  }
}
