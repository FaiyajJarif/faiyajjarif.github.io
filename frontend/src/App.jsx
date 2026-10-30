import { useEffect, useState } from 'react';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Projects from './components/Projects.jsx';
import Awards from './components/Awards.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import Admin from './components/Admin.jsx';
import SpaceBackground from './components/SpaceBackground.jsx';
import { usePortfolio, useReveal, useScrollFx, usePointerLight } from './hooks.js';

// GitHub Pages has no server routing, so the admin panel lives at /#/admin.
const isAdminHash = () => window.location.hash.startsWith('#/admin');

export default function App() {
  const [admin, setAdmin] = useState(isAdminHash);
  const data = usePortfolio();

  useEffect(() => {
    const onHash = () => setAdmin(isAdminHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useReveal([admin, data.projects, data.skills]);
  useScrollFx([admin, data.projects, data.skills]);
  usePointerLight([admin, data.projects, data.skills]);

  if (admin) {
    return (
      <>
        <SpaceBackground />
        <Admin onDataChanged={data.reload} />
      </>
    );
  }

  return (
    <>
      <SpaceBackground />
      <div className="progress" aria-hidden="true" />
      <a className="skip-link" href="#main">Skip to content</a>
      <Nav status={data.status} />
      <main id="main">
        <Hero stats={data.stats} />
        <About />
        <Skills skills={data.skills} />
        <Projects projects={data.projects} />
        <Awards />
        <Contact />
      </main>
      <Footer stats={data.stats} />
    </>
  );
}
