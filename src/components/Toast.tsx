import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useAuth();

  if (!toast) return null;

  const { message, type } = toast;

  const config = {
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-200',
      icon: <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      badge: 'bg-emerald-600',
    },
    error: {
      bg: 'bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-200',
      icon: <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />,
      badge: 'bg-rose-600',
    },
    info: {
      bg: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
      icon: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      badge: 'bg-blue-600',
    },
  };

  const current = config[type] || config.info;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md animate-fade-in-up">
      <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md ${current.bg}`}>
        <div className="flex-shrink-0 mt-0.5">
          {current.icon}
        </div>
        <div className="flex-1 text-sm font-medium leading-relaxed">
          {message}
        </div>
      </div>
    </div>
  );
};
