import type { VercelRequest, VercelResponse } from '@vercel/node';
import { SYSTEM_PROMPT } from '../src/lib/prompts';

interface RequestBody {
  level?: string;
  question?: string;
  answer?: string;
  trials?: Array<{ n: number; setup: { light: number; temp: number; co2: number }; bubbles: number; fair: boolean }>;
  hypothesis?: { variable: string; direction: string } | null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, reason: 'Method Not Allowed. Use POST.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      ok: false,
      reason: 'GEMINI_API_KEY is not configured in server environment.',
    });
  }

  const { level = 'sapling', question, answer, trials = [], hypothesis } = (req.body || {}) as RequestBody;

  if (!answer || !answer.trim()) {
    return res.status(400).json({ ok: false, reason: 'Child answer is required.' });
  }

  // Build compact trials description
  const compactTrials = trials
    .map((t) => `T${t.n}: light=${t.setup.light}%, temp=${t.setup.temp}°C, co2=${t.setup.co2}sp -> ${t.bubbles} bubbles (${t.fair ? 'fair' : 'unfair'})`)
    .join('; ');

  const userMessage = `Level: ${level}
Question asked: ${question || 'Why did bubbles drop at 45°C?'}
Child's guess (hypothesis): ${hypothesis ? `when ${hypothesis.variable} increases, bubbles ${hypothesis.direction}` : 'none'}
Child's answer: "${answer.trim()}"
Trials recorded by child: [${compactTrials || 'none yet'}]

Evaluate and respond ONLY as JSON: {"feedback": string, "misconception": "M1"|"M2"|"none", "nextHint": string}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000); // 6-second timeout

    const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: [
          {
            parts: [{ text: userMessage }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3,
          maxOutputTokens: 200,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({
        ok: false,
        reason: `Gemini API returned error HTTP ${response.status}: ${errText.substring(0, 100)}`,
      });
    }

    const jsonResponse = await response.json();
    const rawContent =
      jsonResponse?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawContent) {
      return res.status(502).json({ ok: false, reason: 'Empty response text from Gemini API.' });
    }

    // 1. Validate that the JSON parses
    let parsed: any;
    try {
      parsed = JSON.parse(rawContent);
    } catch (parseErr) {
      return res.status(502).json({ ok: false, reason: 'Failed to parse JSON response from Gemini.' });
    }

    // 2. Validate all 3 keys are present
    if (
      typeof parsed.feedback !== 'string' ||
      typeof parsed.misconception !== 'string' ||
      typeof parsed.nextHint !== 'string'
    ) {
      return res.status(502).json({
        ok: false,
        reason: 'Missing one or more required keys (feedback, misconception, nextHint).',
      });
    }

    // 3. Validate feedback is <= 40 words
    const wordCount = parsed.feedback.trim().split(/\s+/).length;
    if (wordCount > 40) {
      return res.status(502).json({
        ok: false,
        reason: `AI feedback exceeded 40 words limit (${wordCount} words).`,
      });
    }

    // 4. Validate misconception is in allowed set
    const allowedMisconceptions = ['M1', 'M2', 'none'];
    if (!allowedMisconceptions.includes(parsed.misconception)) {
      return res.status(502).json({
        ok: false,
        reason: `Invalid misconception value: ${parsed.misconception}`,
      });
    }

    // 5. Validate the feedback does NOT contain give-away phrases
    const lowerFeedback = parsed.feedback.toLowerCase();
    const giveAwayPhrases = ['because it is too hot', 'the answer is'];
    for (const phrase of giveAwayPhrases) {
      if (lowerFeedback.includes(phrase)) {
        return res.status(502).json({
          ok: false,
          reason: `Give-away phrase detected in AI feedback: "${phrase}"`,
        });
      }
    }

    // Success response
    return res.status(200).json({
      ok: true,
      feedback: parsed.feedback.trim(),
      misconception: parsed.misconception,
      nextHint: parsed.nextHint.trim(),
    });
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      return res.status(504).json({ ok: false, reason: 'Gemini request timed out after 6 seconds.' });
    }
    return res.status(500).json({
      ok: false,
      reason: error?.message || 'Unexpected internal server error in feedback API.',
    });
  }
}
