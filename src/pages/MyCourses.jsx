import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Search } from 'lucide-react';
import { useLMS } from '../context/LMSContext';
import CourseCard from '../components/CourseCard';
import EmptyState from '../components/EmptyState';

const FILTERS = [['all', 'All'], ['progress', 'In progress'], ['completed', 'Completed']];

export default function MyCourses() {
  const { courses, enrolled, progress } = useLMS();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('recent');
  const mine = courses.filter(c => enrolled.includes(c.id));

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mine
      .filter(c => `${c.title} ${c.instructor} ${c.category}`.toLowerCase().includes(q))
      .filter(c => filter === 'all' || (filter === 'completed' ? progress(c) === 100 : progress(c) < 100))
      .sort((a, b) => sort === 'progress' ? progress(b) - progress(a) : sort === 'name' ? a.title.localeCompare(b.title)
        : enrolled.indexOf(b.id) - enrolled.indexOf(a.id));
  }, [mine, query, filter, sort, progress, enrolled]);

  return (
    <div className="page-wrap">
      <div className="page-heading">
        <div>
          <div className="eyebrow">YOUR PERSONAL LIBRARY</div>
          <h1>My courses</h1>
          <p className="muted">All the courses you've enrolled in, in one place.</p>
        </div>
        <span className="count-pill">{mine.length} enrolled</span>
      </div>

      {mine.length > 0 && (
        <div className="filter-bar">
          <label className="search-box"><Search size={18} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search my courses..." aria-label="Search my courses" />
          </label>
          <label className="filter-select">
            <select value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filter by status">
              {FILTERS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label className="filter-select">
            <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort my courses">
              <option value="recent">Recently enrolled</option><option value="progress">Highest progress</option><option value="name">Name A–Z</option>
            </select>
          </label>
        </div>
      )}

      {!mine.length
        ? <EmptyState icon={GraduationCap} title="No enrolled courses yet" text="Find a course that interests you and start learning." actionLabel="Browse catalogue" to="/catalogue" />
        : shown.length
          ? <div className="course-grid">{shown.map(c => <CourseCard key={c.id} course={c} showProgress />)}</div>
          : <EmptyState icon={Search} title="No matching courses" text="Try a different search or status filter." />}
      {mine.length > 0 && <p className="small-muted footer-link"><Link to="/catalogue" className="text-link">Browse more courses</Link></p>}
    </div>
  );
}
