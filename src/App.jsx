import { useState, useEffect } from 'react';
import Welcome from './components/Welcome.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import BubbleQuestion from './components/BubbleQuestion.jsx';
import DeepenPrompt from './components/DeepenPrompt.jsx';
import Result from './components/Result/Result.jsx';
import OrderRecap from './components/Result/OrderRecap.jsx';
import EmailRecap from './components/Result/EmailRecap.jsx';
import { saveQuizState, loadQuizState, clearQuizState } from './lib/storage.js';

const STEPS = ['welcome', 'q0', 'q1', 'q2', 'q3', 'q4', 'q5', 'deepen', 'q6', 'q7', 'q8', 'q9', 'result', 'order', 'email'];
const TOTAL_MANDATORY = 6;

const QUESTIONS = {
  q0: {
    key: 'brewing_method',
    question: 'Comment prépares-tu ton café ?',
    next: 'q1',
    options: [
      { id: 'espresso', label: 'Espresso' },
      { id: 'filtre', label: 'V60 / Filtre' },
      { id: 'moka', label: 'Cafetière italienne' },
      { id: 'aeropress', label: 'Aeropress' },
      { id: 'piston', label: 'Piston (French Press)' },
    ],
  },
  q1: {
    key: 'moment',
    question: 'Quand vas-tu le boire ?',
    next: 'q2',
    options: [
      { id: 'matin', label: 'Matin énergie' },
      { id: 'apres-midi', label: 'Après-midi pause' },
      { id: 'soir', label: 'Soir détente' },
      { id: 'focus', label: 'Concentration / focus' },
    ],
  },
  q2: {
    key: 'profil_gustatif',
    question: 'Profil gustatif global ?',
    next: 'q3',
    options: [
      { id: 'gourmand-chocolate', label: 'Gourmand & chocolaté' },
      { id: 'vif-fruite', label: 'Vif & fruité' },
      { id: 'complexe-floral', label: 'Complexe & floral' },
    ],
  },
  q3: {
    key: 'intensity',
    question: 'Intensité ?',
    next: 'q4',
    options: [
      { id: 'doux', label: 'Doux' },
      { id: 'equilibre', label: 'Équilibré' },
      { id: 'corse', label: 'Corsé' },
    ],
    recommendations: {
      basedOn: 'brewing_method',
      map: {
        espresso: ['equilibre', 'corse'],
        filtre: ['doux', 'equilibre'],
        moka: ['equilibre', 'corse'],
        aeropress: ['doux', 'equilibre'],
        piston: ['doux', 'equilibre', 'corse'],
      },
    },
  },
  q4: {
    key: 'roast_level',
    question: 'Niveau de torréfaction ?',
    next: 'q5',
    options: [
      { id: 'light', label: 'Light — Vif, fruité, floral' },
      { id: 'medium', label: 'Medium — Équilibré, polyvalent' },
      { id: 'dark', label: 'Dark — Corsé, chocolaté' },
    ],
    recommendations: {
      basedOn: 'brewing_method',
      map: {
        espresso: ['medium', 'dark'],
        filtre: ['light', 'medium'],
        moka: ['medium', 'dark'],
        aeropress: ['light', 'medium'],
        piston: ['light', 'medium', 'dark'],
      },
    },
  },
  q5: {
    key: 'grind_type',
    question: 'Café en grain ou café moulu ?',
    next: 'deepen',
    options: [
      { id: 'grain', label: 'En grain' },
      { id: 'moulu', label: 'Moulu' },
    ],
  },
  q6: {
    key: 'notes_specifiques',
    question: 'Des notes que tu adores ? (optionnel, plusieurs choix)',
    next: 'q7',
    multi: true,
    options: [
      { id: 'chocolat', label: 'Chocolat' },
      { id: 'caramel', label: 'Caramel' },
      { id: 'agrumes', label: 'Agrumes' },
      { id: 'fruits secs', label: 'Fruits secs' },
      { id: 'floral', label: 'Floral' },
      { id: 'pêche', label: 'Pêche' },
    ],
  },
  q7: {
    key: 'experience_level',
    question: 'Ton niveau avec le café ?',
    next: 'q8',
    options: [
      { id: 'debutant', label: 'Débutant' },
      { id: 'amateur', label: 'Amateur' },
      { id: 'connaisseur', label: 'Connaisseur' },
    ],
  },
  q8: {
    key: 'acidite_toleree',
    question: 'Tu aimes l\'acidité ?',
    next: 'q9',
    options: [
      { id: 'faible', label: 'Pas trop' },
      { id: 'moyenne', label: 'Modérée' },
      { id: 'haute', label: 'Beaucoup' },
    ],
  },
  q9: {
    key: 'consommation',
    question: 'Combien de cafés par jour ?',
    next: 'result',
    options: [
      { id: '1-2', label: '1-2' },
      { id: '3-4', label: '3-4' },
      { id: '5+', label: '5 et plus' },
    ],
  },
};

