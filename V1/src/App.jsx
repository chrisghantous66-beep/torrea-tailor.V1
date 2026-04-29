import { useState, useEffect } from 'react';
import Welcome from './components/Welcome.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import BubbleQuestion from './components/BubbleQuestion.jsx';
import DeepenPrompt from './components/DeepenPrompt.jsx';
import Result from './components/Result/Result.jsx';
import { saveQuizState, loadQuizState, clearQuizState } from './lib/storage.js';

const STEPS = ['welcome', 'q0', 'q1', 'q2', 'q3', 'q4', 'deepen', 'q5', 'q6', 'q7', 'q8', 'result'];
const TOTAL_MANDATORY = 5;

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
      { id: 'piston', label: 'Piston' },
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
  },
  q4: {
    key: 'roast_level',
    question: 'Niveau de torréfaction ?',
    next: 'deepen',
    options: [
      { id: 'light', label: 'Light — Vif, fruité, floral' },
      { id: 'medium', label: 'Medium — Équilibré, polyvalent' },
      { id: 'dark', label: 'Dark — Corsé, chocolaté' },
    ],
  },
  q5: {
    key: 'notes_specifiques',
    question: 'Des notes que tu adores ? (optionnel, plusieurs choix)',
    next: 'q6',
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
  q6: {
    key: 'experience_level',
    question: 'Ton niveau avec le café ?',
    next: 'q7',
    options: [
      { id: 'debutant', label: 'Débutant' },
      { id: 'amateur', label: 'Amateur' },
      { id: 'connaisseur', label: 'Connaisseur' },
    ],
  },
  q7: {
    key: 'acidite_toleree',
    question: 'Tu aimes l\'acidité ?',
    next: 'q8',
    options: [
      { id: 'faible', label: 'Pas trop' },
      { id: 'moyenne', label: 'Modérée' },
      { id: 'haute', label: 'Beaucoup' },
    ],
  },
  q8: {
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

export default function App() {
  const [step, setStep] = useState('welcome');
  const [quiz, setQuiz] = useState({});

  useEffect(() => {
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
  const showProgress = stepIndex >= 1 && stepIndex <= 5;

  return (
    <main>
      {showProgress && (
        <ProgressBar current={stepIndex} total={TOTAL_MANDATORY} />
      )}

      {step === 'welcome' && <Welcome onStart={() => setStep('q0')} />}

      {['q0','q1','q2','q3','q4','q5','q6','q7','q8'].includes(step) && (() => {
        const q = QUESTIONS[step];
        return (
          <BubbleQuestion
            question={q.question}
            options={q.options}
            value={quiz[q.key]}
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

      {step === 'q5' && quiz.notes_specifiques && (
        <div style={{textAlign:'center', marginTop:'1rem'}}>
          <button className="cta" onClick={() => setStep(QUESTIONS.q5.next)}>Suivant</button>
        </div>
      )}

      {step === 'deepen' && (
        <DeepenPrompt
          onShow={() => setStep('result')}
          onDeepen={() => setStep('q5')}
        />
      )}

      {step === 'result' && (
        <Result quiz={quiz} onRestart={restart} />
      )}
    </main>
  );
}
