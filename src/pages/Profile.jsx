import { useEffect, useState } from 'react';
import { CheckCircle2, RotateCcw, Save, UserRound } from 'lucide-react';
import { useLMS } from '../context/LMSContext';
import ProgressBar from '../components/ProgressBar';
import { initials } from '../utils/helpers';

export default function Profile() {
  const { profile, setProfile, enrolled, courses, completedIds, progress, quizResults, resetProgress, notify } = useLMS();
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);
  useEffect(() => { setForm(profile); }, [profile]);
  const mine = courses.filter(c => enrolled.includes(c.id));
  const done = mine.reduce((s, c) => s + completedIds(c).length, 0);
  const quizzes = mine.filter(c => quizResults[c.id]);

  const change = (key, value) => { setForm(old => ({ ...old, [key]: value })); setSaved(false); };
  const submit = e => { e.preventDefault(); const clean = { ...form, name: form.name.trim(), email: form.email.trim().toLowerCase(), phone: form.phone.trim(), bio: form.bio.trim() }; if (!clean.name || !clean.email) { notify('Please enter your name and email', 'error'); return; } setProfile(clean); setForm(clean); setSaved(true); notify('Profile saved successfully'); };
  const reset = () => { if (window.confirm('Reset all lesson progress and quiz results on this device?')) resetProgress(); };

  return (
    <div className="page-wrap">
      <div className="page-heading">
        <div><div className="eyebrow">ACCOUNT SETTINGS</div><h1>My profile</h1><p className="muted">Manage your personal information and learning activity.</p></div>
      </div>

      <div className="profile-layout">
        <aside className="panel profile-summary">
          <div className="profile-avatar">{initials(form.name)}</div>
          <h2>{profile.name}</h2>
          <p className="muted">{profile.email}</p>
          <span className="soft-pill">Student account</span>
          <div className="profile-stats">
            <div><strong>{mine.length}</strong><span>Enrolled</span></div>
            <div><strong>{done}</strong><span>Lessons done</span></div>
            <div><strong>{quizzes.length}</strong><span>Quizzes</span></div>
          </div>
        </aside>

        <section className="panel profile-form-panel">
          <div className="panel-heading"><div><h2>Personal information</h2><p className="muted">Your details are saved on this device.</p></div><UserRound size={20} /></div>
          <form onSubmit={submit} className="form-grid">
            <label className="field full-field">Full name<input required value={form.name} onChange={e => change('name', e.target.value)} /></label>
            <label className="field">Email address<input type="email" required value={form.email} onChange={e => change('email', e.target.value)} /></label>
            <label className="field">Phone number<input type="tel" value={form.phone} onChange={e => change('phone', e.target.value)} placeholder="+91 98765 43210" /></label>
            <label className="field full-field">About me<textarea rows="4" value={form.bio} onChange={e => change('bio', e.target.value)} /></label>
            <div className="form-footer full-field">
              {saved && <span className="save-message"><CheckCircle2 size={16} /> Profile saved</span>}
              <button className="btn btn-primary" type="submit"><Save size={16} /> Save changes</button>
            </div>
          </form>
        </section>
      </div>

      <section className="section-block">
        <div className="section-heading"><div><h2>Learning progress</h2><p className="muted">Your enrolled course completion and quiz scores.</p></div>
          <button className="btn btn-secondary btn-sm" onClick={reset}><RotateCcw size={14} /> Reset progress</button></div>
        <div className="profile-progress-list">
          {mine.map(c => (
            <div className="profile-progress-row" key={c.id}>
              <div><strong>{c.title}</strong><span>{completedIds(c).length} / {c.lessons.length} lessons{quizResults[c.id] ? ` · quiz ${quizResults[c.id].percentage}%` : ''}</span></div>
              <ProgressBar value={progress(c)} label={`${c.title} progress`} />
              <strong>{progress(c)}%</strong>
            </div>
          ))}
          {!mine.length && <p className="muted pad">Enrol in a course to see your progress here.</p>}
        </div>
      </section>
    </div>
  );
}
