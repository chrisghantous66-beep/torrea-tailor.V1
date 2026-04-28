import { describe, it, expect } from 'vitest';
import archetypes from '../data/archetypes.json';
import { scoreArchetype } from '../lib/matching.js';

const aventurier = archetypes.find(a => a.id === 'aventurier_chocolate');

describe('scoreArchetype', () => {
  it('score plein sur match parfait des 4 axes obligatoires', () => {
    const quiz = {
      moment: 'matin',
      profil_gustatif: 'gourmand-chocolate',
      intensity: 'corse',
      roast_level: 'dark',
    };
    expect(scoreArchetype(aventurier, quiz)).toBe(10); // 3+3+2+2
  });

  it('score 0 si aucun axe ne matche', () => {
    const quiz = {
      moment: 'soir',
      profil_gustatif: 'complexe-floral',
      intensity: 'doux',
      roast_level: 'light',
    };
    expect(scoreArchetype(aventurier, quiz)).toBe(0);
  });

  it('ajoute des bonus pour les questions optionnelles', () => {
    const quiz = {
      moment: 'matin',
      profil_gustatif: 'gourmand-chocolate',
      intensity: 'corse',
      roast_level: 'dark',
      notes_specifiques: ['chocolat'],
      acidite_toleree: 'faible',
      experience_level: 'amateur',
    };
    expect(scoreArchetype(aventurier, quiz)).toBeGreaterThan(10);
  });
});
