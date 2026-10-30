import { useEffect, useState } from 'react';
import { api, hasApi } from '../api.js';

const emptyProject = {
  title: '', summary: '', category: 'WEB', tags: '', highlights: '', awardText: '', awardCount: 0,
  repoUrl: '', liveUrl: '', featured: false, sortOrder: 10,
};
const emptySkill = { name: '', category: 'Full Stack', sortOrder: 50 };

function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [state, setState] = useState({ busy: false, error: '' });

  const submit = async (e) => {
    e.preventDefault();
    setState({ busy: true, error: '' });
    try {
      await api.admin.me(form);
      onLogin(form);
    } catch (err) {
      setState({ busy: false, error: err.status === 401 ? 'Wrong username or password.' : err.message });
    }
  };

  return (
    <form className="admin-login glass" onSubmit={submit}>
      <h1>Admin</h1>
      <p className="muted">Sign in to edit projects, skills and read messages.</p>
      <div className="field">
        <label htmlFor="a-user">Username</label>
        <input id="a-user" autoComplete="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
      </div>
      <div className="field">
        <label htmlFor="a-pass">Password</label>
        <input id="a-pass" type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      </div>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <button className="btn btn--primary btn--block" disabled={state.busy}>
        {state.busy ? <><span className="spinner" aria-hidden="true" /> Connecting (the API may be waking up)…</> : 'Sign in'}
      </button>
      <a href="#top" className="admin-back">← Back to site</a>
    </form>
  );
}

