import { profile } from '../data/fallback.js';
import { SectionHead } from './Doodles.jsx';

const facts = [
  ['Education', 'BSc in Computer Science & Engineering, United International University'],
  ['CGPA', profile.cgpa],
  ['Role', 'Undergraduate Teaching Assistant, UIU'],
  ['Based in', profile.location],
  ['Currently building', 'RescueBot, an autonomous search-and-rescue robot'],
];

export default function About() {
  return (
    <section className="section scene about" id="about" data-scene>
      <SectionHead label="About" title="Hardware and software, end to end" />

      <div className="about-grid">
        <div className="about-text" data-reveal>
          <p>
            I’m a Computer Science &amp; Engineering student at {profile.university} and an Undergraduate Teaching
            Assistant. My work sits on two sides: full-stack web platforms, and autonomous robots and embedded
            systems.
          </p>
          <p>
            On the software side I work full stack: schemas and APIs with Spring Boot on PostgreSQL or MySQL, and React
            front ends on top. On the hardware side I work with microprocessors and microcontrollers, using Python and
            OpenCV for computer vision. I also practise algorithms on Codeforces.
          </p>
          <ul className="focus-list" aria-label="Focus areas">
            {profile.focus.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>

        <dl className="facts card" data-reveal>
          {facts.map(([k, v]) => (
            <div key={k} className="fact">
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
