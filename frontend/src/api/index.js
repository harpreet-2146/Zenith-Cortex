export const API_BASE = 'http://localhost:5000';

export async function evaluateResume(resumeText) {
  const res = await fetch(`${API_BASE}/api/ats/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeText })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to evaluate resume');
  }
  return res.json();
}

