import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST erlaubt' });
  }

  const { text } = req.body;

  try {
    const response = await fetch('https://hook.eu2.make.com/DEINWEBHOOK', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    const result = await response.text();
    res.status(200).send(result);
  } catch (error) {
    console.error('Fehler beim Weiterleiten:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
}
