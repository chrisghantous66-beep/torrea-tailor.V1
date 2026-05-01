import { CoffeeBranch, CoffeeBeans } from './BotanicalDecor.jsx';

export default function Welcome({ onStart }) {
  return (
    <div className="welcome">
      <CoffeeBranch className="welcome__decor welcome__decor--top-left" />
      <CoffeeBranch className="welcome__decor welcome__decor--bottom-right" flipped />

      <div className="welcome__inner">
        <CoffeeBeans className="welcome__beans" />
        <h1 className="welcome__title">Trouvons ton café idéal</h1>
        <p className="welcome__subtitle">
          En moins de 90 secondes, on te recommande le café (ou le blend) qui te ressemble.
        </p>
        <button type="button" className="cta cta--hero" onClick={onStart}>
          Commencer
        </button>
      </div>
    </div>
  );
}
