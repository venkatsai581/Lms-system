import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Toast from '../components/Toast';
import ScrollToTop from '../components/ScrollToTop';

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="app-shell">
      <ScrollToTop />
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="main-shell">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="page-content"><Outlet /></main>
      </div>
      <Toast />
    </div>
  );
}
