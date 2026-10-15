import React, { useState } from 'react';
import { ERPProvider, useERP } from './context/ERPContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { StartupSequence } from './components/layout/StartupSequence';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { ToastContainer } from './components/common/ToastContainer';

// Modules
import { ExecutiveDashboard } from './components/modules/Dashboard/ExecutiveDashboard';
import { GuardDirectory } from './components/modules/Guards/GuardDirectory';
import { ClientManagement } from './components/modules/Clients/ClientManagement';
import { ContractManagement } from './components/modules/Contracts/ContractManagement';
import { DeploymentPlanner } from './components/modules/Rosters/DeploymentPlanner';
import { AttendanceDashboard } from './components/modules/Attendance/AttendanceDashboard';
import { PatrolManagement } from './components/modules/Patrol/PatrolManagement';
import { IncidentManagement } from './components/modules/Incidents/IncidentManagement';
import { SOSConsole } from './components/modules/SOS/SOSConsole';
import { RecruitmentPipeline } from './components/modules/Recruitment/RecruitmentPipeline';
import { HRCompliance } from './components/modules/HRCompliance/HRCompliance';
import { PayrollProcessing } from './components/modules/Payroll/PayrollProcessing';
import { ClientInvoicing } from './components/modules/Billing/ClientInvoicing';
import { CollectionsLedger } from './components/modules/Collections/CollectionsLedger';
import { CRMPipeline } from './components/modules/CRM/CRMPipeline';
import { ClientPortalView } from './components/modules/ClientPortal/ClientPortalView';
import { AnalyticsReports } from './components/modules/Reports/AnalyticsReports';
import { FieldStaffMobile } from './components/modules/FieldMobile/FieldStaffMobile';
import { AdminCenter } from './components/modules/Admin/AdminCenter';
import { HelpCenter } from './components/modules/HelpCenter/HelpCenter';

const MainLayout: React.FC = () => {
  const { activeModule } = useERP();
  const [isStartupDone, setIsStartupDone] = useState(false);

  // Render appropriate module view
  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <ExecutiveDashboard />;
      case 'guards':
        return <GuardDirectory />;
      case 'clients':
      case 'sites':
        return <ClientManagement />;
      case 'contracts':
        return <ContractManagement />;
      case 'deployments':
        return <DeploymentPlanner />;
      case 'attendance':
        return <AttendanceDashboard />;
      case 'patrol':
        return <PatrolManagement />;
      case 'incidents':
        return <IncidentManagement />;
      case 'sos':
        return <SOSConsole />;
      case 'recruitment':
        return <RecruitmentPipeline />;
      case 'hrCompliance':
        return <HRCompliance />;
      case 'payroll':
        return <PayrollProcessing />;
      case 'billing':
        return <ClientInvoicing />;
      case 'collections':
        return <CollectionsLedger />;
      case 'crm':
        return <CRMPipeline />;
      case 'clientPortal':
        return <ClientPortalView />;
      case 'reports':
        return <AnalyticsReports />;
      case 'fieldMobile':
        return <FieldStaffMobile />;
      case 'admin':
        return <AdminCenter />;
      case 'helpCenter':
        return <HelpCenter />;
      default:
        return <ExecutiveDashboard />;
    }
  };

  return (
    <>
      {!isStartupDone && (
        <StartupSequence onComplete={() => setIsStartupDone(true)} />
      )}

      <div className="erp-container">
        {/* Collapsible Left Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="erp-main">
          {/* Top Global Navigation Bar */}
          <TopNav />

          {/* Module Viewport */}
          <main className="erp-content-viewport">
            {renderActiveModule()}
          </main>
        </div>
      </div>

      {/* Global Overlays */}
      <NotificationDrawer />
      <GlobalSearchModal />
      <ToastContainer />
    </>
  );
};

export function App() {
  return (
    <ERPProvider>
      <MainLayout />
    </ERPProvider>
  );
}

export default App;
