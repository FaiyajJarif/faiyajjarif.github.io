// Section heading used across the page: small label, title and an optional one-line intro.
export function SectionHead({ label, title, sub }) {
  return (
    <header className="section-head" data-reveal>
      <p className="eyebrow">{label}</p>
      <h2>{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
    </header>
  );
}
