export default function Alternatives({ alternatives }) {
  if (!alternatives?.length) return null;
  return (
    <section className="alternatives">
      <h3 className="alternatives__title">Ou si tu préfères un café pur origine</h3>
      <ul className="alternatives__list">
        {alternatives.map(({ coffee, reason }) => (
          <li key={coffee.id} className="alternatives__item">
            <h4 className="alternatives__name">{coffee.name}</h4>
            <p className="alternatives__origin">{coffee.origin} — {coffee.grade}</p>
            <p className="alternatives__reason">{reason}</p>
            <p className="alternatives__story">{coffee.short_story}</p>
            {coffee.product_url && (
              <a
                className="cta cta--small"
                href={coffee.product_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Acheter ce café
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
