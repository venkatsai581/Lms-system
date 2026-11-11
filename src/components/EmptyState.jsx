import { Link } from 'react-router-dom';

export default function EmptyState({ icon: Icon, title, text, actionLabel, to, onAction }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={30} />}
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {actionLabel && to && <Link className="btn btn-primary" to={to}>{actionLabel}</Link>}
      {actionLabel && onAction && <button className="btn btn-secondary" onClick={onAction}>{actionLabel}</button>}
    </div>
  );
}
