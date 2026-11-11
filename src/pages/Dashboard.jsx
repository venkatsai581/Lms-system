import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, Clock3, Trophy } from 'lucide-react';
import { useLMS } from '../context/LMSContext';
import CourseCard from '../components/CourseCard';
import ProgressBar from '../components/ProgressBar';
import EmptyState from '../components/EmptyState';
import { todayLabel } from '../utils/helpers';

export default function Dashboard() {
  const { courses, enrolled, completedIds, progress, quizResults, profile } = useLMS();
  const mine = courses.filter(c => enrolled.includes(c.id));
  const totalLessons = mine.reduce((sum, c) => sum + c.lessons.length, 0);
  const done = mine.reduce((sum, c) => sum + completedIds(c).length, 0);
  const avg = mine.length ? Math.round(mine.reduce((sum, c) => sum + progress(c), 0) / mine.length) : 0;
  const attempts = mine.filter(c => quizResults[c.id]);
  const avgQuiz = attempts.length
    ? Math.round(attempts.reduce((s, c) => s + quizResults[c.id].percentage, 0) / attempts.length)
    : null;
  // In-progress courses first, then not started, then completed.
  const order = c => (progress(c) > 0 && progress(c) < 100 ? 0 : progress(c) === 0 ? 1 : 2);
  const continueList = [...mine].sort((a, b) => order(a) - order(b)).slice(0, 3);
  const overall = totalLessons ? Math.round((done / totalLessons) * 100) : 0;

  return (
    <div className="page-wrap">
      <div className="welcome-row">
        <div>
          <div className="eyebrow">{todayLabel()}</div>
          <h1>Welcome back, {profile.name.split(' ')[0]} <span className="wave">✦</span></h1>
          <p className="muted">Keep your momentum going. You're making great progress.</p>
        </div>
        <Link to="/catalogue" className="btn btn-primary">Explore courses <ArrowRight size={16} /></Link>
      </div>

      <section className="stats-grid">
        <div className="stat-card"><div className="stat-icon purple"><BookOpen /></div><div><span>Enrolled courses</span><strong>{mine.length}</strong><small>Courses in your library</small></div></div>
        <div className="stat-card"><div className="stat-icon green"><CheckCircle2 /></div><div><span>Lessons completed</span><strong>{done}<small className="stat-total"> / {totalLessons}</small></strong><small>Keep it up!</small></div></div>
        <div className="stat-card"><div className="stat-icon orange"><Trophy /></div><div><span>Average progress</span><strong>{avg}%</strong><small>Across your courses</small></div></div>
        <div className="stat-card"><div className="stat-icon blue"><Clock3 /></div><div><span>Quizzes attempted</span><strong>{attempts.length}</strong><small>{avgQuiz === null ? 'No attempts yet' : `Average score ${avgQuiz}%`}</small></div></div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div><div className="eyebrow">YOUR LEARNING PATH</div><h2>Enrolled courses</h2><p className="muted">Pick up right where you left off.</p></div>
          <Link to="/my-courses" className="text-link">View all courses <ArrowRight size={15} /></Link>
        </div>
        {continueList.length ? (
          <div className="course-grid">{continueList.map(c => <CourseCard key={c.id} course={c} showProgress />)}</div>
        ) : (
          <EmptyState icon={BookOpen} title="Your learning journey starts here" text="Explore the catalogue and enrol in your first course." actionLabel="Browse courses" to="/catalogue" />
        )}
      </section>

      <section className="bottom-grid">
        <div className="panel">
          <div className="panel-heading"><div><h3>Learning overview</h3><p className="muted">Your completed lessons at a glance</p></div><span className="soft-pill">This account</span></div>
          <div className="overview-number">{done}<span> / {totalLessons} lessons</span></div>
          <ProgressBar value={overall} large label="Overall progress" />
          <p className="small-muted">{overall}% of your enrolled lesson content completed</p>
        </div>
        <div className="panel quick-panel">
          <div className="panel-heading"><div><h3>Recent quiz results</h3><p className="muted">Your latest knowledge checks</p></div></div>
          {attempts.length ? attempts.slice(0, 3).map(c => (
            <Link key={c.id} to={`/quiz/${c.id}`} className="quick-link">
              <span className="quick-icon"><Trophy size={17} /></span>
              <span><strong>{c.title}</strong><small>{quizResults[c.id].score}/{quizResults[c.id].total} · best {quizResults[c.id].best}%</small></span>
              <ArrowRight size={16} />
            </Link>
          )) : (
            <Link to="/catalogue" className="quick-link">
              <span className="quick-icon"><BookOpen size={17} /></span>
              <span><strong>Discover courses</strong><small>Finish lessons, then take a quiz</small></span>
              <ArrowRight size={16} />
            </Link>
          )}
          <Link to="/profile" className="quick-link">
            <span className="quick-icon"><Trophy size={17} /></span>
            <span><strong>Your learning profile</strong><small>Update your details</small></span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
