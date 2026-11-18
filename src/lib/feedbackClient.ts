import { FeedbackItem, Level, Trial, Hypothesis } from '../types';
import { detectMisconceptionsFromText } from './misconceptions';

interface RequestFeedbackParams {
  teamId: string;
  taskId: string;
  question: string;
  answer: string;
  level: Level;
  trials: Trial[];
  hypothesis?: Hypothesis | null;
}

export async function requestFeedback({
  teamId,
  taskId,
  question,
  answer,
  level,
  trials,
  hypothesis,
}: RequestFeedbackParams): Promise<FeedbackItem> {
  const itemId = `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6-second timeout

    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level,
        question,
        answer,
        trials: trials.map((t) => ({
          n: t.n,
          setup: t.setup,
          bubbles: t.bubbles,
          fair: t.fair,
        })),
        hypothesis: hypothesis ? { variable: hypothesis.variable, direction: hypothesis.direction } : null,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.feedback && data.misconception) {
        return {
          id: itemId,
          teamId,
          taskId,
          question,
          answer,
          aiFeedback: data.feedback,
          misconception: data.misconception,
          nextHint: data.nextHint || 'Try comparing your trials in the lab.',
          source: 'ai',
          status: 'pending',
          createdAt: Date.now(),
        };
      }
    }
    // If not ok or missing keys, fall through to offline fallback
  } catch (err) {
    console.warn('AI feedback API call unsuccessful or timed out. Falling back to rule-based engine:', err);
  }

  // Guaranteed Offline Fallback Engine
  const fallback = detectMisconceptionsFromText(answer);

  return {
    id: itemId,
    teamId,
    taskId,
    question,
    answer,
    aiFeedback: fallback.feedback,
    misconception: fallback.misconception,
    nextHint: fallback.nextHint,
    source: 'offline',
    status: 'pending',
    createdAt: Date.now(),
  };
}
