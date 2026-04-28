import { describe, it, expect, beforeEach } from 'vitest';
import { saveQuizState, loadQuizState, clearQuizState } from '../lib/storage.js';

const mockStorage = (() => {
  let store = {};
  return {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { store = {}; },
  };
})();

beforeEach(() => {
  globalThis.sessionStorage = mockStorage;
  mockStorage.clear();
});

describe('storage', () => {
  it('sauvegarde et restaure un état', () => {
    saveQuizState({ moment: 'matin' });
    expect(loadQuizState()).toEqual({ moment: 'matin' });
  });

  it('retourne null si rien n\'est stocké', () => {
    expect(loadQuizState()).toBeNull();
  });

  it('efface l\'état', () => {
    saveQuizState({ moment: 'matin' });
    clearQuizState();
    expect(loadQuizState()).toBeNull();
  });

  it('retourne null si JSON corrompu', () => {
    sessionStorage.setItem('torrea_tailor_quiz', '{invalid');
    expect(loadQuizState()).toBeNull();
  });
});
