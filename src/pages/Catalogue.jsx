import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import EmptyState from '../components/EmptyState';
import { useLMS } from '../context/LMSContext';

const ALL = 'All categories';

export default function Catalogue() {
  const { courses } = useLMS();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(ALL);
  const [level, setLevel] = useState('All levels');
  const [sort, setSort] = useState('popular');
  const categories = [ALL, ...new Set(courses.map(c => c.category))];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses
      .filter(c => (category === ALL || c.category === category)
        && (level === 'All levels' || c.level === level)
        && `${c.title} ${c.instructor} ${c.category} ${c.description}`.toLowerCase().includes(q))
      .sort((a, b) => {
        if (sort === 'rating') return b.rating - a.rating;
        if (sort === 'name') return a.title.localeCompare(b.title);
        if (sort === 'price-low') return a.price - b.price;
        return b.students - a.students;
      });
  }, [courses, category, level, query, sort]);

  const clear = () => { setQuery(''); setCategory(ALL); setLevel('All levels'); };

  return (
    <div className="page-wrap">
      <div className="page-heading">
        <div>
          <div className="eyebrow">LEARN SOMETHING NEW</div>
          <h1>Course catalogue</h1>
          <p className="muted">Explore expert-led courses and build skills at your own pace.</p>
        </div>
        <span className="count-pill">{filtered.length} of {courses.length} courses</span>
      </div>

      <div className="filter-bar">
        <label className="search-box"><Search size={18} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search courses or instructors..." aria-label="Search courses" />
        </label>
        <label className="filter-select"><SlidersHorizontal size={16} />
          <select value={category} onChange={e => setCategory(e.target.value)} aria-label="Category filter">{categories.map(c => <option key={c}>{c}</option>)}</select>
        </label>
        <label className="filter-select">
          <select value={level} onChange={e => setLevel(e.target.value)} aria-label="Level filter">
            <option>All levels</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option>
          </select>
        </label>
        <label className="filter-select">
          <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort courses">
            <option value="popular">Most popular</option><option value="rating">Top rated</option>
            <option value="name">Name A–Z</option><option value="price-low">Price: low to high</option>
          </select>
        </label>
      </div>

      <div className="chip-row" role="group" aria-label="Quick category filters">
        {categories.map(c => (
          <button key={c} className={`chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>

      {filtered.length
        ? <div className="course-grid">{filtered.map(c => <CourseCard key={c.id} course={c} />)}</div>
        : <EmptyState icon={Search} title="No courses found" text="Try another keyword or clear your filters." actionLabel="Clear filters" onAction={clear} />}
    </div>
  );
}
