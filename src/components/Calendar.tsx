import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CircleCheckBig } from 'lucide-react';
import { cn } from '../utils/cn';

interface CalendarProps {
  markedDates?: Set<string>;
  onDayClick?: (dateStr: string) => void;
  className?: string;
}

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAY_NAMES = ['L','M','X','J','V','S','D'];

function getTodayDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function padLeft(n: number): string {
  return String(n).padStart(2, '0');
}

export const Calendar: React.FC<CalendarProps> = ({ markedDates, onDayClick, className }) => {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let i = 1; i <= totalDays; i++) days.push(i);

  const todayStr = getTodayDateString();

  const goPrevMonth = () => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const goNextMonth = () => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between bg-app-card rounded-xl border border-app-card-border px-4 py-3">
        <button onClick={goPrevMonth} className="p-1.5 hover:bg-app-bg rounded-lg transition-colors">
          <ChevronLeft className="h-4 w-4 text-app-text" />
        </button>
        <span className="text-sm font-semibold text-app-text">
          {MONTHS[month]} {year}
        </span>
        <button onClick={goNextMonth} className="p-1.5 hover:bg-app-bg rounded-lg transition-colors">
          <ChevronRight className="h-4 w-4 text-app-text" />
        </button>
      </div>

      <div className="bg-app-card rounded-xl border border-app-card-border overflow-hidden">
        <div className="grid grid-cols-7">
          {DAY_NAMES.map((d) => (
            <div key={d} className="text-center text-[11px] font-semibold text-app-text-secondary py-2 bg-app-bg border-b border-app-border">
              {d}
            </div>
          ))}
          {days.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="aspect-square" />;
            }
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${padLeft(day)}`;
            const isMarked = markedDates?.has(dateStr);
            const isToday = dateStr === todayStr;

            return (
              <button
                key={dateStr}
                onClick={() => isMarked && onDayClick?.(dateStr)}
                disabled={!isMarked}
                className={cn(
                  'aspect-square flex flex-col items-center justify-center text-xs relative transition-colors',
                  isToday && 'ring-2 ring-primary-500 ring-inset rounded-md',
                  isMarked ? 'cursor-pointer hover:bg-primary-50' : 'cursor-default',
                  !isMarked && dateStr < todayStr && 'text-app-text-secondary/30',
                  !isMarked && dateStr >= todayStr && 'text-app-text-secondary/50',
                )}
              >
                <span className={cn('text-sm font-medium', isMarked && 'text-app-text')}>
                  {day}
                </span>
                {isMarked && (
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <CircleCheckBig className="h-3 w-3 text-emerald-500" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
