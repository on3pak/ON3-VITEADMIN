import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import { TopProgressBar } from './components/ui';
import { UserProvider } from './context/UserContext';
import { EmployeeProvider } from './context/EmployeeContext';
import { DashboardViewType, VIEW_ROLES } from './types';
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
import { InventoryView } from './views/admin/inventory/InventoryView';
import { DashboardInventoryView } from './views/dashboard/DashboardInventoryView';
import { DashboardMachineryView } from './views/dashboard/DashboardMachineryView';
import { MachineryView } from './views/admin/machinery/MachineryView';
import { DashboardProfileView } from './views/dashboard/DashboardProfileView';
import { DashboardConfigView } from './views/dashboard/DashboardConfigView';
import { InventoryProvider } from './context/InventoryContext';
import { MachineryProvider } from './context/MachineryContext';
import { ServiceReportProvider } from './context/ServiceReportContext';
import { ServiceReportsView } from './views/admin/serviceReports/ServiceReportsView';
import { WorkReportProvider } from './context/WorkReportContext';
import { WorkReportsView } from './views/admin/workReports/WorkReportsView';
const canAccessView = (view: DashboardViewType, role?: string): boolean => {
  const allowedRoles = VIEW_ROLES[view] || [];
  return allowedRoles.includes(role || '');
};

const MainLayout: React.FC = () => {
  const { isAuthenticated, initializing, user } = useAuth();
  const [currentView, setCurrentView] = useState<DashboardViewType>('PROFILE');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [serviceReportTab, setServiceReportTab] = useState<'previo' | 'diario' | 'historial'>('previo');

  if (initializing) {
    return (
      <div className="min-h-screen bg-sidebar flex flex-col items-center justify-center text-sidebar-text font-sans relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_50%_50%,#14b8a6_1px,transparent_1px)] bg-[length:24px_24px]" />

        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />

        <div className="relative flex flex-col items-center gap-6 text-center">
          {/* Logo */}
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl shadow-2xl shadow-primary-500/25 flex items-center justify-center">
              <span className="text-2xl font-bold text-white tracking-tight">ON3</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-sidebar rounded-full" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold tracking-wide text-white">ON3ADMIN</h2>
            <p className="text-sm text-sidebar-text">Panel de AdministraciÃ³n</p>
          </div>

          <div className="flex items-center gap-2.5 mt-2">
            <div className="h-1 w-1 rounded-full bg-primary-500 animate-bounce [animation-delay:0ms]" />
            <div className="h-1 w-1 rounded-full bg-primary-400 animate-bounce [animation-delay:150ms]" />
            <div className="h-1 w-1 rounded-full bg-primary-300 animate-bounce [animation-delay:300ms]" />
          </div>

          <p className="text-[11px] text-sidebar-text/60 font-mono tracking-wider mt-1">VERIFICANDO SESIÃ“N</p>
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
          onBack={() => setCurrentView('PROFILE')}
          message={`Tu rol (${user?.role}) no tiene permiso para acceder a esta secciÃ³n. Contacta a un administrador.`}
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
      case 'SERVICE_REPORT':
        return <ServiceReportsView onTabChange={setServiceReportTab} />;
      case 'WORK_REPORT':
        return <WorkReportsView />;
      case 'INVENTORY_CRUD':
        return <InventoryView />;
      case 'INVENTORY_DASHBOARD':
        return <DashboardInventoryView />;
      case 'MACHINERY_CRUD':
        return <MachineryView />;
      case 'MACHINERY_DASHBOARD':
        return <DashboardMachineryView />;
      case 'PROFILE':
        return <DashboardProfileView />;
      case 'PROFILE_CONFIG':
        return <DashboardConfigView />;
      default:
        return <DashboardUsersView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-app-text font-sans antialiased flex">
      <Sidebar 
        currentView={currentView} 
        setView={handleViewChange} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      <div className="flex flex-col grow lg:ms-[290px] min-h-screen">
        {/* Mobile spacer for fixed header */}
        <div className="h-16 lg:hidden" />

        {/* Main Content Card (Metronic-style) */}
        <div className="flex grow rounded-xl bg-white border border-app-border mt-3 lg:mt-5 mx-5 mb-5">
          <div className="flex flex-col grow overflow-y-auto pt-5" id="scrollable_content">
            <main className="grow">
              {/* Toolbar */}
              <div className="px-5">
                <Header currentView={currentView} setCurrentView={setCurrentView} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} serviceReportTab={serviceReportTab} />
              </div>

              {/* Page Content */}
              <div className="px-5 pb-5">
                {renderContent()}
              </div>
            </main>

            {/* Footer */}
            <footer className="flex items-center justify-between px-5 py-3 border-t border-app-border text-xs text-app-text-secondary">
              <span>ON3ADMIN &copy; {new Date().getFullYear()}</span>
              <span className="font-mono">v1.0.0</span>
            </footer>
          </div>
        </div>
      </div>

      <Toast />
    </div>
  );
};

const AppContent: React.FC = () => {
  const { loading } = useLoading();
  return (
    <>
      <TopProgressBar loading={loading} />
      <MainLayout />
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <UserProvider>
          <EmployeeProvider>
            <VehicleProvider>
              <WorkCenterProvider>
              <ServiceProvider>
                <ServiceReportProvider>
                <InventoryProvider>
                <MachineryProvider>
                <WorkReportProvider>
                <AppContent />
                </WorkReportProvider>
                </MachineryProvider>
                </InventoryProvider>
                </ServiceReportProvider>
              </ServiceProvider>
              </WorkCenterProvider>
            </VehicleProvider>
          </EmployeeProvider>
        </UserProvider>
      </LoadingProvider>
    </AuthProvider>
  );
}
