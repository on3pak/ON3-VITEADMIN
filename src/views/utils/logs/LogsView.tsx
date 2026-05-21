import React from 'react';

type LogType = 'LOGS_AUTH' | 'LOGS_LOGOUT' | 'LOGS_USERS' | 'LOGS_EMPLOYEES';

interface LogsViewProps {
  logType: LogType;
}

export const LogsView: React.FC<LogsViewProps> = ({ logType }) => {
  const getLogTitle = (type: LogType) => {
    switch (type) {
      case 'LOGS_AUTH':
        return 'Logs de Autenticación';
      case 'LOGS_LOGOUT':
        return 'Logs de Cierre de Sesión';
      case 'LOGS_USERS':
        return 'Logs de Usuarios';
      case 'LOGS_EMPLOYEES':
        return 'Logs de Empleados';
      default:
        return 'Logs';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-app-text">{getLogTitle(logType)}</h3>
      </div>

      <div className="text-center py-12 text-app-text-secondary">
        <p className="text-sm">No hay logs disponibles para {getLogTitle(logType)}</p>
      </div>
    </div>
  );
};