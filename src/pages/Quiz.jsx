import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, RotateCcw, Trophy } from 'lucide-react';
import { useLMS } from '../context/LMSContext';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';

export default function Quiz() {
  const { id } = useParams();
  const { getCourse, quizResults, saveQuizResult, enrolled } = useLMS();
  const course = getCourse(id);
  const questions = course?.quiz || [];
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!course || !enrolled.includes(id)) {
    return <div className="empty-state"><h2>Quiz unavailable</h2><p>Enrol in the course to take its quiz.</p><Link to="/catalogue" className="btn btn-primary">Browse courses</Link></div>;
  }
  if (!questions.length) {
    return <div className="empty-state"><h2>No quiz yet</h2><p>This course does not have quiz questions yet.</p><Link to={`/learn/${id}`} className="btn btn-primary">Back to lessons</Link></div>;
  }

  const answered = Object.keys(answers).length;
  const score = questions.reduce((sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0), 0);
  const percentage = Math.round((score / questions.length) * 100);
  const previous = quizResults[id];

  const submit = () => { saveQuizResult(id, score, questions.length); setSubmitted(true); window.scrollTo({ top: 0 }); };
  const retake = () => { setAnswers({}); setSubmitted(false); };
  const verdict = percentage === 100 ? 'Excellent work!' : percentage >= 50 ? 'Good effort!' : 'Keep practising!';

  return (
    <div className="page-wrap quiz-page">
      <Link to={`/learn/${id}`} className="back-link"><ArrowLeft size={16} /> Back to lessons</Link>
      <div className="quiz-heading">
        <div className="eyebrow">KNOWLEDGE CHECK</div>
        <h1>{course.title} quiz</h1>
        <p className="muted">Answer each question and submit to see your result.</p>
        {previous && !submitted && <p className="small-muted">Last attempt: {previous.score}/{previous.total} ({previous.percentage}%) · Best: {previous.best}% · Attempts: {previous.attempts}</p>}
      </div>

      {submitted ? (
        <div className="panel result-panel">
          <div className="result-icon"><Trophy size={34} /></div>
          <div className="eyebrow">QUIZ COMPLETED</div>
          <h2>{verdict}</h2>
          <div className="result-score">{score}<span> / {questions.length}</span></div>
          <div className="result-track"><span style={{ width: `${percentage}%` }} /></div>
          <p className="muted">You scored {percentage}%. Best score: {quizResults[id]?.best ?? percentage}%. Your result has been saved.</p>
          <div className="result-review">
            {questions.map((q, i) => {
              const right = answers[i] === q.answer;
              return (
                <div key={i} className="review-row">
                  <span className={right ? 'correct-mark' : 'wrong-mark'}>{right ? '✓' : '×'}</span>
                  <div>
                    <strong>{q.question}</strong>
                    <small>Your answer: {q.options[answers[i]]}</small>
                    {!right && <small>Correct answer: {q.options[q.answer]}</small>}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="detail-actions center">
            <button className="btn btn-secondary" onClick={retake}><RotateCcw size={16} /> Retake quiz</button>
            <Link to={`/learn/${id}`} className="btn btn-primary">Back to course <ArrowRight size={16} /></Link>
          </div>
        </div>
      ) : (
        <div className="quiz-content">
          <ProgressBar value={(answered / questions.length) * 100} label="Questions answered" />
          <div className="quiz-spacer" />
          {questions.map((q, i) => (
            <QuestionCard key={i} index={i} total={questions.length} question={q} selected={answers[i]}
              onSelect={j => setAnswers(old => ({ ...old, [i]: j }))} />
          ))}
          <div className="quiz-submit-row">
            <span className="muted">{answered} of {questions.length} answered</span>
            <button className="btn btn-primary" disabled={answered !== questions.length} onClick={submit}>Submit answers <ArrowRight size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
