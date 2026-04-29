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
  const profils = archetype.match_tags.profil;
  const choc = ['chocolat', 'caramel', 'noisette'];
  const fruit = ['agrumes', 'fruits secs', 'pêche', 'citron', 'fruits rouges'];
  const floral = ['floral', 'fleur'];

  const isChoc = profils.some(p => p.includes('chocolate'));
  const isFruite = profils.some(p => p.includes('fruite'));
  const isFloral = profils.some(p => p.includes('floral'));

  if (isChoc && userNotes.some(n => choc.includes(n))) return true;
  if (isFruite && userNotes.some(n => fruit.includes(n))) return true;
  if (isFloral && userNotes.some(n => floral.includes(n))) return true;
  return false;
}

function matchesAcidity(archetype, acidite) {
  const profils = archetype.match_tags.profil;
  const isChoc = profils.some(p => p.includes('chocolate'));
  const isFruite = profils.some(p => p.includes('fruite'));
  const isFloral = profils.some(p => p.includes('floral'));

  if (acidite === 'faible' && isChoc) return true;
  if (acidite === 'moyenne' && (isChoc || isFruite)) return true;
  if (acidite === 'haute' && (isFruite || isFloral)) return true;
  return false;
}

function matchesExperience(archetype, level) {
  const profils = archetype.match_tags.profil;
  if (level === 'connaisseur' && profils.includes('complexe-floral')) return true;
  if (level === 'amateur' && (profils.includes('gourmand-chocolate') || profils.includes('vif-fruite'))) return true;
  return false;
}
