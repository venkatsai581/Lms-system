import { Check, ChevronLeft, ChevronRight, PlayCircle } from 'lucide-react';

// Reusable lesson viewer body with previous / complete / next controls.
const VIDEO_BY_COURSE = {
  'react-fundamentals': 'Ke90Tje7VS0',
  'javascript-zero': 'hdI2bqOjy3c',
  'python-core': 'kqtD5dpn9C8',
  'ui-design': 'FTFaQWZBqQ8',
  'data-analytics': 'ua-CiDNNj30'
};

export default function LessonContent({ lesson, courseId, index, total, isDone, onPrev, onNext, onToggle }) {
  const videoId = lesson.videoId || VIDEO_BY_COURSE[courseId];
  return (
    <section className="lesson-main">
      <div className="lesson-video-placeholder">
        {videoId ? <iframe title={`${lesson.title} video lesson`} src={`https://www.youtube-nocookie.com/embed/${videoId}`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /> : <div className="video-fallback"><PlayCircle size={42}/><strong>Video lesson</strong><span>Read the lesson notes below and mark complete when ready.</span></div>}
      </div>
      <div className="lesson-content">
        <div className="eyebrow">LESSON {index + 1} OF {total}</div>
        <h1>{lesson.title}</h1>
        <p className="lesson-description">{lesson.content}</p>
        <div className="lesson-tip">
          <strong>Learning note</strong>
          <p>Take a moment to understand the key idea, then mark the lesson complete when you are ready to move on.</p>
        </div>
        <div className="lesson-controls">
          <button className="btn btn-secondary" disabled={index <= 0} onClick={onPrev}>
            <ChevronLeft size={17} /> Previous
          </button>
          <button className={`btn ${isDone ? 'btn-success' : 'btn-primary'}`} onClick={onToggle}>
            {isDone ? 'Completed (undo)' : 'Mark complete'} <Check size={16} />
          </button>
          <button className="btn btn-secondary" disabled={index >= total - 1} onClick={onNext}>
            Next <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}
