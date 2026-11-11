import { CheckCircle2, Circle } from 'lucide-react';
import ProgressBar from './ProgressBar';

// Reusable lesson sidebar: shows every lesson, completion state and the active lesson.
export default function LessonList({ lessons, doneIds, activeIndex, onSelect }) {
  return (
    <>
      <div className="lesson-list-title">
        <div><span className="eyebrow">COURSE CONTENT</span><h3>Lessons</h3></div>
        <span className="soft-pill">{doneIds.length}/{lessons.length}</span>
      </div>
      <ProgressBar value={lessons.length ? (doneIds.length / lessons.length) * 100 : 0} label="Lesson progress" />
      {lessons.map((item, i) => (
        <button
          key={item.id}
          className={`lesson-nav-item ${i === activeIndex ? 'selected' : ''}`}
          onClick={() => onSelect(i)}
          aria-current={i === activeIndex ? 'true' : undefined}
        >
          <span className={`lesson-nav-status ${doneIds.includes(item.id) ? 'is-done' : ''}`}>
            {doneIds.includes(item.id) ? <CheckCircle2 size={17} /> : <Circle size={17} />}
          </span>
          <span><strong>{i + 1}. {item.title}</strong><small>{item.duration}</small></span>
        </button>
      ))}
    </>
  );
}
