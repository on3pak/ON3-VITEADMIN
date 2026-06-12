import React, { useState, useMemo } from 'react';
import { X, Calendar, Check, ChevronLeft, ChevronRight, Send, Loader2 } from 'lucide-react';

function getMonthDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: (Date | null)[] = [];
  const startPad = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
  return days;
}

function isWeekend(d: Date): boolean {
  return d.getDay() === 0 || d.getDay() === 6;
}

const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

interface SolicitarDiasModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  disableWeekends: boolean;
  onSubmit: (data: { type: 'FREE_DAYS'; requested_days: string[] }) => void;
}

export const SolicitarDiasModal: React.FC<SolicitarDiasModalProps> = ({ isOpen, onClose, employeeId, disableWeekends, onSubmit }) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [submitting, setSubmitting] = useState(false);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const toggleDay = (dateStr: string) => {
    setSelectedDays((prev) =>
      prev.includes(dateStr) ? prev.filter((d) => d !== dateStr) : [...prev, dateStr]
    );
  };

  const handleSubmit = () => {
    if (selectedDays.length === 0) return;
    setSubmitting(true);
    onSubmit({ type: 'FREE_DAYS', requested_days: selectedDays });
    setSubmitting(false);
    onClose();
  };

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

  const isPast = (d: Date) => {
    const clone = new Date(d);
    clone.setHours(0, 0, 0, 0);
    return clone < today;
  };

  const isDisabled = (d: Date) => {
    if (isPast(d)) return true;
    if (disableWeekends && isWeekend(d)) return true;
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-sidebar/80 backdrop-blur-xs">
      <div className="bg-app-card rounded-2xl shadow-xl w-full max-w-lg border border-app-card-border overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/20 text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Solicitar Días</h3>
              <p className="text-xs text-white/70">Selecciona los días que deseas solicitar</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-app-text mb-1">Días disponibles hasta el 31 de diciembre</h4>
              <p className="text-[11px] text-app-text-secondary">
                {disableWeekends
                  ? 'Los fines de semana no están disponibles para tu jornada laboral.'
                  : 'Todos los días están disponibles, incluidos fines de semana.'}
              </p>
            </div>

            {selectedDays.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
                <Check className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
                <span className="text-xs font-semibold text-primary-700 dark:text-primary-300">
                  {selectedDays.length} día{selectedDays.length !== 1 ? 's' : ''} seleccionado{selectedDays.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}

            <div className="bg-app-card rounded-xl border border-app-border overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-app-bg border-b border-app-border">
                <button onClick={goToPrevMonth} className="p-1 rounded-lg hover:bg-app-card text-app-text-secondary hover:text-app-text">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-app-text">
                  {MONTH_NAMES[calendarMonth]} {calendarYear}
                </span>
                <button onClick={goToNextMonth} className="p-1 rounded-lg hover:bg-app-card text-app-text-secondary hover:text-app-text">
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
                  if (!d) return <div key={`empty-${i}`} className="bg-app-card" />;
                  const dateStr = d.toISOString().split('T')[0];
                  const past = isPast(d);
                  const disabled = isDisabled(d);
                  const isSelected = selectedDays.includes(dateStr);
                  const isToday = d.toDateString() === today.toDateString();

                  return (
                    <button
                      key={dateStr}
                      onClick={() => !disabled && toggleDay(dateStr)}
                      disabled={disabled}
                      className={`relative px-1 py-1.5 text-xs text-center transition-all ${
                        isSelected
                          ? 'bg-primary-500 text-white font-bold shadow-sm z-10'
                          : disabled
                            ? 'text-app-text-secondary/20 cursor-not-allowed'
                            : 'text-app-text hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 cursor-pointer'
                      } ${isToday && !isSelected ? 'ring-1 ring-primary-300' : ''}`}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-app-border flex items-center justify-between shrink-0 bg-app-bg/50">
          <span className="text-[11px] text-app-text-secondary">
            {selectedDays.length > 0
              ? `${selectedDays.length} día${selectedDays.length !== 1 ? 's' : ''} seleccionado${selectedDays.length !== 1 ? 's' : ''}`
              : 'Selecciona los días'}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 border border-app-border hover:bg-app-bg text-app-text-secondary text-sm font-semibold rounded-xl transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={selectedDays.length === 0 || submitting}
              className={`inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold rounded-xl shadow-xs transition-all ${
                selectedDays.length > 0 && !submitting
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
