import { useMemo } from 'react';
import ArchetypeCard from './ArchetypeCard.jsx';
import BlendComposition from './BlendComposition.jsx';
import Alternatives from './Alternatives.jsx';
import coffees from '../../data/coffees.json';
import archetypes from '../../data/archetypes.json';
import { match } from '../../lib/matching.js';

export default function Result({ quiz, onRestart }) {
  const result = useMemo(() => match(quiz, { coffees, archetypes }), [quiz]);

  return (
    <div className="result">
      <ArchetypeCard archetype={result.archetype} />
      <BlendComposition blend={result.blend} />
      <Alternatives alternatives={result.alternatives} />
      <div className="result__footer">
        <button type="button" className="cta cta--secondary" onClick={onRestart}>
          Recommencer
        </button>
      </div>
    </div>
  );
}
