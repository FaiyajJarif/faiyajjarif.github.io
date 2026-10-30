import { profile } from '../data/fallback.js';
import { LogoMark } from './Logo.jsx';
import { useCountUp } from '../hooks.js';
import { ArrowIcon, GitHubIcon, LinkedInIcon, MailIcon, CodeIcon } from './Icons.jsx';

function Metric({ value, decimals = 0, label, delay = 0 }) {
  const scale = Math.pow(10, decimals);
  const [ref, n] = useCountUp(value == null ? null : Math.round(value * scale), 1600);
  return (
    <div className="metric" ref={ref} style={{ '--d': `${delay}ms` }}>
      <span className="metric-num">{value == null ? '—' : (n / scale).toFixed(decimals)}</span>
      <span className="metric-label">{label}</span>
    </div>
  );
}

export default function Hero({ stats }) {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <div className="hero-badge" data-reveal>
          <LogoMark size={64} />
          <p className="hero-kicker">{profile.title}</p>
        </div>
        <h1 className="hero-name" data-reveal>Faiyaj Jarif</h1>
        <p className="hero-lede" data-reveal>
          CSE student and Undergraduate Teaching Assistant at United International University. I build{' '}
          <span className="hl">full-stack web platforms</span> with Spring Boot and React, and{' '}
          <span className="hl hl--2">autonomous robots</span> with microprocessors and computer vision.
        </p>

        <div className="metrics glass" data-reveal>
          <Metric value={stats.projects} label="Projects shipped" delay={0} />
          <Metric value={Number(profile.cgpa)} decimals={2} label="CGPA at UIU" delay={150} />
          <Metric value={stats.awards} label="Competition awards" delay={300} />
        </div>

        <div className="hero-cta" data-reveal>
          <a href="#projects" className="btn btn--primary">
            View projects <ArrowIcon />
          </a>
          <a href="#contact" className="btn btn--ghost">
            Contact me
          </a>
          <ul className="hero-links" aria-label="Profiles">
            <li><a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GitHubIcon /></a></li>
            <li><a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a></li>
            <li><a href={profile.links.codeforces} target="_blank" rel="noreferrer" aria-label="Codeforces"><CodeIcon /></a></li>
            <li><a href={`mailto:${profile.email}`} aria-label="Email"><MailIcon /></a></li>
          </ul>
        </div>
      </div>
    </section>
  );
}
