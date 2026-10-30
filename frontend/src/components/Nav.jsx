import { useEffect, useState } from 'react';
import Logo from './Logo.jsx';

const links = [
  ['About', '#about'],
  ['Skills', '#skills'],
  ['Projects', '#projects'],
  ['Awards', '#awards'],
  ['Contact', '#contact'],
];

const statusLabel = {
  live: 'API live',
  waking: 'API waking up',
  offline: 'API offline',
};

export default function Nav({ status }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [onHero, setOnHero] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const hero = document.getElementById('top');
      setOnHero(!!hero && window.scrollY < hero.offsetHeight - 80);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const sections = links.map(([, href]) => document.querySelector(href)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive('#' + e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${onHero ? 'nav--dark' : ''}`}>
      <div className="nav-inner glass">
        <a href="#top" className="nav-brand" aria-label="Faiyaj Jarif, back to top">
          <Logo />
        </a>

        <nav aria-label="Main">
          <ul className="nav-links">
            {links.map(([label, href]) => (
              <li key={href}>
                <a href={href} className={active === href ? 'is-active' : ''}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-right">
          {status !== 'static' && (
            <span className={`api-pill api-pill--${status}`} title="Status of the Spring Boot backend">
              <span className="api-dot" />
              {statusLabel[status]}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
