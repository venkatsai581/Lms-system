import { CheckCircle2, Info } from 'lucide-react';
import { useLMS } from '../context/LMSContext';

export default function Toast() {
  const { toast } = useLMS();
  if (!toast) return null;
  return (
    <div key={toast.key} className={`toast toast-${toast.type}`} role="status" aria-live="polite">
      {toast.type === 'info' ? <Info size={16} /> : <CheckCircle2 size={16} />}
      {toast.message}
    </div>
  );
}
