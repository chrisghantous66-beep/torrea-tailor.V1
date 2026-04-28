const KEY = 'torrea_tailor_quiz';

export function saveQuizState(state) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // sessionStorage indisponible ou plein → silencieux, pas critique
  }
}

export function loadQuizState() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearQuizState() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // silencieux
  }
}
