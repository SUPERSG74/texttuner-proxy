// api/index.js
export default async function handler(req, res) {
  // --- CORS: welche Webseiten dürfen mit uns reden? ---
  const allowed = new Set([
    'https://www.texttuner.app',
    'https://texttuner.app',
  ]);
  const origin = req.headers.origin;

  if (allowed.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');

  // Browser fragt manchmal vorher „darf ich?“ -> Ja.
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Nur POST ist erlaubt
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST erlaubt' });
  }

  try {
    // was von deiner Website kommt
    const body = req.body ?? {};

    // <<< deine echte Make-Webhook-URL (so lassen, wenn korrekt) >>>
    const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/5vrvdectpu55v7bdvc47rzlivgjufl1';

    // an Make weiterleiten
    const makeResp = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    // Antwort von Make 1:1 zurückgeben
    const text = await makeResp.text();

    // CORS-Header auch auf die Antwort setzen
    if (allowed.has(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    return res.status(200).send(text);
  } catch (err) {
    console.error('Proxy-Fehler:', err);
    return res.status(500).json({ error: 'Interner Serverfehler' });
  }
}
