import { useState } from 'react';
import { api, hasApi } from '../api.js';
import { profile } from '../data/fallback.js';
import { ArrowIcon, GitHubIcon, LinkedInIcon, MailIcon, FacebookIcon, CodeIcon } from './Icons.jsx';
import { SectionHead } from './Doodles.jsx';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' });
  const [state, setState] = useState({ phase: 'idle', error: '', fields: {} });

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent('Hello from your portfolio')}&body=${encodeURIComponent(form.message)}`;

  const submit = async (e) => {
    e.preventDefault();
    if (!hasApi) {
      window.location.href = mailto;
      return;
    }
    setState({ phase: 'sending', error: '', fields: {} });
    try {
      await api.contact(form);
      setState({ phase: 'sent', error: '', fields: {} });
      setForm({ name: '', email: '', message: '', website: '' });
    } catch (err) {
      setState({ phase: 'error', error: err.message || 'Could not send.', fields: err.fields || {} });
    }
  };

  const fieldError = (k) =>
    state.fields[k] ? (
      <span className="field-error" id={`err-${k}`}>
        {state.fields[k]}
      </span>
    ) : null;

  return (
    <section className="section scene contact" id="contact" data-scene>
      <SectionHead label="Contact" title="Get in touch" />

      <div className="contact-grid">
        <div className="contact-intro" data-reveal>
          <p className="contact-lead">
            I’m open to internships, research collaborations and full-stack, database or robotics work. Messages sent here
            go straight to my inbox.
          </p>
          <ul className="contact-links">
            <li><a href={`mailto:${profile.email}`}><MailIcon /> {profile.email}</a></li>
            <li><a href={profile.links.linkedin} target="_blank" rel="noreferrer"><LinkedInIcon /> in/faiyaj-jarif</a></li>
            <li><a href={profile.links.github} target="_blank" rel="noreferrer"><GitHubIcon /> github.com/faiyajjarif</a></li>
            <li><a href={profile.links.codeforces} target="_blank" rel="noreferrer"><CodeIcon /> codeforces/faiyaj_j</a></li>
            <li><a href={profile.links.facebook} target="_blank" rel="noreferrer"><FacebookIcon /> faiyaj.jarif</a></li>
          </ul>
        </div>

        <form className="contact-form card" onSubmit={submit} noValidate data-reveal>
          {state.phase === 'sent' ? (
            <div className="sent" role="status">
              <div className="sent-check" aria-hidden="true">✓</div>
              <h3>Message sent</h3>
              <p>Thanks! I’ll get back to you soon.</p>
              <button type="button" className="btn btn--ghost" onClick={() => setState({ phase: 'idle', error: '', fields: {} })}>
                Send another
              </button>
            </div>
          ) : (
            <>
              <div className="field">
                <label htmlFor="c-name">Name</label>
                <input id="c-name" value={form.name} onChange={update('name')} required maxLength={80} autoComplete="name"
                  aria-invalid={!!state.fields.name} aria-describedby={state.fields.name ? 'err-name' : undefined} />
                {fieldError('name')}
              </div>
              <div className="field">
                <label htmlFor="c-email">Email</label>
                <input id="c-email" type="email" value={form.email} onChange={update('email')} required maxLength={160} autoComplete="email"
                  aria-invalid={!!state.fields.email} aria-describedby={state.fields.email ? 'err-email' : undefined} />
                {fieldError('email')}
              </div>
              <div className="field">
                <label htmlFor="c-msg">Message</label>
                <textarea id="c-msg" rows={5} value={form.message} onChange={update('message')} required minLength={10} maxLength={4000}
                  aria-invalid={!!state.fields.message} aria-describedby={state.fields.message ? 'err-message' : undefined} />
                {fieldError('message')}
              </div>
              {/* Honeypot: hidden from people, bots fill it in. */}
              <div className="hp" aria-hidden="true">
                <label htmlFor="c-web">Website</label>
                <input id="c-web" tabIndex={-1} autoComplete="off" value={form.website} onChange={update('website')} />
              </div>

              {state.phase === 'error' && (
                <p className="form-error" role="alert">
                  {state.error} You can also <a href={mailto}>email me directly</a>.
                </p>
              )}

              <button type="submit" className="btn btn--primary btn--block" disabled={state.phase === 'sending'}>
                {state.phase === 'sending' ? (
                  <>
                    <span className="spinner" aria-hidden="true" /> Sending… (first message can take up to a minute)
                  </>
                ) : (
                  <>
                    {hasApi ? 'Send message' : 'Write an email'} <ArrowIcon />
                  </>
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
