'use client';

import type { ToastState } from '@/hooks/useToast';

export default function Toast({ toast }: { toast: ToastState }) {
  return (
    <div className={`toast ${toast.visible ? 'show' : ''} ${toast.type}`}>
      {toast.message}
    </div>
  );
}