function encodeQuiz(quiz) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(quiz))));
}
function decodeQuiz(encoded) {
  try { return JSON.parse(decodeURIComponent(escape(atob(encoded)))); }
  catch { return null; }
}

export default function App() {
  const [step, setStep] = useState('welcome');
  const [quiz, setQuiz] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('result');
    if (shared) {
      const q = decodeQuiz(shared);
      if (q) {
        setQuiz(q);
        setStep('result');
        return;
      }
    }
    const saved = loadQuizState();
    if (saved?.step && saved?.quiz) {
      setStep(saved.step);
      setQuiz(saved.quiz);
    }
  }, []);

  useEffect(() => {
    if (step !== 'welcome') saveQuizState({ step, quiz });
  }, [step, quiz]);

  const update = (key, value, nextStep) => {
    setQuiz(q => ({ ...q, [key]: value }));
    setStep(nextStep);
  };

  const restart = () => {
    clearQuizState();
    setQuiz({});
    setStep('welcome');
  };

  const stepIndex = STEPS.indexOf(step);
  const showProgress = stepIndex >= 1 && stepIndex <= 6;
  const canGoBack = stepIndex > 1 && step !== 'result' && step !== 'order' && step !== 'email';

  const goBack = () => {
    if (stepIndex > 1) {
      const prev = STEPS[stepIndex - 1];
      // Skip "deepen" en arrière (il n'a pas d'état à restaurer)
      setStep(prev === 'deepen' ? 'q5' : prev);
    }
  };

  const shareUrl = () => `${window.location.origin}${window.location.pathname}?result=${encodeQuiz(quiz)}`;

  const handleShare = async () => {
    const url = shareUrl();
    try {
      if (navigator.share) {
        await navigator.share({ url, title: 'Mon profil café Torrea' });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert('Lien copié dans le presse-papier !');
      }
    } catch {
      // utilisateur a annulé le partage natif — silencieux
    }
  };

  const computeRecommendedIds = (q, quiz) => {
    if (!q.recommendations) return [];
    const dependsOnValue = quiz[q.recommendations.basedOn];
    if (!dependsOnValue) return [];
    return q.recommendations.map[dependsOnValue] || [];
  };

  return (
    <main>
      {canGoBack && (
        <button
          type="button"
          className="back-btn"
          onClick={goBack}
          aria-label="Revenir à la question précédente"
        >
          ← Retour
        </button>
      )}

      {showProgress && (
        <ProgressBar current={stepIndex} total={TOTAL_MANDATORY} />
      )}

      {step === 'welcome' && <Welcome onStart={() => setStep('q0')} />}

      {['q0','q1','q2','q3','q4','q5','q6','q7','q8','q9'].includes(step) && (() => {
        const q = QUESTIONS[step];
        const recommendedIds = computeRecommendedIds(q, quiz);
        return (
          <BubbleQuestion
            question={q.question}
            options={q.options}
            value={quiz[q.key]}
            recommendedIds={recommendedIds}
            onChange={(val) => {
              if (q.multi) {
                setQuiz(prev => ({ ...prev, [q.key]: val }));
              } else {
                update(q.key, val, q.next);
              }
            }}
            multi={q.multi}
          />
        );
      })()}

      {step === 'q6' && quiz.notes_specifiques && quiz.notes_specifiques.length > 0 && (
        <div style={{textAlign:'center', marginTop:'1rem'}}>
          <button className="cta" onClick={() => setStep(QUESTIONS.q6.next)}>Suivant</button>
        </div>
      )}

      {step === 'deepen' && (
        <DeepenPrompt
          onShow={() => setStep('result')}
          onDeepen={() => setStep('q6')}
        />
      )}

      {step === 'result' && (
        <Result
          quiz={quiz}
          onRestart={restart}
          onShare={handleShare}
          onOrder={() => setStep('order')}
        />
      )}

      {step === 'order' && (
        <OrderRecap
          quiz={quiz}
          onBack={() => setStep('result')}
          onEmail={() => setStep('email')}
        />
      )}

      {step === 'email' && (
        <EmailRecap quiz={quiz} onBack={() => setStep('order')} />
      )}
    </main>
  );
}
