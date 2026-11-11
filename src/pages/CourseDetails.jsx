import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Circle, Clock3, Star, Trophy, Users } from 'lucide-react';
import { useLMS } from '../context/LMSContext';
import ProgressBar from '../components/ProgressBar';
import { categorySymbol, formatPrice, initials } from '../utils/helpers';

export default function CourseDetails() {
  const { id } = useParams();
  const { getCourse, enrolled, enroll, unenroll, progress, completedIds, quizResults } = useLMS();
  const course = getCourse(id);

  if (!course) {
    return (
      <div className="empty-state"><h2>Course not found</h2><Link to="/catalogue" className="btn btn-primary">Back to catalogue</Link></div>
    );
  }

  const joined = enrolled.includes(id);
  const done = completedIds(course);
  const value = progress(course);
  const hasQuiz = (course.quiz || []).length > 0;
  const result = quizResults[id];

  return (
    <div className="page-wrap">
      <Link to="/catalogue" className="back-link"><ArrowLeft size={16} /> Back to catalogue</Link>
      <div className="detail-hero">
        <div className="detail-copy">
          <span className="eyebrow">{course.category} · {course.level}</span>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <div className="detail-meta">
            <span><Star size={15} fill="currentColor" />{course.rating} rating</span>
            <span><Users size={15} />{course.students.toLocaleString()} learners</span>
            <span><Clock3 size={15} />{course.duration}</span>
          </div>
          {joined && <div className="detail-progress"><div className="progress-head"><span>Your progress</span><strong>{value}%</strong></div><ProgressBar value={value} label="Course progress" /></div>}
          <div className="detail-actions">
            {joined ? (
              <>
                <Link className="btn btn-primary" to={`/learn/${id}`}>{value > 0 ? 'Continue learning' : 'Start learning'} <ArrowRight size={16} /></Link>
                <button className="btn btn-secondary" onClick={() => unenroll(id, course.title)}>Unenrol</button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={() => enroll(id, course.title)}>Enrol in course <ArrowRight size={16} /></button>
            )}
            <span className="price-label">{formatPrice(course.price)}</span>
          </div>
        </div>
        <div className="detail-art" style={{ background: course.color }}>
          {course.image && <img src={course.image} alt={`${course.title} course`} onError={e => { e.currentTarget.style.display = 'none'; }} />}
          <span>{categorySymbol(course.category)}</span><small>LEARN · PRACTICE · GROW</small>
        </div>
      </div>

      <div className="detail-columns">
        <section className="panel curriculum">
          <div className="panel-heading">
            <div><h2>Course curriculum</h2><p className="muted">{course.lessons.length} lessons · Self-paced learning</p></div>
            {joined && <span className="soft-pill">{value}% complete</span>}
          </div>
          {course.lessons.map((lesson, index) => {
            const isDone = done.includes(lesson.id);
            const row = (
              <>
                <span className="lesson-index">{index + 1}</span>
                <div><strong>{lesson.title}</strong><small>{lesson.duration}</small></div>
                {joined && (isDone ? <CheckCircle2 size={17} className="lesson-check" /> : <Circle size={17} className="lesson-pending" />)}
              </>
            );
            return joined
              ? <Link className="curriculum-row linked" key={lesson.id} to={`/learn/${id}?lesson=${lesson.id}`}>{row}</Link>
              : <div className="curriculum-row" key={lesson.id}>{row}</div>;
          })}
          {hasQuiz && joined && (
            <Link className="curriculum-row linked quiz-row" to={`/quiz/${id}`}>
              <span className="lesson-index"><Trophy size={14} /></span>
              <div><strong>Course quiz</strong><small>{course.quiz.length} questions{result ? ` · best score ${result.best}%` : ''}</small></div>
              <ArrowRight size={16} />
            </Link>
          )}
        </section>

        <aside className="panel instructor-panel">
          <div className="eyebrow">YOUR INSTRUCTOR</div>
          <div className="instructor-avatar">{initials(course.instructor)}</div>
          <h3>{course.instructor}</h3>
          <p className="muted">{course.instructorRole}</p>
          <p className="instructor-bio">{course.instructorBio}</p>
          <div className="instructor-foot"><BookOpen size={16} />{course.lessons.length} learning modules</div>
          <Link className="text-link" to={joined ? `/learn/${id}` : '/catalogue'}>{joined ? 'Go to lessons' : 'Explore more courses'} <ArrowRight size={15} /></Link>
        </aside>
      </div>
    </div>
  );
}
