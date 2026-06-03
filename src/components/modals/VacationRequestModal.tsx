import React, { useState, useMemo } from 'react';
import { X, Calendar, Sun, Check, ChevronLeft, ChevronRight, Send, Loader2 } from 'lucide-react';

const MONTHS: Array<{ key: 'JULY' | 'AUGUST' | 'SEPTEMBER'; label: string }> = [
  { key: 'JULY', label: 'Julio' },
  { key: 'AUGUST', label: 'Agosto' },
  { key: 'SEPTEMBER', label: 'Septiembre' },
];

type TabType = 'MONTH_CHANGE' | 'FREE_DAYS';

function getDaysRemainingInYear(): Date[] {
  const today = new Date();
  const days: Date[] = [];
  const d = new Date(today);
  const end = new Date(today.getFullYear(), 11, 31);
  while (d <= end) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
}

function isWeekend(d: Date): boolean {
  return d.getDay() === 0 || d.getDay() === 6;
}

function getMonthDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: (Date | null)[] = [];
  const startPad = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
  return days;
}

const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

interface VacationRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMonth: string | null;
  employeeId: string;
  onSubmit: (data: { type: 'MONTH_CHANGE' | 'FREE_DAYS'; requested_month?: 'JULY' | 'AUGUST' | 'SEPTEMBER'; requested_days?: string[] }) => void;
}

