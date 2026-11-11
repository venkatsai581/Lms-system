import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock3, Star, Users } from 'lucide-react';
import { useLMS } from '../context/LMSContext';
import ProgressBar from './ProgressBar';
import { categorySymbol, formatPrice } from '../utils/helpers';

export default function CourseCard({ course, showProgress = false }) {
  const { enrolled, progress, enroll } = useLMS();
  const isEnrolled = enrolled.includes(course.id);
  const value = progress(course);

  return (
    <article className="course-card">
      <Link to={`/courses/${course.id}`} className="course-art" style={{ background: course.color || '#e0e7ff' }}>
        <img className="course-cover-image" src={course.image || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop&q=85`} alt={`${course.title} course cover`} loading="lazy" onError={e => { e.currentTarget.style.display = 'none'; }} /><span className="course-art-shade"/><span className="course-art-tag">{course.category}</span>
        <span className="course-art-symbol">{categorySymbol(course.category)}</span>
        <span className="course-art-level">{course.level}</span>
      </Link>
      <div className="course-card-body">
        <div className="course-meta">
          <span>{formatPrice(course.price)}</span>
          <span className="rating"><Star size={13} fill="currentColor" />{course.rating}</span>
        </div>
        <Link to={`/courses/${course.id}`} className="course-title">{course.title}</Link>
        <p className="course-instructor">By {course.instructor}</p>
        <div className="course-stats">
          <span><Clock3 size={14} />{course.duration}</span>
          <span><Users size={14} />{course.students.toLocaleString()}</span>
        </div>

        {isEnrolled && (showProgress || value > 0) && (
          <>
            <div className="progress-head"><span>Course progress</span><strong>{value}%</strong></div>
            <ProgressBar value={value} label={`${course.title} progress`} />
          </>
        )}

        {isEnrolled ? (
          <Link className="card-action" to={`/learn/${course.id}`}>
            {value === 100 ? 'Review course' : value > 0 ? 'Continue learning' : 'Start learning'} <ArrowUpRight size={15} />
          </Link>
        ) : (
          <div className="card-actions-row">
            <Link className="card-action" to={`/courses/${course.id}`}>Details <ArrowUpRight size={15} /></Link>
            <button className="btn btn-primary btn-sm" onClick={() => enroll(course.id, course.title)}>Enrol</button>
          </div>
        )}
      </div>
    </article>
  );
}
