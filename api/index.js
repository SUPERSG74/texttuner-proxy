// api/index.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST erlaubt' });
  }

  try {
    const body = req.body ?? {};
    const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/DEINE_WEBHOOK_ID"; // <- exakt in Anführungszeichen

    const makeResp = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await makeResp.text();
    return res.status(200).send(text);
  } catch (err) {
    console.error('Proxy-Fehler:', err);
    return res.status(500).json({ error: 'Interner Serverfehler' });
  }
}
