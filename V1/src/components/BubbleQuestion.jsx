export default function BubbleQuestion({ question, options, value, onChange, multi = false, recommendedIds = [] }) {
  const handleClick = (optId) => {
    if (multi) {
      const current = Array.isArray(value) ? value : [];
      const next = current.includes(optId)
        ? current.filter(o => o !== optId)
        : [...current, optId];
      onChange(next);
    } else {
      onChange(optId);
    }
  };

  const isSelected = (optId) => {
    if (multi) return Array.isArray(value) && value.includes(optId);
    return value === optId;
  };

  const hasReco = recommendedIds.length > 0;

  return (
    <div className="bubble-question">
      <h2 className="bubble-question__title">{question}</h2>
      <div className="bubble-question__options">
        {options.map(opt => {
          const isRecommended = recommendedIds.includes(opt.id);
          const classes = [
            'bubble',
            isSelected(opt.id) ? 'bubble--selected' : '',
            isRecommended ? 'bubble--recommended' : '',
          ].filter(Boolean).join(' ');
          return (
            <button
              key={opt.id}
              type="button"
              className={classes}
              onClick={() => handleClick(opt.id)}
              aria-pressed={isSelected(opt.id)}
              aria-label={`${opt.label}${isRecommended ? ', recommandé' : ''}, ${question}`}
              title={isRecommended ? 'Recommandé pour ton mode d\'extraction' : undefined}
            >
              {opt.icon && <span className="bubble__icon">{opt.icon}</span>}
              <span className="bubble__label">
                {isRecommended && <span className="bubble__star" aria-hidden="true">★ </span>}
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
      {hasReco && (
        <p className="bubble-question__hint">★ = recommandé pour ton mode d'extraction</p>
      )}
    </div>
  );
}
