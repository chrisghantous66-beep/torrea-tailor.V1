import { useState, useEffect } from 'react';
import Welcome from './components/Welcome.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import BubbleQuestion from './components/BubbleQuestion.jsx';
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

      {['q0','q1','q2','q3','q4'].includes(step) && (() => {
        const q = QUESTIONS[step];
        return (
          <BubbleQuestion
            question={q.question}
            options={q.options}
            value={quiz[q.key]}
            onChange={(val) => update(q.key, val, q.next)}
          />
        );
      })()}

      {step === 'deepen' && (
        <div style={{padding:'2rem', textAlign:'center'}}>
          <p>(Deepen prompt — à implémenter)</p>
          <button className="cta" onClick={() => setStep('result')}>Voir le résultat</button>
        </div>
      )}

      {step === 'result' && (
        <div style={{padding:'2rem', textAlign:'center'}}>
          <p>(Result page — à implémenter)</p>
          <pre style={{textAlign:'left', display:'inline-block'}}>{JSON.stringify(quiz, null, 2)}</pre>
          <div style={{marginTop:'1rem'}}>
            <button onClick={restart}>Recommencer</button>
          </div>
        </div>
      )}
    </main>
  );
}
