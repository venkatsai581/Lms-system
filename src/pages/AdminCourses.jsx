import { useMemo, useState } from 'react';
import { BookOpen, Edit3, Plus, Search, Trash2, Users, X } from 'lucide-react';
import { useLMS } from '../context/LMSContext';
import { categorySymbol, formatPrice, slugify } from '../utils/helpers';

const COLORS = ['#e0e7ff', '#fef3c7', '#fce7f3', '#dcfce7', '#cffafe'];
const blank = {
  title: '', category: 'Web Development', level: 'Beginner', duration: '4 weeks', price: 0, rating: 4.5, students: 0,
  instructor: '', instructorRole: 'Instructor', instructorBio: '', color: COLORS[0], description: '', lessons: [], quiz: [],
};

const lessonsToText = lessons => lessons.map(l => `${l.title} | ${l.duration} | ${l.content}`).join('\n');
// Quiz line format: Question | Option A | Option B | Option C | Option D | Correct option number (1-4)
const quizToText = quiz => quiz.map(q => `${q.question} | ${q.options.join(' | ')} | ${q.answer + 1}`).join('\n');

function parseLessons(text, existing) {
  return text.split('\n').map(line => line.trim()).filter(Boolean).map((line, i) => {
    const [title, duration = '15 min', ...content] = line.split('|').map(s => s.trim());
    return { id: existing[i]?.id || `l${Date.now()}-${i}`, title, duration: duration || '15 min', content: content.join(' | ') || 'Lesson content coming soon.' };
  }).filter(l => l.title);
}

function parseQuiz(text) {
  const questions = [];
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  for (const [n, line] of lines.entries()) {
    const parts = line.split('|').map(s => s.trim());
    const answer = Number(parts[parts.length - 1]);
    const options = parts.slice(1, -1).filter(Boolean);
    if (parts.length < 4 || options.length < 2 || !Number.isInteger(answer) || answer < 1 || answer > options.length) {
      return { error: `Quiz line ${n + 1} is invalid. Use: Question | Option A | Option B | ... | correct option number.` };
    }
    questions.push({ question: parts[0], options, answer: answer - 1 });
  }
  return { questions };
}