export const VacationRequestModal: React.FC<VacationRequestModalProps> = ({ isOpen, onClose, currentMonth, employeeId, onSubmit }) => {
  const [tab, setTab] = useState<TabType>('FREE_DAYS');
  const [selectedMonth, setSelectedMonth] = useState<'JULY' | 'AUGUST' | 'SEPTEMBER' | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [submitting, setSubmitting] = useState(false);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const remainingDays = useMemo(() => getDaysRemainingInYear(), []);

  const toggleDay = (dateStr: string) => {
    setSelectedDays((prev) =>
      prev.includes(dateStr) ? prev.filter((d) => d !== dateStr) : [...prev, dateStr]
    );
  };

  const handleSubmit = () => {
    setSubmitting(true);
    if (tab === 'MONTH_CHANGE' && selectedMonth) {
      onSubmit({ type: 'MONTH_CHANGE', requested_month: selectedMonth });
    } else if (tab === 'FREE_DAYS' && selectedDays.length > 0) {
      onSubmit({ type: 'FREE_DAYS', requested_days: selectedDays });
    }
    setSubmitting(false);
    onClose();
  };

  const canSubmit = tab === 'MONTH_CHANGE' ? !!selectedMonth : selectedDays.length > 0;

  const monthDays = useMemo(() => getMonthDays(calendarYear, calendarMonth), [calendarYear, calendarMonth]);

  const goToPrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-sidebar/80 backdrop-blur-xs">
      <div className="bg-app-card rounded-2xl shadow-xl w-full max-w-lg border border-app-card-border overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/20 text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Solicitar Vacaciones</h3>
              <p className="text-xs text-white/70">Gestiona tus días y meses de vacaciones</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex border-b border-app-border shrink-0">
          <button
            onClick={() => setTab('FREE_DAYS')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
              tab === 'FREE_DAYS'
                ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/30'
                : 'text-app-text-secondary hover:text-app-text hover:bg-app-bg'
            }`}
          >
            Solicitar Días
          </button>
          <button
            onClick={() => setTab('MONTH_CHANGE')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
              tab === 'MONTH_CHANGE'
                ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50/30'
                : 'text-app-text-secondary hover:text-app-text hover:bg-app-bg'
            }`}
          >
            Cambiar Mes
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === 'FREE_DAYS' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-app-text mb-1">Selecciona los días que deseas solicitar</h4>
                <p className="text-[11px] text-app-text-secondary">Días disponibles hasta el 31 de diciembre. Toca para seleccionar/deseleccionar.</p>
              </div>

              {selectedDays.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-primary-50 rounded-xl border border-primary-100">
                  <Check className="w-4 h-4 text-primary-600 shrink-0" />
                  <span className="text-xs font-semibold text-primary-700">
                    {selectedDays.length} día{selectedDays.length !== 1 ? 's' : ''} seleccionado{selectedDays.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}

              <div className="bg-white rounded-xl border border-app-border overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-app-bg border-b border-app-border">
                  <button onClick={goToPrevMonth} className="p-1 rounded-lg hover:bg-white text-app-text-secondary hover:text-app-text">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold text-app-text">
                    {MONTH_NAMES[calendarMonth]} {calendarYear}
                  </span>
                  <button onClick={goToNextMonth} className="p-1 rounded-lg hover:bg-white text-app-text-secondary hover:text-app-text">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-px bg-app-border">
                  {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'].map((day) => (
                    <div key={day} className="px-1.5 py-1.5 text-[10px] font-bold text-app-text-secondary text-center bg-app-bg">
                      {day}
                    </div>
                  ))}
                  {monthDays.map((d, i) => {
                    if (!d) return <div key={`empty-${i}`} className="bg-white" />;
                    const dateStr = d.toISOString().split('T')[0];
                    const isPast = d < today;
                    const isWeekendDay = isWeekend(d);
                    const isSelected = selectedDays.includes(dateStr);
                    const isToday = d.toDateString() === today.toDateString();

                    return (
                      <button
                        key={dateStr}
                        onClick={() => !isPast && !isWeekendDay && toggleDay(dateStr)}
                        disabled={isPast || isWeekendDay}
                        className={`relative px-1 py-1.5 text-xs text-center transition-all ${
                          isSelected
                            ? 'bg-primary-500 text-white font-bold shadow-sm z-10'
                            : isPast
                              ? 'text-gray-200 cursor-not-allowed'
                              : isWeekendDay
                                ? 'text-gray-200 cursor-not-allowed'
                                : 'text-app-text hover:bg-primary-50 hover:text-primary-700 cursor-pointer'
                        } ${isToday && !isSelected ? 'ring-1 ring-primary-300' : ''}`}
                      >
                        {d.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {remainingDays.length > 0 && (
                <p className="text-[11px] text-app-text-secondary text-center">
                  Quedan <span className="font-bold text-primary-600">{remainingDays.length}</span> días hasta fin de año
                </p>
              )}
            </div>
          )}

          {tab === 'MONTH_CHANGE' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-app-text mb-1">Solicitar cambio de mes vacacional</h4>
                <p className="text-[11px] text-app-text-secondary">
                  {currentMonth
                    ? `Actualmente tienes asignado <strong>${currentMonth}</strong>. Selecciona el mes al que deseas cambiarte.`
                    : 'Selecciona el mes que deseas para tus vacaciones.'}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {MONTHS.map((m) => {
                  const isCurrent = currentMonth === m.key;
                  const isSelected = selectedMonth === m.key;
                  return (
                    <button
                      key={m.key}
                      onClick={() => !isCurrent && setSelectedMonth(m.key)}
                      disabled={isCurrent}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        isCurrent
                          ? 'border-primary-200 bg-primary-50 text-primary-600 cursor-not-allowed opacity-60'
                          : isSelected
                            ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                            : 'border-app-border bg-white text-app-text hover:border-primary-300 hover:bg-primary-50/50 hover:text-primary-700'
                      }`}
                    >
                      <Sun className={`w-6 h-6 ${isSelected ? 'text-primary-500' : isCurrent ? 'text-primary-400' : 'text-app-text-secondary'}`} />
                      <span className="text-sm font-bold">{m.label}</span>
                      {isCurrent && <span className="text-[10px] font-semibold text-primary-500">Actual</span>}
                      {isSelected && <Check className="w-4 h-4 text-primary-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-app-border flex items-center justify-between shrink-0 bg-app-bg/50">
          <span className="text-[11px] text-app-text-secondary">
            {tab === 'FREE_DAYS'
              ? `${selectedDays.length} día${selectedDays.length !== 1 ? 's' : ''} seleccionado${selectedDays.length !== 1 ? 's' : ''}`
              : selectedMonth
                ? `Solicitar cambio a ${selectedMonth}`
                : 'Selecciona una opción'}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 border border-app-border hover:bg-app-bg text-app-text-secondary text-sm font-semibold rounded-xl transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className={`inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold rounded-xl shadow-xs transition-all ${
                canSubmit && !submitting
                  ? 'text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 active:scale-95'
                  : 'text-app-text-secondary bg-app-bg cursor-not-allowed'
              }`}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Enviar Solicitud
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
