import { useContext } from 'react';
import { ToastContext } from '@/app/context/ToastContext';

export const useToastApi = () => {
  const context = useContext(ToastContext);

  if (!context)
    throw new Error('useToastApi must be used within a MessageProvider');

  return context.messageApi;
};
