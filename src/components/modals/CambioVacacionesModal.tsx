import React, { useState } from 'react';
import { X, Calendar, Sun, Check, Send, Loader2, Split } from 'lucide-react';

const OPTIONS: Array<{ key: 'july' | 'august' | 'september' | 'split'; label: string; icon: React.ReactNode }> = [
  { key: 'july', label: 'Julio', icon: <Sun className="w-6 h-6" /> },
  { key: 'august', label: 'Agosto', icon: <Sun className="w-6 h-6" /> },
  { key: 'september', label: 'Septiembre', icon: <Sun className="w-6 h-6" /> },
  { key: 'split', label: 'Partidas', icon: <Split className="w-6 h-6" /> },
];

interface CambioVacacionesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMonth: string | null;
  employeeId: string;
  onSubmit: (data: { type: 'vacation_change'; requested_month: 'july' | 'august' | 'september' | 'split' }) => void;
}

export const CambioVacacionesModal: React.FC<CambioVacacionesModalProps> = ({ isOpen, onClose, currentMonth, employeeId, onSubmit }) => {
  const [selected, setSelected] = useState<'july' | 'august' | 'september' | 'split' | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitting(true);
    onSubmit({ type: 'vacation_change', requested_month: selected });
    setSubmitting(false);
    onClose();
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
              <h3 className="font-bold text-white text-sm">Cambio de Vacaciones</h3>
              <p className="text-xs text-white/70">Selecciona tu nueva opción</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-app-text mb-1">¿A qué opción deseas cambiarte?</h4>
              <p className="text-[11px] text-app-text-secondary">
                {currentMonth
                  ? `Actualmente tienes asignado <strong>${currentMonth}</strong>.`
                  : 'Selecciona la opción que deseas.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {OPTIONS.map((opt) => {
                const isCurrent = !['july', 'august', 'september'].includes(opt.key)
                  ? false
                  : currentMonth === opt.key;
                const isSelected = selected === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => !isCurrent && setSelected(opt.key)}
                    disabled={isCurrent}
                    className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all ${
                      isCurrent
                      ? 'border-primary-200 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 cursor-not-allowed opacity-60'
                          : isSelected
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 shadow-sm'
                            : 'border-app-border bg-app-card text-app-text hover:border-primary-300 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300'
                    }`}
                  >
                    <div className={`${isSelected ? 'text-primary-500' : isCurrent ? 'text-primary-400' : 'text-app-text-secondary'}`}>
                      {opt.icon}
                    </div>
                    <span className="text-sm font-bold">{opt.label}</span>
                    {isCurrent && <span className="text-[10px] font-semibold text-primary-500">Actual</span>}
                    {isSelected && <Check className="w-4 h-4 text-primary-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-app-border flex items-center justify-between shrink-0 bg-app-bg/50">
          <span className="text-[11px] text-app-text-secondary">
            {selected
              ? selected === 'split'
                ? 'Solicitar cambio a Partidas'
                : `Solicitar cambio a ${selected}`
              : 'Selecciona una opción'}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 border border-app-border hover:bg-app-bg text-app-text-secondary text-sm font-semibold rounded-xl transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selected || submitting}
              className={`inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold rounded-xl shadow-xs transition-all ${
                selected && !submitting
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
