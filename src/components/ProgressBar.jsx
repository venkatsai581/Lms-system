export default function ProgressBar({ value = 0, large = false, label }) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`progress-track ${large ? 'large' : ''}`}
      role="progressbar"
      aria-valuenow={safe}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || 'Progress'}
    >
      <span style={{ width: `${safe}%` }} />
    </div>
  );
}
