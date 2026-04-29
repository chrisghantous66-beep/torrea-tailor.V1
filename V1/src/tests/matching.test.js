import { describe, it, expect } from 'vitest';
import archetypes from '../data/archetypes.json';
import coffees from '../data/coffees.json';
import { scoreArchetype, selectArchetype, computeAlternatives } from '../lib/matching.js';

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
    // base 10 + chocolat (note overlap, choc bucket) +1 + faible+choc +1 + amateur+gourmand-chocolate +1 = 13
    expect(scoreArchetype(aventurier, quiz)).toBe(13);
  });
});

describe('selectArchetype', () => {
  it('retourne l\'archétype au meilleur score', () => {
    const quiz = {
      moment: 'matin',
      profil_gustatif: 'gourmand-chocolate',
      intensity: 'corse',
      roast_level: 'dark',
    };
    const result = selectArchetype(archetypes, quiz);
    expect(result.id).toBe('aventurier_chocolate');
  });

  it('fallback sur "decouverte" si aucun score >= seuil', () => {
    const quiz = {
      moment: 'jamais',
      profil_gustatif: 'inexistant',
      intensity: 'inconnu',
      roast_level: 'inconnu',
    };
    const result = selectArchetype(archetypes, quiz);
    expect(result.id).toBe('decouverte');
  });

  it('départage par les 4 axes obligatoires en cas d\'égalité', () => {
    const quiz = {
      moment: 'soir',
      profil_gustatif: 'gourmand-chocolate',
      intensity: 'doux',
      roast_level: 'medium',
    };
    const result = selectArchetype(archetypes, quiz);
    expect(result.id).toBe('soir_chocolate_doux');
  });
});

describe('computeAlternatives', () => {
  it('retourne 2 cafés ranking-déterminé', () => {
    const quiz = {
      brewing_method: 'espresso',
      profil_gustatif: 'gourmand-chocolate',
      intensity: 'corse',
    };
    const blendComposition = [{ coffee_id: 'capucas', percentage: 60 }];
    const alts = computeAlternatives(coffees, quiz, blendComposition);
    expect(alts).toHaveLength(2);
    expect(alts[0].coffee.id).not.toBe('capucas');
  });

  it('exclut un café déjà majoritaire dans le blend', () => {
    const quiz = {
      brewing_method: 'espresso',
      profil_gustatif: 'gourmand-chocolate',
      intensity: 'corse',
    };
    const blendComposition = [{ coffee_id: 'capucas', percentage: 60 }];
    const alts = computeAlternatives(coffees, quiz, blendComposition);
    expect(alts.every(a => a.coffee.id !== 'capucas')).toBe(true);
  });
});
