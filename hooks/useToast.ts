'use client';

import { useState, useCallback } from 'react';

export interface ToastState {
  message: string;
  type: 'success' | '';
  visible: boolean;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({ message: '', type: '', visible: false });

  const showToast = useCallback((message: string, type: 'success' | '' = '') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  }, []);

  return { toast, showToast };
}
