import { awards } from '../data/fallback.js';
import { SectionHead } from './Doodles.jsx';

export default function Awards() {
  return (
    <section className="section scene awards" id="awards" data-scene>
      <SectionHead label="Recognition" title="Awards" />

      <div className="award-table card" data-reveal>
        <div className="award-tr award-th" aria-hidden="true">
          <span>Year</span>
          <span>Placement</span>
          <span>Event</span>
          <span>Project</span>
        </div>
        <ol>
          {awards.map((a, i) => (
            <li key={i} className="award-tr">
              <span className="award-year">{a.year}</span>
              <span className="award-place">{a.place}</span>
              <span className="award-event">{a.event}</span>
              <span className="award-project">{a.project}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
