import React, { useState } from 'react';
import { LogsView } from './logs/LogsView';
import { AuthTestsView } from './tests/AuthTestsView';
import { JwtTestsView } from './tests/JwtTestsView';
import { CrudTestsView } from './tests/CrudTestsView';
import { RbacTestsView } from './tests/RbacTestsView';
import { RolesTestsView } from './tests/RolesTestsView';
import { FileText, FlaskConical, ChevronDown } from 'lucide-react';

type Tab = 'logs' | 'tests';
type TestType = 'auth' | 'jwt' | 'crud' | 'rbac' | 'roles';
type LogType = 'LOGS_AUTH' | 'LOGS_LOGOUT' | 'LOGS_USERS' | 'LOGS_EMPLOYEES';

const LOGS_TABS: { value: LogType; label: string }[] = [
  { value: 'LOGS_AUTH', label: 'Auth' },
  { value: 'LOGS_LOGOUT', label: 'Logout' },
  { value: 'LOGS_USERS', label: 'Usuarios' },
  { value: 'LOGS_EMPLOYEES', label: 'Empleados' },
];

const TESTS_TABS: { value: TestType; label: string }[] = [
  { value: 'auth', label: 'Auth' },
  { value: 'jwt', label: 'JWT' },
  { value: 'crud', label: 'CRUD' },
  { value: 'rbac', label: 'RBAC' },
  { value: 'roles', label: 'Roles' },
];

export const UtilsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('logs');
  const [selectedLogType, setSelectedLogType] = useState<LogType>('LOGS_AUTH');
  const [selectedTestType, setSelectedTestType] = useState<TestType>('auth');

  const renderLogsContent = () => (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-app-border pb-2">
        {LOGS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setSelectedLogType(tab.value)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              selectedLogType === tab.value
                ? 'bg-primary-100 text-primary-700'
                : 'text-app-text-secondary hover:text-app-text hover:bg-app-bg'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <LogsView logType={selectedLogType} />
    </div>
  );

  const renderTestsContent = () => {
    const testComponents: Record<TestType, React.ReactNode> = {
      auth: <AuthTestsView />,
      jwt: <JwtTestsView />,
      crud: <CrudTestsView />,
      rbac: <RbacTestsView />,
      roles: <RolesTestsView />,
    };

    return (
      <div className="space-y-4">
        <div className="flex gap-2 border-b border-app-border pb-2">
          {TESTS_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setSelectedTestType(tab.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                selectedTestType === tab.value
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-app-text-secondary hover:text-app-text hover:bg-app-bg'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {testComponents[selectedTestType]}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-2xl border border-app-border shadow-xs">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
              activeTab === 'logs'
                ? 'bg-slate-800 text-white'
                : 'text-app-text-secondary hover:bg-app-bg'
            }`}
          >
            <FileText className="h-4 w-4" />
            Logs
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all ${
              activeTab === 'tests'
                ? 'bg-slate-800 text-white'
                : 'text-app-text-secondary hover:bg-app-bg'
            }`}
          >
            <FlaskConical className="h-4 w-4" />
            Tests
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-app-border shadow-xs min-h-[500px]">
        {activeTab === 'logs' ? renderLogsContent() : renderTestsContent()}
      </div>
    </div>
  );
};
