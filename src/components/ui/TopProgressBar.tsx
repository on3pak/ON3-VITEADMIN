import React from 'react';
import { cn } from '../../lib/utils';

interface TopProgressBarProps {
  loading: boolean;
}

export const TopProgressBar: React.FC<TopProgressBarProps> = ({ loading }) => (
  <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5">
    <div
      className={cn(
        'h-full bg-gradient-to-r from-primary-500 via-sky-400 to-primary-500 transition-all duration-500',
        loading ? 'w-full animate-progress' : 'w-0 opacity-0'
      )}
    />
  </div>
);
