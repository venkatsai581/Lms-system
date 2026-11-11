import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLMS } from '../context/LMSContext';
import LessonList from '../components/LessonList';
import LessonContent from '../components/LessonContent';

export default function LessonViewer() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { getCourse, completedIds, toggleComplete, enrolled } = useLMS();
  const course = getCourse(id);

  if (!course || !enrolled.includes(id)) {
    return (
      <div className="empty-state"><h2>Course unavailable</h2><p>Enrol in this course to access its lessons.</p>
        <Link className="btn btn-primary" to={course ? `/courses/${id}` : '/catalogue'}>{course ? 'View course' : 'Browse courses'}</Link></div>
    );
  }

  const lessons = course.lessons;
  if (!lessons.length) return <div className="empty-state"><h2>No lessons available</h2></div>;

  const requested = lessons.findIndex(l => l.id === params.get('lesson'));
  const done = completedIds(course);
  // With no explicit lesson, resume at the first lesson that is not complete yet.
  const resume = lessons.findIndex(l => !done.includes(l.id));
  const index = requested >= 0 ? requested : resume >= 0 ? resume : 0;
  const lesson = lessons[index];
  const isDone = done.includes(lesson.id);
  const allDone = done.length === lessons.length;
  const hasQuiz = (course.quiz || []).length > 0;
  const go = i => navigate(`/learn/${id}?lesson=${lessons[i].id}`);

  const onToggle = () => {
    toggleComplete(id, lesson.id);
    // Completing a lesson moves on to the next one automatically.
    if (!isDone && index < lessons.length - 1) go(index + 1);
  };

  return (
    <div className="page-wrap lesson-page">
      <Link to={`/courses/${id}`} className="back-link"><ArrowLeft size={16} /> {course.title}</Link>
      <div className="lesson-layout">
        <aside className="panel lesson-list-panel">
          <LessonList lessons={lessons} doneIds={done} activeIndex={index} onSelect={go} />
        </aside>
        <div>
          <LessonContent
            lesson={lesson} courseId={course.id} index={index} total={lessons.length} isDone={isDone}
            onPrev={() => go(index - 1)} onNext={() => go(index + 1)} onToggle={onToggle}
          />
          {allDone && (
            <div className="completion-banner">
              <CheckCircle2 /> Course lessons completed!
              {hasQuiz && <Link to={`/quiz/${id}`}>Take the course quiz <ArrowRight size={14} /></Link>}
            </div>
          )}
          {!allDone && hasQuiz && (
            <p className="small-muted quiz-hint">Complete every lesson to unlock the final quiz, or <Link className="text-link inline" to={`/quiz/${id}`}>try it now</Link>.</p>
          )}
        </div>
      </div>
    </div>
  );
}
