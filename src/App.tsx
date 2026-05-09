import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { EmployeeProvider } from './context/EmployeeContext';
import { DashboardViewType } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { LoginView } from './views/login/LoginView';
import { DashboardUsersView } from './views/dashboard/DashboardUsersView';
import { DashboardEmployeesView } from './views/dashboard/DashboardEmployeesView';
import { UsersView } from './views/admin/users/UsersView';
import { EmployeesView } from './views/admin/employees/EmployeesView';
import { EmployeesDetailView } from './views/admin/employees/EmployeesDetailView';
import { AccessDeniedView } from './views/errors/AccessDeniedView';
import { AuthTestsView } from './views/utils/tests/AuthTestsView';
import { JwtTestsView } from './views/utils/tests/JwtTestsView';
import { CrudTestsView } from './views/utils/tests/CrudTestsView';
import { RbacTestsView } from './views/utils/tests/RbacTestsView';
import { RolesTestsView } from './views/utils/tests/RolesTestsView';
import { LogsView } from './views/utils/logs/LogsView';
import { UtilsView } from './views/utils/UtilsView';

const VIEW_ROUTES: Record<DashboardViewType, string> = {
  OVERVIEW: '/',
  USERS_CRUD: '/admin/users',
  EMPLOYEES_CRUD: '/admin/employees',
  EMPLOYEE_DASHBOARD: '/dashboard/employees',
  EMPLOYEE_DETAIL: '/admin/employees/:id',
  TESTS_AUTH: '/tests/auth',
  TESTS_JWT: '/tests/jwt',
  TESTS_CRUD: '/tests/crud',
  TESTS_RBAC: '/tests/rbac',
  TESTS_ROLES: '/tests/roles',
  LOGS_AUTH: '/logs/auth',
  LOGS_LOGOUT: '/logs/logout',
  LOGS_USERS: '/logs/users',
  LOGS_EMPLOYEES: '/logs/employees',
  UTILS: '/utils',
};

const VIEW_ROLES: Record<DashboardViewType, string[]> = {
  OVERVIEW: ['ROOT', 'ADMIN', 'MANAGER', 'USER'],
  USERS_CRUD: ['ROOT', 'ADMIN'],
  EMPLOYEES_CRUD: ['ROOT', 'ADMIN'],
  EMPLOYEE_DASHBOARD: ['ROOT', 'ADMIN', 'MANAGER'],
  EMPLOYEE_DETAIL: ['ROOT', 'ADMIN'],
  TESTS_AUTH: ['ROOT', 'ADMIN', 'MANAGER'],
  TESTS_JWT: ['ROOT', 'ADMIN', 'MANAGER'],
  TESTS_CRUD: ['ROOT', 'ADMIN', 'MANAGER'],
  TESTS_RBAC: ['ROOT', 'ADMIN', 'MANAGER'],
  TESTS_ROLES: ['ROOT', 'ADMIN', 'MANAGER'],
  LOGS_AUTH: ['ROOT', 'ADMIN'],
  LOGS_LOGOUT: ['ROOT', 'ADMIN'],
  LOGS_USERS: ['ROOT', 'ADMIN'],
  LOGS_EMPLOYEES: ['ROOT', 'ADMIN'],
  UTILS: ['ROOT', 'ADMIN', 'MANAGER'],
};

const canAccessView = (view: DashboardViewType, role?: string): boolean => {
  const allowedRoles = VIEW_ROLES[view] || [];
  return allowedRoles.includes(role || '');
};

const MainLayout: React.FC = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const [currentView, setCurrentView] = useState<DashboardViewType>(() => {
    const saved = localStorage.getItem('context7_current_view');
    return (saved as DashboardViewType) || 'OVERVIEW';
  });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('context7_current_view', currentView);
  }, [currentView]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200 font-sans">
        <div className="space-y-4 text-center">
          <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto" />
          <div className="space-y-1">
            <h2 className="font-bold text-base tracking-wide text-white">ON3ADMIN Secure App</h2>
            <p className="text-xs text-slate-500 font-mono">Verificando firma de token JWT local...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const hasAccess = canAccessView(currentView, user?.role);

  const handleViewChange = (view: DashboardViewType, employeeId?: string) => {
    if (canAccessView(view, user?.role)) {
      if (view === 'EMPLOYEE_DETAIL' && employeeId) {
        setSelectedEmployeeId(employeeId);
      }
      setCurrentView(view);
    }
  };

  const renderContent = () => {
    if (!hasAccess) {
      return (
        <AccessDeniedView 
          onBack={() => setCurrentView('OVERVIEW')}
          message={`Tu rol (${user?.role}) no tiene permiso para acceder a esta sección. Contacta a un administrador.`}
        />
      );
    }

    switch (currentView) {
      case 'OVERVIEW':
        return <DashboardUsersView />;
      case 'EMPLOYEE_DASHBOARD':
        return <DashboardEmployeesView />;
      case 'USERS_CRUD':
        return <UsersView />;
      case 'EMPLOYEES_CRUD':
        return <EmployeesView onViewEmployee={(id) => handleViewChange('EMPLOYEE_DETAIL', id)} />;
      case 'EMPLOYEE_DETAIL':
        return selectedEmployeeId ? (
          <EmployeesDetailView employeeId={selectedEmployeeId} onBack={() => setCurrentView('EMPLOYEES_CRUD')} />
        ) : (
          <EmployeesView onViewEmployee={(id) => handleViewChange('EMPLOYEE_DETAIL', id)} />
        );
      case 'TESTS_AUTH':
        return <AuthTestsView />;
      case 'TESTS_JWT':
        return <JwtTestsView />;
      case 'TESTS_CRUD':
        return <CrudTestsView />;
      case 'TESTS_RBAC':
        return <RbacTestsView />;
      case 'TESTS_ROLES':
        return <RolesTestsView />;
      case 'LOGS_AUTH':
      case 'LOGS_LOGOUT':
      case 'LOGS_USERS':
      case 'LOGS_EMPLOYEES':
        return <LogsView logType={currentView} />;
      case 'UTILS':
        return <UtilsView />;
      default:
        return <DashboardUsersView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans antialiased">
      <Sidebar currentView={currentView} setView={handleViewChange} />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header currentView={currentView} setCurrentView={setCurrentView} />

        <main className="p-8 flex-1 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <EmployeeProvider>
          <MainLayout />
          <Toast />
        </EmployeeProvider>
      </UserProvider>
    </AuthProvider>
  );
}