export default function AdminCourses() {
  const { courses, addCourse, updateCourse, deleteCourse } = useLMS();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [lessonText, setLessonText] = useState('');
  const [quizText, setQuizText] = useState('');
  const [error, setError] = useState('');

  const filtered = useMemo(() => courses.filter(c => `${c.title} ${c.instructor} ${c.category}`.toLowerCase().includes(query.toLowerCase())), [courses, query]);
  const categories = [...new Set(courses.map(c => c.category))];

  const openNew = () => { setEditing('new'); setForm({ ...blank }); setLessonText(''); setQuizText(''); setError(''); };
  const openEdit = c => { setEditing(c.id); setForm({ ...c }); setLessonText(lessonsToText(c.lessons)); setQuizText(quizToText(c.quiz || [])); setError(''); };
  const close = () => setEditing(null);
  const set = (key, value) => setForm(old => ({ ...old, [key]: value }));

  const save = e => {
    e.preventDefault();
    const lessons = parseLessons(lessonText, editing === 'new' ? [] : form.lessons);
    if (!lessons.length) return setError('Add at least one lesson using: Title | Duration | Content');
    const quiz = parseQuiz(quizText);
    if (quiz.error) return setError(quiz.error);
    const base = { ...form, title: form.title.trim(), instructor: form.instructor.trim(), lessons, quiz: quiz.questions, price: Math.max(0, Number(form.price) || 0) };
    if (editing === 'new') addCourse({ ...base, id: `${slugify(base.title)}-${Date.now()}` });
    else updateCourse(base);
    close();
  };

  const remove = c => { if (window.confirm(`Delete “${c.title}”? This also removes it from enrolled lists and progress.`)) deleteCourse(c.id); };

  return (
    <div className="page-wrap">
      <div className="page-heading">
        <div><div className="eyebrow">ADMINISTRATION</div><h1>Course management</h1><p className="muted">Create, update and organise the learning catalogue.</p></div>
        <button className="btn btn-primary" onClick={openNew}><Plus size={17} /> Add new course</button>
      </div>

      <div className="stats-grid admin-stats">
        <div className="stat-card"><div className="stat-icon purple"><BookOpen /></div><div><span>Total courses</span><strong>{courses.length}</strong><small>In catalogue</small></div></div>
        <div className="stat-card"><div className="stat-icon green"><Users /></div><div><span>Total learners</span><strong>{courses.reduce((s, c) => s + c.students, 0).toLocaleString()}</strong><small>Across listed courses</small></div></div>
        <div className="stat-card"><div className="stat-icon blue"><Edit3 /></div><div><span>Categories</span><strong>{categories.length}</strong><small>Learning topics</small></div></div>
      </div>

      <section className="panel admin-table-panel">
        <div className="table-toolbar">
          <div><h2>All courses</h2><p className="muted">Manage the courses available to students.</p></div>
          <label className="search-box compact-search"><Search size={17} /><input placeholder="Search courses..." value={query} onChange={e => setQuery(e.target.value)} aria-label="Search courses" /></label>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead><tr><th>Course</th><th>Instructor</th><th>Category</th><th>Lessons</th><th>Quiz</th><th>Price</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td><div className="table-course"><span className="table-course-icon" style={{ background: c.color }}>{categorySymbol(c.category)}</span><div><strong>{c.title}</strong><small>{c.level}</small></div></div></td>
                  <td>{c.instructor}</td>
                  <td><span className="soft-pill">{c.category}</span></td>
                  <td>{c.lessons.length}</td>
                  <td>{(c.quiz || []).length} Qs</td>
                  <td>{formatPrice(c.price)}</td>
                  <td><div className="table-actions">
                    <button className="icon-btn edit-action" title="Edit course" aria-label={`Edit ${c.title}`} onClick={() => openEdit(c)}><Edit3 size={16} /></button>
                    <button className="icon-btn delete-action" title="Delete course" aria-label={`Delete ${c.title}`} onClick={() => remove(c)}><Trash2 size={16} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && <div className="table-empty">No matching courses found.</div>}
        </div>
      </section>

      {editing && (
        <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) close(); }}>
          <section className="course-modal" role="dialog" aria-modal="true">
            <div className="modal-heading">
              <div><div className="eyebrow">COURSE DETAILS</div><h2>{editing === 'new' ? 'Create a course' : 'Edit course'}</h2></div>
              <button className="icon-btn" aria-label="Close" onClick={close}><X /></button>
            </div>
            <form onSubmit={save} className="form-grid modal-form">
              <label className="field full-field">Course title<input required value={form.title} onChange={e => set('title', e.target.value)} /></label>
              <label className="field">Category<input required list="category-options" value={form.category} onChange={e => set('category', e.target.value)} />
                <datalist id="category-options">{categories.map(c => <option key={c} value={c} />)}</datalist></label>
              <label className="field">Level<select value={form.level} onChange={e => set('level', e.target.value)}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
              <label className="field">Duration<input required value={form.duration} onChange={e => set('duration', e.target.value)} /></label>
              <label className="field">Price (USD)<input type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} /></label>
              <label className="field">Instructor name<input required value={form.instructor} onChange={e => set('instructor', e.target.value)} /></label>
              <label className="field">Instructor role<input value={form.instructorRole} onChange={e => set('instructorRole', e.target.value)} /></label>
              <label className="field full-field">Instructor bio<textarea rows="2" value={form.instructorBio} onChange={e => set('instructorBio', e.target.value)} /></label>
              <div className="field full-field">Card colour
                <div className="swatches">{COLORS.map(c => <button type="button" key={c} className={`swatch ${form.color === c ? 'on' : ''}`} style={{ background: c }} aria-label={`Colour ${c}`} onClick={() => set('color', c)} />)}</div></div>
              <label className="field full-field">Description<textarea required rows="3" value={form.description} onChange={e => set('description', e.target.value)} /></label>
              <label className="field full-field">Lessons <small>One per line: Title | Duration | Content</small>
                <textarea required rows="5" value={lessonText} onChange={e => setLessonText(e.target.value)} placeholder={'Introduction | 15 min | Lesson overview...\nCore concepts | 20 min | Explain the main concepts...'} /></label>
              <label className="field full-field">Quiz questions <small>One per line: Question | Option A | Option B | Option C | Option D | correct option number (e.g. 2)</small>
                <textarea rows="5" value={quizText} onChange={e => setQuizText(e.target.value)} placeholder="What is 2 + 2? | 3 | 4 | 5 | 6 | 2" /></label>
              {error && <p className="form-error full-field" role="alert">{error}</p>}
              <div className="form-footer full-field">
                <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing === 'new' ? 'Create course' : 'Save changes'}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
