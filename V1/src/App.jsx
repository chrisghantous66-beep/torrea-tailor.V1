import { useState, useEffect } from 'react';
import Welcome from './components/Welcome.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import { saveQuizState, loadQuizState, clearQuizState } from './lib/storage.js';

const STEPS = ['welcome', 'q0', 'q1', 'q2', 'q3', 'q4', 'deepen', 'q5', 'q6', 'q7', 'q8', 'result'];
const TOTAL_MANDATORY = 5;

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

      {step !== 'welcome' && (
        <div style={{padding:'2rem', textAlign:'center'}}>
          <p>Étape : {step}</p>
          <pre style={{textAlign:'left', display:'inline-block'}}>{JSON.stringify(quiz, null, 2)}</pre>
          <div style={{marginTop:'1rem'}}>
            <button onClick={restart}>Recommencer</button>
          </div>
        </div>
      )}
    </main>
  );
}
