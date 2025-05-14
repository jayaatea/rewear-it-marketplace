
import { Toast, ToastActionElement, ToastProps } from '@/components/ui/toast';
import { useToast as useToastFromUI } from '@/components/ui/use-toast';

type ToastData = Omit<ToastProps, 'children'> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

export const useToast = () => {
  const { toast: toastFn } = useToastFromUI();
  
  const toast = (props: ToastData) => {
    toastFn(props);
  };
  
  return { toast };
};

export const toast = (props: ToastData) => {
  const { toast: toastFn } = useToastFromUI();
  toastFn(props);
};
