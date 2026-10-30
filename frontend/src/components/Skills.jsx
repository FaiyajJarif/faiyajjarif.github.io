import { CategoryIcon } from './Icons.jsx';
import { SectionHead } from './Doodles.jsx';

export default function Skills({ skills }) {
  const groups = [];
  const index = new Map();
  [...skills]
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .forEach((s) => {
      if (!index.has(s.category)) {
        index.set(s.category, groups.length);
        groups.push({ category: s.category, items: [] });
      }
      groups[index.get(s.category)].items.push(s.name);
    });

  return (
    <section className="section scene skills" id="skills" data-scene>
      <SectionHead label="Skills" title="Technical skills" sub="Grouped by where I use them. Full-stack development is my primary area." />

      <div className="skill-table card" data-reveal>
        {groups.map((g) => (
          <div key={g.category} className="skill-row">
            <div className="skill-cat">
              <span className="skill-icon">
                <CategoryIcon name={g.category} width="18" height="18" />
              </span>
              <span>{g.category}</span>
              {g.category === 'Full Stack' && <span className="badge">Primary</span>}
            </div>
            <ul className="skill-list">
              {g.items.map((name) => (
                <li key={name} className="chip">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
