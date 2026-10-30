import { useState } from 'react';
import { ExternalIcon, GitHubIcon, TrophyIcon, CategoryIcon } from './Icons.jsx';
import { SectionHead } from './Doodles.jsx';

const filters = [
  ['ALL', 'All'],
  ['WEB', 'Full stack'],
  ['ROBOTICS', 'Robotics'],
  ['RESEARCH', 'Research'],
  ['OTHER', 'Other'],
];

const categoryLabel = { WEB: 'Full stack', ROBOTICS: 'Robotics', RESEARCH: 'Research', OTHER: 'Other' };
const categoryIcon = { WEB: 'Full Stack', ROBOTICS: 'Robotics, IoT & Vision', RESEARCH: 'Research', OTHER: 'Tools' };

const Check = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export default function Projects({ projects }) {
  const [filter, setFilter] = useState('ALL');
  const list = [...projects]
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .filter((p) => filter === 'ALL' || p.category === filter);
  const available = new Set(projects.map((p) => p.category));
  const awarded = projects.filter((p) => p.awardCount > 0).length;
  const totalAwards = projects.reduce((n, p) => n + (p.awardCount || 0), 0);
  const words = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const sub = awarded ? (
    <>
      <strong className="num">{words[awarded] || awarded}</strong> of these {(words[projects.length] || projects.length).toString().toLowerCase()}{' '}
      projects placed at university and inter-university competitions, <strong className="num">{totalAwards}</strong> award
      {totalAwards === 1 ? '' : 's'} in total.
    </>
  ) : undefined;

  return (
    <section className="section scene projects" id="projects" data-scene>
      <SectionHead label="Projects" title="Selected work" sub={sub} />

      <div className="filters" role="group" aria-label="Filter projects" data-reveal>
        {filters
          .filter(([key]) => key === 'ALL' || available.has(key))
          .map(([key, label]) => (
            <button key={key} type="button" className={`filter ${filter === key ? 'is-active' : ''}`} aria-pressed={filter === key} onClick={() => setFilter(key)}>
              {label}
            </button>
          ))}
      </div>

      <div className="case-list">
        {list.map((p, i) => (
          <article key={p.id} className="case card" data-reveal style={{ '--d': `${i * 60}ms` }}>
            <div className="case-main">
              <div className="case-meta">
                <span className="case-icon">
                  <CategoryIcon name={categoryIcon[p.category]} width="18" height="18" />
                </span>
                <span className="case-cat">{categoryLabel[p.category] || p.category}</span>
                {p.awardCount > 0 && (
                  <span className="award-badge" title={p.awardText || undefined}>
                    <TrophyIcon width="14" height="14" /> {p.awardCount > 1 ? `${p.awardCount} awards` : 'Award'}
                  </span>
                )}
              </div>
              <h3>{p.title}</h3>
              <p className="case-summary">{p.summary}</p>
              {p.awardText && <p className="case-award">{p.awardText}</p>}
            </div>

            {p.highlights?.length > 0 && (
              <ul className="case-points" aria-label="Highlights">
                {p.highlights.map((h) => (
                  <li key={h}>
                    <Check /> {h}
                  </li>
                ))}
              </ul>
            )}

            <div className="case-side">
              <p className="case-label">Stack</p>
              <ul className="chip-row">
                {p.tags.map((t) => (
                  <li key={t} className="chip chip--sm">{t}</li>
                ))}
              </ul>
              {(p.repoUrl || p.liveUrl) && (
                <div className="case-links">
                  {p.repoUrl && (
                    <a href={p.repoUrl} target="_blank" rel="noreferrer" className="link-btn">
                      <GitHubIcon width="16" height="16" /> Source
                    </a>
                  )}
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noreferrer" className="link-btn">
                      <ExternalIcon width="16" height="16" /> Live
                    </a>
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
        {list.length === 0 && <p className="empty">Nothing in this category yet.</p>}
      </div>
    </section>
  );
}
