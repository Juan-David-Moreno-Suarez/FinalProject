declare const require: any;
const MENU: any = require('../app/data/menu.json');

export type Turn = { role: 'user' | 'model'; text: string };
export type AskResult = { reply: string };
const MODEL = 'gemini-2.5-flash';
 
const systemPrompt = `
Eres Waitia, mesera IA de Yummi. Responde breve, amable y en español.
Usa SOLO este menú para recomendar (no inventes). Devuelve 2–3 opciones como máximo con:
• nombre • kcal • precio.
Si preguntan por alergias o preferencias, filtra usando el menú.
MENÚ:
${JSON.stringify(MENU)}
`.trim();
 
function buildContents(content: string, history: Turn[]) {
  return [
    { role: 'user', parts: [{ text: systemPrompt }] },
    ...history.map(h => ({ role: h.role, parts: [{ text: h.text }] })),
    { role: 'user', parts: [{ text: content }] },
  ];
}
 
function takeText(json: any): string | null {
  try {
    const cand = json?.candidates?.[0];
    const parts = cand?.content?.parts;
    const txt = parts?.map((p: any) => p?.text).filter(Boolean).join('\n').trim();
    return txt || null;
  } catch {
    return null;
  }
}
 

export async function askWaitia(content: string, history: Turn[] = []): Promise<AskResult> {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
  const key = process.env.EXPO_PUBLIC_GEMINI_API_KEY
 
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'x-goog-api-key': key ?? '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: buildContents(content, history),
      generationConfig: { temperature: 0.5 },
    }),
  });
 
  if (!resp.ok) {
  let errBody: any = null;
  try {
    errBody = await resp.json();
  } catch {
    errBody = await resp.text();
  }
  console.error('Gemini error:', errBody);
  throw new Error(`HTTP ${resp.status} @ ${MODEL}`);
}
 
  const json = await resp.json();
  const text = takeText(json) ?? 'No tengo respuesta en este momento.';
  return { reply: text };
}