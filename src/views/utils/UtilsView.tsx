import React, { useState } from 'react';
import { LogsView } from './logs/LogsView';
import { AuthTestsView } from './tests/AuthTestsView';
import { JwtTestsView } from './tests/JwtTestsView';
import { CrudTestsView } from './tests/CrudTestsView';
import { RbacTestsView } from './tests/RbacTestsView';
import { RolesTestsView } from './tests/RolesTestsView';

type TestType = 'auth' | 'jwt' | 'crud' | 'rbac' | 'roles';

interface UtilsViewProps {
  initialTab?: 'logs' | 'tests';
}

const TESTS_TABS: { value: TestType; label: string }[] = [
  { value: 'auth', label: 'Auth' },
  { value: 'jwt', label: 'JWT' },
  { value: 'crud', label: 'CRUD' },
  { value: 'rbac', label: 'RBAC' },
  { value: 'roles', label: 'Roles' },
];

export const UtilsView: React.FC<UtilsViewProps> = ({ initialTab = 'logs' }) => {
  const [activeTab] = useState<'logs' | 'tests'>(initialTab);
  const [selectedTestType, setSelectedTestType] = useState<TestType>('auth');

  const renderLogsContent = () => (
    <LogsView />
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
      <div className="bg-white p-6 rounded-2xl border border-app-border shadow-xs min-h-[500px]">
        {activeTab === 'logs' ? renderLogsContent() : renderTestsContent()}
      </div>
    </div>
  );
};
