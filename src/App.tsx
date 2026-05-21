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
import { DashboardVehiclesView } from './views/dashboard/DashboardVehiclesView';
import { UsersView } from './views/admin/users/UsersView';
import { EmployeesView } from './views/admin/employees/EmployeesView';
import { EmployeesDetailView } from './views/admin/employees/EmployeesDetailView';
import { VehiclesView } from './views/admin/vehicles/VehiclesView';
import { VehiclesDetailView } from './views/admin/vehicles/VehiclesDetailView';
import { VehicleProvider } from './context/VehicleContext';
import { WorkCenterProvider } from './context/WorkCenterContext';
import { ServiceProvider } from './context/ServiceContext';
import { WorkCentersView } from './views/admin/workCenters/WorkCentersView';
import { DashboardWorkCentersView } from './views/dashboard/DashboardWorkCentersView';
import { DashboardServicesView } from './views/dashboard/DashboardServicesView';
import { ServicesView } from './views/admin/services/ServicesView';
import { ServicesDetailView } from './views/admin/services/ServicesDetailView';
import { AccessDeniedView } from './views/errors/AccessDeniedView';
import { AuthTestsView } from './views/utils/tests/AuthTestsView';
import { JwtTestsView } from './views/utils/tests/JwtTestsView';
import { CrudTestsView } from './views/utils/tests/CrudTestsView';
import { RbacTestsView } from './views/utils/tests/RbacTestsView';
import { RolesTestsView } from './views/utils/tests/RolesTestsView';
import { LogsView } from './views/utils/logs/LogsView';
import { UtilsView } from './views/utils/UtilsView';
import { InventoryView } from './views/admin/inventory/InventoryView';
import { DashboardInventoryView } from './views/dashboard/DashboardInventoryView';
import { DashboardProfileView } from './views/dashboard/DashboardProfileView';
import { InventoryProvider } from './context/InventoryContext';

