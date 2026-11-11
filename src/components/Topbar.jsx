import { useState } from 'react';
import { Bell, Menu, ChevronDown, GraduationCap, ShieldCheck, UserRound, BookOpen, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLMS } from '../context/LMSContext';
import { initials } from '../utils/helpers';

export default function Topbar({ onMenu }) {
  const { role, setRole, profile, courses, enrolled, completedIds } = useLMS();
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const pending = courses.filter(course => enrolled.includes(course.id) && completedIds(course).length < course.lessons.length);

  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" aria-label="Open menu" onClick={onMenu}><Menu /></button>
      <div className="topbar-context">Learning workspace <span>/</span> <strong>{role === 'admin' ? 'Administration' : 'Student portal'}</strong></div>
      <div className="topbar-actions">
        <div className="notification-wrap">
          <button className="icon-btn notification" title="Notifications" aria-label="Open notifications" aria-expanded={showNotifications} onClick={() => setShowNotifications(v => !v)}><Bell size={19} /><i /></button>
          {showNotifications && <div className="notification-popover">
            <div className="notification-head"><strong>Notifications</strong><button className="icon-btn" aria-label="Close notifications" onClick={() => setShowNotifications(false)}><X size={16}/></button></div>
            <p>{pending.length ? `You have ${pending.length} course${pending.length === 1 ? '' : 's'} waiting for you to continue.` : 'You are all caught up. Explore a new course to keep learning.'}</p>
            <button className="notification-link" onClick={() => { setShowNotifications(false); navigate(pending.length ? '/my-courses' : '/catalogue'); }}>{pending.length ? 'Continue learning' : 'Explore courses'} →</button>
          </div>}
        </div>
        <label className="role-switch"><span>{role === 'admin' ? <ShieldCheck size={15}/> : <GraduationCap size={15}/>}</span><select aria-label="Switch demo role" value={role} onChange={e => setRole(e.target.value)}><option value="student">Student</option><option value="admin">Admin</option></select><ChevronDown size={14}/></label>
        <Link to="/profile" className="top-user" aria-label="Open profile" title="Open profile">
          <div className="avatar">{initials(profile.name)}</div>
          <div><strong>{profile.name}</strong><small>{role === 'admin' ? 'Administrator' : 'Student account'}</small></div>
          <UserRound className="top-user-arrow" size={15}/>
        </Link>
      </div>
    </header>
  );
}
