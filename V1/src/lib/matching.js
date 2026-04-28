export function scoreArchetype(archetype, quiz) {
  let score = 0;
  const tags = archetype.match_tags;

  // Axes obligatoires
  if (tags.moment.includes(quiz.moment)) score += 3;
  if (tags.profil.includes(quiz.profil_gustatif)) score += 3;
  if (tags.intensity.includes(quiz.intensity)) score += 2;
  if (tags.roast?.includes(quiz.roast_level)) score += 2;

  // Bonus optionnels (si réponses présentes ET tags définis sur archétype)
  if (quiz.notes_specifiques?.length && hasNoteOverlap(archetype, quiz.notes_specifiques)) {
    score += 1;
  }
  if (quiz.acidite_toleree && matchesAcidity(archetype, quiz.acidite_toleree)) {
    score += 1;
  }
  if (quiz.experience_level && matchesExperience(archetype, quiz.experience_level)) {
    score += 1;
  }

  return score;
}

function hasNoteOverlap(archetype, userNotes) {
  const profil = archetype.match_tags.profil[0] || '';
  const choc = ['chocolat', 'caramel', 'noisette'];
  const fruit = ['agrumes', 'fruits secs', 'pêche', 'citron', 'fruits rouges'];
  const floral = ['floral', 'fleur'];

  if (profil.includes('chocolate') && userNotes.some(n => choc.includes(n))) return true;
  if (profil.includes('fruite') && userNotes.some(n => fruit.includes(n))) return true;
  if (profil.includes('floral') && userNotes.some(n => floral.includes(n))) return true;
  return false;
}

function matchesAcidity(archetype, acidite) {
  const profil = archetype.match_tags.profil[0] || '';
  if (acidite === 'faible' && profil.includes('chocolate')) return true;
  if (acidite === 'moyenne') return true;
  if (acidite === 'haute' && (profil.includes('fruite') || profil.includes('floral'))) return true;
  return false;
}

function matchesExperience(archetype, level) {
  if (level === 'debutant' && archetype.id === 'decouverte') return true;
  if (level === 'connaisseur' && archetype.match_tags.profil.includes('complexe-floral')) return true;
  if (level === 'amateur') return true;
  return false;
}