const VIEW_ROUTES: Record<DashboardViewType, string> = {
  USER_DASHBOARD: '/',
  USERS_CRUD: '/admin/users',
  EMPLOYEES_CRUD: '/admin/employees',
  EMPLOYEE_DASHBOARD: '/dashboard/employees',
  EMPLOYEE_DETAIL: '/admin/employees/:id',
  VEHICLES_CRUD: '/admin/vehicles',
  VEHICLE_DASHBOARD: '/dashboard/vehicles',
  VEHICLE_DETAIL: '/admin/vehicles/:id',
  WORK_CENTERS_CRUD: '/admin/work-centers',
  WORK_CENTERS_DASHBOARD: '/dashboard/work-centers',
  SERVICES_CRUD: '/admin/services',
  SERVICES_DASHBOARD: '/dashboard/services',
  SERVICE_DETAIL: '/admin/services/:id',
  INVENTORY_CRUD: '/admin/inventory',
  INVENTORY_DASHBOARD: '/dashboard/inventory',
  PROFILE: '/profile',
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
  USER_DASHBOARD: ['ROOT', 'ADMIN', 'MANAGER', 'USER'],
  USERS_CRUD: ['ROOT', 'ADMIN'],
  EMPLOYEES_CRUD: ['ROOT', 'ADMIN'],
  EMPLOYEE_DASHBOARD: ['ROOT', 'ADMIN', 'MANAGER'],
  EMPLOYEE_DETAIL: ['ROOT', 'ADMIN'],
  VEHICLES_CRUD: ['ROOT', 'ADMIN'],
  VEHICLE_DASHBOARD: ['ROOT', 'ADMIN', 'MANAGER'],
  VEHICLE_DETAIL: ['ROOT', 'ADMIN'],
  WORK_CENTERS_CRUD: ['ROOT', 'ADMIN'],
  WORK_CENTERS_DASHBOARD: ['ROOT', 'ADMIN', 'MANAGER'],
  SERVICES_CRUD: ['ROOT', 'ADMIN'],
  SERVICES_DASHBOARD: ['ROOT', 'ADMIN', 'MANAGER'],
  SERVICE_DETAIL: ['ROOT', 'ADMIN'],
  INVENTORY_CRUD: ['ROOT', 'ADMIN'],
  INVENTORY_DASHBOARD: ['ROOT', 'ADMIN', 'MANAGER'],
  PROFILE: ['ROOT', 'ADMIN', 'MANAGER', 'USER'],
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
    const saved = localStorage.getItem('on3_current_view');
    return (saved as DashboardViewType) || 'USER_DASHBOARD';
  });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('on3_current_view', currentView);
  }, [currentView]);

  if (loading) {
    return (
      <div className="min-h-screen bg-sidebar flex flex-col items-center justify-center text-sidebar-text font-sans">
        <div className="space-y-4 text-center">
          <div className="h-10 w-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mx-auto" />
          <div className="space-y-1">
            <h2 className="font-bold text-base tracking-wide text-white">ON3ADMIN Secure App</h2>
            <p className="text-xs text-sidebar-text font-mono">Verificando firma de token JWT local...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const hasAccess = canAccessView(currentView, user?.role);

  const handleViewChange = (view: DashboardViewType, id?: string) => {
    if (canAccessView(view, user?.role)) {
      if (view === 'EMPLOYEE_DETAIL' && id) {
        setSelectedEmployeeId(id);
      }
      if (view === 'VEHICLE_DETAIL' && id) {
        setSelectedVehicleId(id);
      }
      if (view === 'SERVICE_DETAIL' && id) {
        setSelectedServiceId(id);
      }
      setCurrentView(view);
    }
  };

  const renderContent = () => {
    if (!hasAccess) {
      return (
        <AccessDeniedView 
          onBack={() => setCurrentView('USER_DASHBOARD')}
          message={`Tu rol (${user?.role}) no tiene permiso para acceder a esta sección. Contacta a un administrador.`}
        />
      );
    }

    switch (currentView) {
      case 'USER_DASHBOARD':
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
      case 'WORK_CENTERS_CRUD':
        return <WorkCentersView />;
      case 'WORK_CENTERS_DASHBOARD':
        return <DashboardWorkCentersView />;
      case 'SERVICES_CRUD':
        return <ServicesView onViewService={(id) => handleViewChange('SERVICE_DETAIL', id)} />;
      case 'SERVICES_DASHBOARD':
        return <DashboardServicesView />;
      case 'SERVICE_DETAIL':
        return selectedServiceId ? (
          <ServicesDetailView serviceId={selectedServiceId} onBack={() => setCurrentView('SERVICES_CRUD')} />
        ) : (
          <ServicesView onViewService={(id) => handleViewChange('SERVICE_DETAIL', id)} />
        );
      case 'VEHICLES_CRUD':
        return <VehiclesView onViewVehicle={(id) => handleViewChange('VEHICLE_DETAIL', id)} />;
      case 'VEHICLE_DASHBOARD':
        return <DashboardVehiclesView />;
      case 'VEHICLE_DETAIL':
        return selectedVehicleId ? (
          <VehiclesDetailView vehicleId={selectedVehicleId} onBack={() => setCurrentView('VEHICLES_CRUD')} />
        ) : (
          <VehiclesView onViewVehicle={(id) => handleViewChange('VEHICLE_DETAIL', id)} />
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
      case 'INVENTORY_CRUD':
        return <InventoryView />;
      case 'INVENTORY_DASHBOARD':
        return <DashboardInventoryView />;
      case 'PROFILE':
        return <DashboardProfileView />;
      case 'UTILS':
        return <UtilsView />;
      default:
        return <DashboardUsersView />;
    }
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text font-sans antialiased flex">
      <Sidebar 
        currentView={currentView} 
        setView={handleViewChange} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-[265px] transition-all duration-300">
        <Header currentView={currentView} setCurrentView={setCurrentView} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
          <VehicleProvider>
            <WorkCenterProvider>
            <ServiceProvider>
              <InventoryProvider>
              <MainLayout />
            <Toast />
              </InventoryProvider>
            </ServiceProvider>
            </WorkCenterProvider>
          </VehicleProvider>
        </EmployeeProvider>
      </UserProvider>
    </AuthProvider>
  );
}