function Messages({ auth }) {
  const [list, setList] = useState(null);
  const [error, setError] = useState('');
  const load = () => api.admin.messages(auth).then(setList).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) return <p className="form-error">{error}</p>;
  if (!list) return <p className="muted">Loading…</p>;
  if (!list.length) return <p className="muted">No messages yet.</p>;

  return (
    <ul className="admin-list">
      {list.map((m) => (
        <li key={m.id} className={`admin-row glass ${m.readByOwner ? '' : 'is-unread'}`}>
          <div className="admin-row-main">
            <strong>{m.name}</strong> <a href={`mailto:${m.email}`}>{m.email}</a>
            <span className="muted mono"> · {new Date(m.createdAt).toLocaleString()}</span>
            <p className="admin-msg">{m.body}</p>
          </div>
          <div className="admin-row-actions">
            {!m.readByOwner && (
              <button className="btn btn--ghost btn--sm" onClick={() => api.admin.markRead(auth, m.id).then(load)}>Mark read</button>
            )}
            <button className="btn btn--danger btn--sm" onClick={() => window.confirm('Delete this message?') && api.admin.deleteMessage(auth, m.id).then(load)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function ProjectEditor({ auth, onChanged }) {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(emptyProject);
  const [status, setStatus] = useState({ error: '', fields: {}, ok: '' });
  const load = () => api.projects().then(setList).catch((e) => setStatus({ error: e.message, fields: {}, ok: '' }));
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.admin.saveProject(auth, {
        ...form,
        tags: String(form.tags).split(',').map((t) => t.trim()).filter(Boolean),
        highlights: String(form.highlights).split('\n').map((t) => t.trim()).filter(Boolean),
        awardCount: Number(form.awardCount) || 0,
        sortOrder: Number(form.sortOrder) || 0,
      });
      setStatus({ error: '', fields: {}, ok: form.id ? 'Project updated.' : 'Project added.' });
      setForm(emptyProject);
      load();
      onChanged();
    } catch (err) {
      setStatus({ error: err.message, fields: err.fields || {}, ok: '' });
    }
  };

  const edit = (p) => {
    setForm({ ...emptyProject, ...p, tags: (p.tags || []).join(', '), highlights: (p.highlights || []).join('\n'), awardText: p.awardText || '', repoUrl: p.repoUrl || '', liveUrl: p.liveUrl || '' });
    setStatus({ error: '', fields: {}, ok: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (p) => {
    await api.admin.deleteProject(auth, p.id);
    load();
    onChanged();
  };

  const err = (k) => status.fields[k] && <span className="field-error">{status.fields[k]}</span>;

  return (
    <div className="admin-split">
      <form className="admin-form glass" onSubmit={save}>
        <h2>{form.id ? `Edit “${form.title}”` : 'Add a project'}</h2>
        <div className="field"><label htmlFor="p-title">Title</label><input id="p-title" value={form.title} onChange={set('title')} required />{err('title')}</div>
        <div className="field"><label htmlFor="p-sum">Summary</label><textarea id="p-sum" rows={4} value={form.summary} onChange={set('summary')} required />{err('summary')}</div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="p-cat">Category</label>
            <select id="p-cat" value={form.category} onChange={set('category')}>
              <option value="ROBOTICS">Robotics</option><option value="WEB">Web</option><option value="RESEARCH">Research</option><option value="OTHER">Other</option>
            </select>
          </div>
          <div className="field"><label htmlFor="p-order">Order</label><input id="p-order" type="number" value={form.sortOrder} onChange={set('sortOrder')} /></div>
        </div>
        <div className="field"><label htmlFor="p-tags">Stack (comma separated)</label><input id="p-tags" value={form.tags} onChange={set('tags')} /></div>
        <div className="field"><label htmlFor="p-hl">Highlights (one per line, up to 6)</label><textarea id="p-hl" rows={4} value={form.highlights} onChange={set('highlights')} />{err('highlights')}</div>
        <div className="field-row">
          <div className="field"><label htmlFor="p-ac">Awards</label><input id="p-ac" type="number" min="0" value={form.awardCount} onChange={set('awardCount')} /></div>
          <div className="field"><label htmlFor="p-at">Award text</label><input id="p-at" value={form.awardText} onChange={set('awardText')} /></div>
        </div>
        <div className="field"><label htmlFor="p-repo">Code link</label><input id="p-repo" value={form.repoUrl} onChange={set('repoUrl')} placeholder="https://github.com/…" />{err('repoUrl')}</div>
        <div className="field"><label htmlFor="p-live">Live link</label><input id="p-live" value={form.liveUrl} onChange={set('liveUrl')} placeholder="https://…" />{err('liveUrl')}</div>
        {status.error && <p className="form-error" role="alert">{status.error}</p>}
        {status.ok && <p className="form-ok" role="status">{status.ok}</p>}
        <div className="admin-form-actions">
          <button className="btn btn--primary">{form.id ? 'Save changes' : 'Add project'}</button>
          {form.id && <button type="button" className="btn btn--ghost" onClick={() => setForm(emptyProject)}>Cancel</button>}
        </div>
      </form>

      <ul className="admin-list">
        {list.map((p) => (
          <li key={p.id} className="admin-row glass">
            <div className="admin-row-main">
              <strong>{p.title}</strong> <span className="muted mono">· {p.category.toLowerCase()} · #{p.sortOrder}</span>
            </div>
            <div className="admin-row-actions">
              <button className="btn btn--ghost btn--sm" onClick={() => edit(p)}>Edit</button>
              <button className="btn btn--danger btn--sm" onClick={() => remove(p)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SkillEditor({ auth, onChanged }) {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(emptySkill);
  const [error, setError] = useState('');
  const load = () => api.skills().then(setList).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.admin.saveSkill(auth, { ...form, sortOrder: Number(form.sortOrder) || 0 });
      setForm(emptySkill);
      setError('');
      load();
      onChanged();
    } catch (err) {
      setError(err.message);
    }
  };

  const categories = [...new Set(list.map((s) => s.category))];

  return (
    <div className="admin-split">
      <form className="admin-form glass" onSubmit={save}>
        <h2>{form.id ? `Edit “${form.name}”` : 'Add a skill'}</h2>
        <div className="field"><label htmlFor="s-name">Skill</label><input id="s-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
        <div className="field">
          <label htmlFor="s-cat">Group</label>
          <input id="s-cat" list="s-cats" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
          <datalist id="s-cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
        </div>
        <div className="field"><label htmlFor="s-order">Order</label><input id="s-order" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} /></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="admin-form-actions">
          <button className="btn btn--primary">{form.id ? 'Save' : 'Add skill'}</button>
          {form.id && <button type="button" className="btn btn--ghost" onClick={() => setForm(emptySkill)}>Cancel</button>}
        </div>
      </form>

      <ul className="admin-list">
        {list.map((s) => (
          <li key={s.id} className="admin-row glass">
            <div className="admin-row-main"><strong>{s.name}</strong> <span className="muted mono">· {s.category} · #{s.sortOrder}</span></div>
            <div className="admin-row-actions">
              <button className="btn btn--ghost btn--sm" onClick={() => setForm(s)}>Edit</button>
              <button className="btn btn--danger btn--sm" onClick={() => api.admin.deleteSkill(auth, s.id).then(() => { load(); onChanged(); })}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Admin({ onDataChanged }) {
  const [auth, setAuth] = useState(null);
  const [tab, setTab] = useState('messages');

  if (!hasApi) {
    return (
      <div className="admin">
        <div className="admin-login glass">
          <h1>Admin</h1>
          <p className="muted">The admin panel needs the Spring Boot API. Set <code>VITE_API_URL</code> and rebuild the site (see README).</p>
          <a href="#top" className="admin-back">← Back to site</a>
        </div>
      </div>
    );
  }

  if (!auth) return <div className="admin"><Login onLogin={setAuth} /></div>;

  return (
    <div className="admin">
      <header className="admin-head glass">
        <strong>Portfolio admin</strong>
        <div className="filters" role="tablist" aria-label="Admin sections">
          {[['messages', 'Messages'], ['projects', 'Projects'], ['skills', 'Skills']].map(([k, label]) => (
            <button key={k} role="tab" aria-selected={tab === k} className={`filter ${tab === k ? 'is-active' : ''}`} onClick={() => setTab(k)}>
              {label}
            </button>
          ))}
        </div>
        <div className="admin-head-actions">
          <a href="#top" className="btn btn--ghost btn--sm">View site</a>
          <button className="btn btn--ghost btn--sm" onClick={() => setAuth(null)}>Sign out</button>
        </div>
      </header>
      <div className="admin-body">
        {tab === 'messages' && <Messages auth={auth} />}
        {tab === 'projects' && <ProjectEditor auth={auth} onChanged={onDataChanged} />}
        {tab === 'skills' && <SkillEditor auth={auth} onChanged={onDataChanged} />}
      </div>
    </div>
  );
}
