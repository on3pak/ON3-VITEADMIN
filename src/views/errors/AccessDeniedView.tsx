import React from 'react';
import { ShieldOff, ArrowLeft, Home } from 'lucide-react';

interface AccessDeniedViewProps {
  onBack?: () => void;
  message?: string;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({ 
  onBack, 
  message = 'No tienes permiso para acceder a esta sección.' 
}) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-500 mb-6">
          <ShieldOff className="h-10 w-10" />
        </div>
        
        <h2 className="text-2xl font-bold text-app-text mb-3">Acceso Denegado</h2>
        
        <p className="text-app-text-secondary mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-app-bg text-app-text font-medium rounded-xl hover:bg-app-border transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </button>
          )}
          
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
          >
            <Home className="h-4 w-4" />
            Ir al Inicio
          </button>
        </div>
      </div>
    </div>
  );
};
