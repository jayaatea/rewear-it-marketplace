
import { useState, useCallback, useEffect } from 'react';

// Toast interface to define the shape of toast notifications
export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive';
}

// Create toast store
const toasts = new Map<string, Toast>();
let listeners: Array<() => void> = [];

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function useToast() {
  const [state, setState] = useState<{
    toasts: Map<string, Toast>;
  }>({ toasts });

  useEffect(() => {
    function handleChange() {
      setState({ toasts });
    }

    listeners.push(handleChange);
    return () => {
      listeners = listeners.filter((listener) => listener !== handleChange);
    };
  }, []);

  const toast = useCallback(({ ...props }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2);
    toasts.set(id, { id, ...props });
    emitChange();

    return {
      id,
      dismiss: () => {
        toasts.delete(id);
        emitChange();
      },
    };
  }, []);

  const dismiss = useCallback((toastId?: string) => {
    if (toastId) {
      toasts.delete(toastId);
    } else {
      toasts.clear();
    }
    emitChange();
  }, []);

  return {
    toasts: Array.from(state.toasts.values()),
    toast,
    dismiss,
  };
}

export const toast = (props: Omit<Toast, 'id'>) => {
  const id = Math.random().toString(36).substring(2);
  toasts.set(id, { id, ...props });
  emitChange();
  
  return {
    id,
    dismiss: () => {
      toasts.delete(id);
      emitChange();
    },
  };
}
