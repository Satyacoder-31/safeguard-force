import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  RoleType, UserSession, Guard, Client, Site, Contract, ShiftRoster, 
  AttendanceRecord, PatrolLog, Incident, SOSAlert, RecruitmentCandidate, 
  LeaveRequest, UniformItem, PayrollRun, ClientInvoice, PaymentReceipt, 
  CRMLead, ClientComplaint, AuditLogItem, IntegrationStatus 
} from '../types/erp';
import { 
  initialClients, initialSites, initialGuards, initialContracts, 
  initialShifts, initialAttendance, initialPatrols, initialIncidents, 
  initialSOSAlerts, initialCandidates, initialLeaves, initialUniformStock, 
  initialPayrollRuns, initialInvoices, initialPayments, initialCRMLeads, 
  initialComplaints, initialIntegrations 
} from '../data/initialData';
import { translations, Language } from '../i18n/translations';

export type NavigationModule = 
  | 'dashboard'
  | 'guards'
  | 'clients'
  | 'sites'
  | 'contracts'
  | 'deployments'
  | 'attendance'
  | 'patrol'
  | 'incidents'
  | 'sos'
  | 'recruitment'
  | 'hrCompliance'
  | 'payroll'
  | 'billing'
  | 'collections'
  | 'crm'
  | 'clientPortal'
  | 'reports'
  | 'fieldMobile'
  | 'admin'
  | 'helpCenter';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  message: string;
}

export type AdminSubTab = 
  | 'branches' 
  | 'users' 
  | 'roles' 
  | 'masters' 
  | 'customFields' 
  | 'settings' 
  | 'audit' 
  | 'api' 
  | 'integrations' 
  | 'backup';

interface ERPContextType {
  // Theme & Language
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (l: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;

  // Navigation
  activeModule: NavigationModule;
  setActiveModule: (m: NavigationModule) => void;
  adminTab: AdminSubTab;
  setAdminTab: (tab: AdminSubTab) => void;
  openSetupTab: (tab: AdminSubTab) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (c: boolean) => void;
  toggleSidebar: () => void;

  // Auth & Roles
  isAuthenticated: boolean;
  currentUser: UserSession;
  login: (email: string, role?: RoleType, customName?: string) => void;
  logout: () => void;
  switchRole: (role: RoleType) => void;

  // Dialogs & Panels
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'warning' | 'danger' | 'info', title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Data Collections
  clients: Client[];
  sites: Site[];
  guards: Guard[];
  contracts: Contract[];
  shifts: ShiftRoster[];
  attendance: AttendanceRecord[];
  patrols: PatrolLog[];
  incidents: Incident[];
  sosAlerts: SOSAlert[];
  candidates: RecruitmentCandidate[];
  leaves: LeaveRequest[];
  uniforms: UniformItem[];
  payrollRuns: PayrollRun[];
  invoices: ClientInvoice[];
  payments: PaymentReceipt[];
  crmLeads: CRMLead[];
  complaints: ClientComplaint[];
  integrations: IntegrationStatus[];
  auditLogs: AuditLogItem[];

  // Data Operations
  addGuard: (guard: Partial<Guard>) => void;
  updateGuard: (id: string, updates: Partial<Guard>) => void;
  deleteGuard: (id: string) => void;

  addClient: (client: Partial<Client>) => void;
  addSite: (site: Partial<Site>) => void;
  addContract: (contract: Partial<Contract>) => void;

  assignGuardToShift: (shiftId: string, guardId: string) => void;
  recordPunch: (guardId: string, siteId: string, isClockIn: boolean, customLat?: number, customLng?: number) => void;
  regularizeAttendance: (attendanceId: string, notes: string) => void;

  scanPatrolCheckpoint: (patrolId: string, checkpointId: string) => void;
  reportIncident: (incident: Partial<Incident>) => void;
  updateIncidentStatus: (id: string, status: Incident['status'], rootCause?: string, preventiveAction?: string) => void;

  triggerEmergencySOS: (guardId: string, siteId: string, isTest?: boolean) => void;
  acknowledgeSOS: (id: string, responderName: string) => void;
  resolveSOS: (id: string, notes: string) => void;

  addCandidate: (candidate: Partial<RecruitmentCandidate>) => void;
  updateCandidateStage: (candidateId: string, stage: RecruitmentCandidate['stage']) => void;
  convertCandidateToGuard: (candidateId: string) => void;

  applyLeave: (leave: Partial<LeaveRequest>) => void;
  approveLeave: (id: string) => void;
  rejectLeave: (id: string) => void;

  generateCurrentMonthPayroll: () => void;
  approvePayrollRun: (id: string) => void;

  generateInvoiceFromContract: (clientId: string, billingPeriod: string) => void;
  approveInvoice: (id: string) => void;
  recordPaymentReceipt: (receipt: Partial<PaymentReceipt>) => void;

  addCRMLead: (lead: Partial<CRMLead>) => void;
  updateLeadStage: (id: string, stage: CRMLead['stage']) => void;
  convertLeadToClient: (leadId: string) => void;

  submitComplaint: (data: Partial<ClientComplaint>) => void;
  resolveComplaint: (id: string, notes: string) => void;

  // Calculated Real-time KPIs
  kpis: {
    activeGuardsCount: number;
    requiredStrengthTotal: number;
    deployedPercentage: number;
    unfilledPostsCount: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    activeSitesCount: number;
    openIncidentsCount: number;
    activeSOSCount: number;
    patrolComplianceRate: number;
    monthlyPayrollTotal: number;
    monthlyBillingTotal: number;
    collectionsTotal: number;
    outstandingReceivablesTotal: number;
    overdueInvoicesTotal: number;
    grossMarginPercent: number;
  };
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme State
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('sgf_theme') as 'light' | 'dark') || 'light';
  });

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
    localStorage.setItem('sgf_theme', t);
    document.documentElement.setAttribute('data-theme', t);
  };

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Language State
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('sgf_lang') as Language) || 'en';
  });

  const setLanguage = (l: Language) => {
    setLanguageState(l);
    localStorage.setItem('sgf_lang', l);
  };

  const toggleLanguage = () => setLanguage(language === 'en' ? 'hi' : 'en');

  const t = (key: string): string => {
    const dict = translations[language];
    if (dict && dict[key]) return dict[key];
    const enDict = translations['en'];
    return enDict[key] || key;
  };

  // Navigation State
  const [activeModule, setActiveModule] = useState<NavigationModule>('dashboard');
  const [adminTab, setAdminTab] = useState<AdminSubTab>('branches');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

  const openSetupTab = (tab: AdminSubTab) => {
    setAdminTab(tab);
    setActiveModule('admin');
  };

  // Dialogs
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = 'toast-' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // User Session & Authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // If user has explicitly logged in, persist true; otherwise false to showcase the login page
    return localStorage.getItem('sgf_auth') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<UserSession>(() => {
    const savedRole = (localStorage.getItem('sgf_user_role') as RoleType) || 'SUPER_ADMIN';
    return {
      id: 'usr-1',
      name: 'Brig. Alok Sharma (Retd.)',
      email: 'operations@safeguardforce.in',
      phone: '+91 98110 55443',
      role: savedRole,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      branchId: 'br-1'
    };
  });

  const login = (email: string, role?: RoleType, customName?: string) => {
    let resolvedRole: RoleType = role || 'SUPER_ADMIN';
    let name = customName || 'Brig. Alok Sharma (Retd.)';
    let clientId: string | undefined = undefined;

    if (!role) {
      const lower = email.toLowerCase();
      if (lower.includes('ops') || lower.includes('batra')) {
        resolvedRole = 'OPERATIONS_MANAGER';
        name = 'Maj. Sandeep Batra (Retd.)';
      } else if (lower.includes('hr') || lower.includes('kashyap')) {
        resolvedRole = 'HR_RECRUITMENT';
        name = 'Pooja Kashyap (HR Manager)';
      } else if (lower.includes('account') || lower.includes('finance') || lower.includes('chandra')) {
        resolvedRole = 'PAYROLL_ACCOUNTS';
        name = 'Ramesh Chandra (Senior Accounts)';
      } else if (lower.includes('dlf') || lower.includes('client') || lower.includes('mathur')) {
        resolvedRole = 'CLIENT_USER';
        name = 'Col. Rajiv Mathur (DLF CyberCity VP)';
        clientId = 'cl-1';
      } else if (lower.includes('guard') || lower.includes('shekhawat')) {
        resolvedRole = 'GUARD_FIELD';
        name = 'Vikram Singh Shekhawat';
      } else if (lower.includes('supervisor') || lower.includes('balwant')) {
        resolvedRole = 'SITE_SUPERVISOR';
        name = 'Subedar Balwant Singh';
      } else if (lower.includes('sales') || lower.includes('verma')) {
        resolvedRole = 'SALES_CRM';
        name = 'Vikrant Verma (Sales Head)';
      } else if (lower.includes('mgmt') || lower.includes('rathore')) {
        resolvedRole = 'MANAGEMENT';
        name = 'Lt. Gen. K.S. Rathore (Chairman)';
      }
    } else {
      if (role === 'OPERATIONS_MANAGER') name = 'Maj. Sandeep Batra (Retd.)';
      else if (role === 'HR_RECRUITMENT') name = 'Pooja Kashyap (HR Manager)';
      else if (role === 'PAYROLL_ACCOUNTS') name = 'Ramesh Chandra (Senior Accounts)';
      else if (role === 'CLIENT_USER') { name = 'Col. Rajiv Mathur (DLF CyberCity VP)'; clientId = 'cl-1'; }
      else if (role === 'GUARD_FIELD') name = 'Vikram Singh Shekhawat';
      else if (role === 'SITE_SUPERVISOR') name = 'Subedar Balwant Singh';
      else if (role === 'SALES_CRM') name = 'Vikrant Verma (Sales Head)';
      else if (role === 'MANAGEMENT') name = 'Lt. Gen. K.S. Rathore (Chairman)';
      else if (role === 'SUPER_ADMIN') name = 'Brig. Alok Sharma (Retd.)';
    }

    const newUser: UserSession = {
      id: 'usr-' + resolvedRole.toLowerCase(),
      name,
      email: email || 'admin@safeguardforce.in',
      phone: '+91 98110 55443',
      role: resolvedRole,
      clientId,
      branchId: 'br-1',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    };

    setCurrentUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('sgf_auth', 'true');
    localStorage.setItem('sgf_user_role', resolvedRole);
    addToast('success', 'Security Clearance Verified', `Welcome back, ${name}. Connected to Safe Guard Force ERP.`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('sgf_auth', 'false');
    addToast('info', 'Secure Sign Out', 'You have been logged out of the Safe Guard Force console.');
  };

  const switchRole = (newRole: RoleType) => {
    let name = 'Brig. Alok Sharma (Retd.)';
    let email = 'admin@safeguardforce.in';
    let clientId: string | undefined = undefined;

    if (newRole === 'SITE_SUPERVISOR') {
      name = 'Subedar Balwant Singh';
      email = 'balwant.singh@sgf.in';
    } else if (newRole === 'GUARD_FIELD') {
      name = 'Vikram Singh Shekhawat';
      email = 'vikram.singh@sgf.in';
    } else if (newRole === 'CLIENT_USER') {
      name = 'Col. Rajiv Mathur (DLF CyberCity VP)';
      email = 'security.admin@dlfcybercity.com';
      clientId = 'cl-1'; // Tenant isolation for DLF CyberCity!
    } else if (newRole === 'HR_RECRUITMENT') {
      name = 'Pooja Kashyap (HR Manager)';
      email = 'hr@safeguardforce.in';
    } else if (newRole === 'PAYROLL_ACCOUNTS') {
      name = 'Ramesh Chandra (Senior Accounts)';
      email = 'accounts@safeguardforce.in';
    } else if (newRole === 'SALES_CRM') {
      name = 'Vikrant Verma (Sales Head)';
      email = 'sales@safeguardforce.in';
    } else if (newRole === 'OPERATIONS_MANAGER') {
      name = 'Maj. Sandeep Batra (Retd.)';
      email = 'ops.manager@safeguardforce.in';
    }

    setCurrentUser({
      id: 'usr-' + newRole.toLowerCase(),
      name,
      email,
      phone: '+91 98112 00000',
      role: newRole,
      clientId,
      branchId: 'br-1'
    });
    localStorage.setItem('sgf_user_role', newRole);

    addToast('info', 'Role Switched', `Active persona is now ${newRole}. Permissions and view adapted.`);
  };

  // Master Data Collections
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [sites, setSites] = useState<Site[]>(initialSites);
  const [guards, setGuards] = useState<Guard[]>(initialGuards);
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [shifts, setShifts] = useState<ShiftRoster[]>(initialShifts);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [patrols, setPatrols] = useState<PatrolLog[]>(initialPatrols);
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>(initialSOSAlerts);
  const [candidates, setCandidates] = useState<RecruitmentCandidate[]>(initialCandidates);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(initialLeaves);
  const [uniforms] = useState<UniformItem[]>(initialUniformStock);
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>(initialPayrollRuns);
  const [invoices, setInvoices] = useState<ClientInvoice[]>(initialInvoices);
  const [payments, setPayments] = useState<PaymentReceipt[]>(initialPayments);
  const [crmLeads, setCrmLeads] = useState<CRMLead[]>(initialCRMLeads);
  const [complaints, setComplaints] = useState<ClientComplaint[]>(initialComplaints);
  const [integrations] = useState<IntegrationStatus[]>(initialIntegrations);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: 'aud-1',
      timestamp: '2026-10-15 14:10',
      userEmail: 'rajesh.meena@sgf.in',
      userRole: 'GUARD_FIELD',
      action: 'CREATE',
      module: 'SOS',
      details: 'SOS Alert triggered from DLF CyberHub Central Plaza (Lat: 28.4950, Lng: 77.0890)',
      ipAddress: '103.24.112.44'
    },
    {
      id: 'aud-2',
      timestamp: '2026-10-15 13:50',
      userEmail: 'rajesh.meena@sgf.in',
      userRole: 'GUARD_FIELD',
      action: 'CREATE',
      module: 'Attendance',
      details: 'Punch-in recorded with geofence exception (840m outside boundary)',
      ipAddress: '103.24.112.44'
    },
    {
      id: 'aud-3',
      timestamp: '2026-10-15 10:15',
      userEmail: 'security.admin@dlfcybercity.com',
      userRole: 'CLIENT_USER',
      action: 'CREATE',
      module: 'Client Portal',
      details: 'Service request created for 2 extra weekend bouncers',
      ipAddress: '49.207.210.15'
    }
  ]);

  const logAudit = (action: AuditLogItem['action'], module: string, details: string) => {
    const newLog: AuditLogItem = {
      id: 'aud-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      userEmail: currentUser.email,
      userRole: currentUser.role,
      action,
      module,
      details,
      ipAddress: '103.21.244.18'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Data Actions
  const addGuard = (guardData: Partial<Guard>) => {
    const id = 'gd-' + (guards.length + 1);
    const newGuard: Guard = {
      id,
      guardIdNumber: `SGF-GD-${100 + guards.length + 1}`,
      name: guardData.name || 'New Guard',
      nameHi: guardData.nameHi,
      phone: guardData.phone || '+91 98000 00000',
      email: guardData.email || `${guardData.name?.toLowerCase().replace(/\s+/g, '.')}@sgf.in`,
      photo: guardData.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      category: guardData.category || 'Unarmed Guard',
      rank: guardData.rank || 'Security Guard',
      dateOfJoining: guardData.dateOfJoining || new Date().toISOString().substring(0, 10),
      status: 'Active',
      kycStatus: guardData.kycStatus || 'Verified',
      policeVerificationStatus: guardData.policeVerificationStatus || 'Pending',
      currentSiteId: guardData.currentSiteId,
      currentSiteName: sites.find(s => s.id === guardData.currentSiteId)?.name,
      shiftPreference: guardData.shiftPreference || 'Morning',
      bankDetails: guardData.bankDetails || {
        accountNumber: '••••••••8912',
        ifsc: 'SBIN0001234',
        bankName: 'State Bank of India',
        holderName: guardData.name || 'Guard'
      },
      salaryStructure: guardData.salaryStructure || {
        basic: 16000,
        hra: 3800,
        conveyance: 1500,
        specialAllowance: 1000,
        overtimeHourlyRate: 130
      },
      documents: guardData.documents || [
        { id: 'doc-' + Date.now(), type: 'Aadhaar', docNumber: '••••-••••-1234', issueDate: '2020-01-01', verified: true }
      ],
      uniformIssued: ['2 Security Shirts', '2 Trousers', '1 Cap']
    };

    setGuards(prev => [newGuard, ...prev]);
    logAudit('CREATE', 'Guards', `Created guard profile ${newGuard.guardIdNumber} (${newGuard.name})`);
    addToast('success', 'Guard Created', `${newGuard.name} (${newGuard.guardIdNumber}) added successfully.`);
  };

  const updateGuard = (id: string, updates: Partial<Guard>) => {
    setGuards(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    logAudit('UPDATE', 'Guards', `Updated guard ID ${id}`);
    addToast('success', 'Guard Updated', 'Guard profile details updated successfully.');
  };

  const deleteGuard = (id: string) => {
    setGuards(prev => prev.filter(g => g.id !== id));
    logAudit('DELETE', 'Guards', `Archived guard ID ${id}`);
    addToast('warning', 'Guard Archived', 'Guard has been marked inactive / archived.');
  };

  const addClient = (clientData: Partial<Client>) => {
    const id = 'cl-' + (clients.length + 1);
    const newClient: Client = {
      id,
      clientCode: `SGF-CL-00${clients.length + 1}`,
      name: clientData.name || 'New Enterprise Client',
      legalEntityName: clientData.legalEntityName || clientData.name || 'Enterprise Client Pvt Ltd',
      industry: clientData.industry || 'Corporate Facility',
      gstin: clientData.gstin || '07AAAAA0000A1Z5',
      primaryContactName: clientData.primaryContactName || 'Facility Manager',
      email: clientData.email || 'facility@client.com',
      phone: clientData.phone || '+91 98000 12345',
      billingAddress: clientData.billingAddress || 'Commercial Complex, New Delhi',
      contractStatus: 'Active',
      activeSitesCount: 1,
      monthlyBilledAmount: clientData.monthlyBilledAmount || 350000,
      totalOutstanding: 0
    };
    setClients(prev => [newClient, ...prev]);
    logAudit('CREATE', 'Clients', `Onboarded client ${newClient.name}`);
    addToast('success', 'Client Onboarded', `${newClient.name} successfully registered.`);
  };

  const addSite = (siteData: Partial<Site>) => {
    const id = 'st-' + (sites.length + 1);
    const client = clients.find(c => c.id === siteData.clientId);
    const newSite: Site = {
      id,
      clientId: siteData.clientId || 'cl-1',
      clientName: client?.name || 'DLF CyberCity Developers',
      name: siteData.name || 'New Client Facility',
      address: siteData.address || 'Industrial Area Phase 1',
      city: siteData.city || 'Gurugram',
      latitude: siteData.latitude || 28.4980,
      longitude: siteData.longitude || 77.0880,
      geofenceRadiusMeters: siteData.geofenceRadiusMeters || 150,
      requiredStrength: siteData.requiredStrength || 12,
      assignedGuardsCount: 0,
      supervisorName: siteData.supervisorName || 'Subedar Balwant Singh',
      supervisorPhone: siteData.supervisorPhone || '+91 98711 00112',
      emergencyContact: siteData.emergencyContact || '0124-4000000',
      status: 'Active'
    };
    setSites(prev => [newSite, ...prev]);
    logAudit('CREATE', 'Sites', `Created site ${newSite.name} with ${newSite.geofenceRadiusMeters}m geofence`);
    addToast('success', 'Site Configured', `${newSite.name} configured with geofencing.`);
  };

  const addContract = (contractData: Partial<Contract>) => {
    const id = 'ct-' + (contracts.length + 1);
    const client = clients.find(c => c.id === contractData.clientId);
    const newContract: Contract = {
      id,
      contractNumber: `SGF-CT-2026-0${contracts.length + 10}`,
      clientId: contractData.clientId || 'cl-1',
      clientName: client?.name || 'Client',
      title: contractData.title || `Security Contract - ${client?.name}`,
      startDate: contractData.startDate || '2026-10-01',
      endDate: contractData.endDate || '2028-09-30',
      renewalDate: contractData.renewalDate || '2028-08-15',
      status: 'Active',
      siteIds: contractData.siteIds || ['st-1'],
      rates: contractData.rates || [
        { category: 'Unarmed Guard', requiredCount: 10, ratePerMonth: 18500, otRatePerHour: 140 },
        { category: 'Security Supervisor', requiredCount: 2, ratePerMonth: 28000, otRatePerHour: 220 }
      ],
      serviceFeePercent: 10,
      gstRatePercent: 18,
      billingFrequency: 'Monthly',
      totalMonthlyValue: contractData.totalMonthlyValue || 450000
    };
    setContracts(prev => [newContract, ...prev]);
    logAudit('CREATE', 'Contracts', `Created contract ${newContract.contractNumber}`);
    addToast('success', 'Contract Approved', `Contract ${newContract.contractNumber} activated.`);
  };

  const assignGuardToShift = (shiftId: string, guardId: string) => {
    const guard = guards.find(g => g.id === guardId);
    if (!guard) return;

    setShifts(prev => prev.map(s => {
      if (s.id === shiftId) {
        if (s.assignedGuardIds.includes(guardId)) return s;
        const newIds = [...s.assignedGuardIds, guardId];
        const newGuards = [...s.assignedGuards, { id: guard.id, name: guard.name, category: guard.category }];
        const status = newIds.length >= s.requiredGuards ? 'Fully Staffed' : 'Shortage';
        return { ...s, assignedGuardIds: newIds, assignedGuards: newGuards, status };
      }
      return s;
    }));

    logAudit('UPDATE', 'Deployments', `Assigned guard ${guard.name} to shift ${shiftId}`);
    addToast('success', 'Guard Deployed', `${guard.name} assigned to post.`);
  };

  const recordPunch = (guardId: string, siteId: string, isClockIn: boolean, customLat?: number, customLng?: number) => {
    const guard = guards.find(g => g.id === guardId);
    const site = sites.find(s => s.id === siteId);
    if (!guard || !site) return;

    const lat = customLat !== undefined ? customLat : site.latitude + (Math.random() * 0.0004 - 0.0002);
    const lng = customLng !== undefined ? customLng : site.longitude + (Math.random() * 0.0004 - 0.0002);

    // Calculate approximate distance in meters
    const dLat = (lat - site.latitude) * 111000;
    const dLng = (lng - site.longitude) * 111000 * Math.cos(site.latitude * Math.PI / 180);
    const distanceMeters = Math.round(Math.sqrt(dLat * dLat + dLng * dLng));
    const isInside = distanceMeters <= site.geofenceRadiusMeters;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isClockIn) {
      const newAttendance: AttendanceRecord = {
        id: 'att-' + Date.now(),
        guardId: guard.id,
        guardName: guard.name,
        siteId: site.id,
        siteName: site.name,
        date: now.toISOString().substring(0, 10),
        shiftType: guard.shiftPreference === 'Any' ? 'Morning' : guard.shiftPreference,
        punchInTime: timeStr,
        gpsLat: lat,
        gpsLng: lng,
        isInsideGeofence: isInside,
        distanceFromSiteMeters: distanceMeters,
        status: !isInside ? 'Late' : 'Present',
        supervisorVerified: isInside,
        verificationNotes: !isInside ? `Geofence Exception: Punched ${distanceMeters}m outside boundary` : undefined
      };
      setAttendance(prev => [newAttendance, ...prev]);
      logAudit('CREATE', 'Attendance', `Guard ${guard.name} punched in at ${site.name} (${distanceMeters}m from geofence)`);
      if (isInside) {
        addToast('success', 'Attendance Recorded', `Punch-in confirmed at ${site.name}. Inside geofence (${distanceMeters}m).`);
      } else {
        addToast('warning', 'Geofence Exception', `Punch registered ${distanceMeters}m from site. Sent to supervisor for verification.`);
      }
    } else {
      setAttendance(prev => prev.map(a => {
        if (a.guardId === guardId && !a.punchOutTime) {
          return { ...a, punchOutTime: timeStr };
        }
        return a;
      }));
      logAudit('UPDATE', 'Attendance', `Guard ${guard.name} punched out from ${site.name}`);
      addToast('info', 'Punch-Out Recorded', `Clock-out completed for ${guard.name} at ${timeStr}.`);
    }
  };

  const regularizeAttendance = (attendanceId: string, notes: string) => {
    setAttendance(prev => prev.map(a => {
      if (a.id === attendanceId) {
        return {
          ...a,
          status: 'Regularized',
          supervisorVerified: true,
          verificationNotes: `Supervisor Regularized: ${notes}`
        };
      }
      return a;
    }));
    logAudit('APPROVE', 'Attendance', `Regularized attendance record ${attendanceId}`);
    addToast('success', 'Attendance Approved', 'Exception regularized and verified for payroll processing.');
  };

  const scanPatrolCheckpoint = (patrolId: string, checkpointId: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setPatrols(prev => prev.map(p => {
      if (p.id === patrolId) {
        const updatedCheckpoints = p.checkpoints.map(cp => {
          if (cp.id === checkpointId) {
            return { ...cp, scannedAt: timeStr, status: 'Completed' as const };
          }
          return cp;
        });
        const completedCount = updatedCheckpoints.filter(cp => cp.status === 'Completed').length;
        const total = updatedCheckpoints.length;
        const score = Math.round((completedCount / total) * 100);
        const status = completedCount === total ? 'Completed' : 'In Progress';
        return {
          ...p,
          checkpoints: updatedCheckpoints,
          complianceScorePercent: score,
          status: status as PatrolLog['status'],
          completedTime: status === 'Completed' ? timeStr : p.completedTime
        };
      }
      return p;
    }));

    logAudit('UPDATE', 'Patrol', `Scanned checkpoint ${checkpointId} on patrol ${patrolId}`);
    addToast('success', 'Checkpoint Verified', `QR scan confirmed at ${timeStr}. Patrol log updated.`);
  };

  const reportIncident = (incidentData: Partial<Incident>) => {
    const id = 'inc-' + (incidents.length + 1);
    const site = sites.find(s => s.id === incidentData.siteId);
    const newIncident: Incident = {
      id,
      incidentNumber: `INC-2026-0${90 + incidents.length + 1}`,
      siteId: incidentData.siteId || 'st-1',
      siteName: site?.name || 'DLF CyberCity - Tower 10A & 10B',
      reportedByGuardId: currentUser.id,
      reportedByName: currentUser.name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      severity: incidentData.severity || 'Medium',
      category: incidentData.category || 'Suspicious Activity',
      title: incidentData.title || 'Security Anomaly Reported',
      description: incidentData.description || 'Routine observation of perimeter irregularity.',
      immediateActionTaken: incidentData.immediateActionTaken || 'Guard secured area and briefed supervisor.',
      investigator: incidentData.investigator || 'Subedar Balwant Singh',
      status: 'Reported',
      rootCause: incidentData.rootCause,
      preventiveAction: incidentData.preventiveAction
    };

    setIncidents(prev => [newIncident, ...prev]);
    logAudit('CREATE', 'Incidents', `Logged ${newIncident.severity} incident: ${newIncident.title}`);
    addToast('danger', 'Incident Logged', `Incident ${newIncident.incidentNumber} (${newIncident.severity}) registered and broadcast.`);
  };

  const updateIncidentStatus = (id: string, status: Incident['status'], rootCause?: string, preventiveAction?: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        return {
          ...inc,
          status,
          rootCause: rootCause || inc.rootCause,
          preventiveAction: preventiveAction || inc.preventiveAction
        };
      }
      return inc;
    }));

    logAudit('UPDATE', 'Incidents', `Updated incident ${id} status to ${status}`);
    addToast('info', 'Incident Updated', `Status updated to ${status}.`);
  };

  const triggerEmergencySOS = (guardId: string, siteId: string, isTest = false) => {
    const guard = guards.find(g => g.id === guardId) || guards[0];
    const site = sites.find(s => s.id === siteId) || sites[0];

    const newSOS: SOSAlert = {
      id: 'sos-' + Date.now(),
      guardId: guard.id,
      guardName: guard.name,
      guardPhone: guard.phone,
      siteId: site.id,
      siteName: site.name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      gpsLat: site.latitude,
      gpsLng: site.longitude,
      isTestAlert: isTest,
      status: 'Triggered'
    };

    setSosAlerts(prev => [newSOS, ...prev]);
    logAudit('CREATE', 'SOS', `${isTest ? 'TEST' : 'EMERGENCY'} SOS initiated by ${guard.name} at ${site.name}`);
    addToast('danger', isTest ? 'Test SOS Triggered' : 'CRITICAL SOS ALERT TRIGGERED!', `Emergency signal received from ${guard.name} at ${site.name}. Quick Response dispatched.`);
  };

  const acknowledgeSOS = (id: string, responderName: string) => {
    setSosAlerts(prev => prev.map(s => s.id === id ? { ...s, status: 'Responder Dispatched', responderName } : s));
    logAudit('APPROVE', 'SOS', `Acknowledged SOS alert ${id}, responder ${responderName} dispatched`);
    addToast('warning', 'SOS Acknowledged', `${responderName} dispatched to emergency coordinates.`);
  };

  const resolveSOS = (id: string, notes: string) => {
    setSosAlerts(prev => prev.map(s => s.id === id ? { ...s, status: 'Resolved', resolutionNotes: notes } : s));
    logAudit('APPROVE', 'SOS', `Resolved SOS alert ${id}`);
    addToast('success', 'SOS Cleared', 'Emergency resolved and closed in operational log.');
  };

  const addCandidate = (candData: Partial<RecruitmentCandidate>) => {
    const id = 'cand-' + Date.now();
    const newCandidate: RecruitmentCandidate = {
      id,
      candidateNumber: `CAN-2026-${100 + candidates.length + 1}`,
      fullName: candData.fullName || 'New Candidate',
      phone: candData.phone || '+91 98000 00000',
      email: candData.email || 'candidate@gmail.com',
      appliedCategory: candData.appliedCategory || 'Unarmed Guard',
      source: candData.source || 'Direct Walk-in',
      experienceYears: candData.experienceYears || 2,
      expectedSalary: candData.expectedSalary || 16000,
      stage: 'New Candidate',
      policeVerificationStatus: candData.policeVerificationStatus || 'In Process',
      interviewDate: new Date(Date.now() + 86400000 * 2).toISOString().substring(0, 10),
      notes: candData.notes || 'Candidate profile registered into ERP funnel.'
    };
    setCandidates(prev => [newCandidate, ...prev]);
    logAudit('CREATE', 'Recruitment', `Added candidate ${newCandidate.fullName}`);
    addToast('success', 'Candidate Added', `${newCandidate.fullName} registered in recruitment funnel.`);
  };

  const updateCandidateStage = (candidateId: string, stage: RecruitmentCandidate['stage']) => {
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, stage } : c));
    logAudit('UPDATE', 'Recruitment', `Candidate ${candidateId} advanced to stage ${stage}`);
    addToast('info', 'Recruitment Pipeline', `Candidate moved to ${stage}.`);
  };

  const convertCandidateToGuard = (candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    addGuard({
      name: candidate.fullName,
      phone: candidate.phone,
      email: candidate.email,
      category: candidate.appliedCategory,
      rank: 'Probationary Guard',
      policeVerificationStatus: candidate.policeVerificationStatus,
      kycStatus: 'Verified'
    });

    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, stage: 'Joined' } : c));
    logAudit('CREATE', 'Recruitment', `Converted candidate ${candidate.fullName} to permanent guard without duplicate entry`);
    addToast('success', 'Employee Onboarded', `${candidate.fullName} converted to official Guard master record.`);
  };

  const applyLeave = (leaveData: Partial<LeaveRequest>) => {
    const id = 'lv-' + Date.now();
    const guard = guards.find(g => g.id === leaveData.guardId) || guards[0];
    const newLeave: LeaveRequest = {
      id,
      guardId: guard?.id || 'gd-1',
      guardName: guard?.name || 'Guard Personnel',
      leaveType: (leaveData.leaveType as LeaveRequest['leaveType']) || 'Casual Leave',
      startDate: leaveData.startDate || new Date().toISOString().substring(0, 10),
      endDate: leaveData.endDate || new Date(Date.now() + 86400000 * 3).toISOString().substring(0, 10),
      daysCount: leaveData.daysCount || 3,
      reason: leaveData.reason || 'Personal / Family requirement',
      status: 'Pending'
    };
    setLeaves(prev => [newLeave, ...prev]);
    logAudit('CREATE', 'Leave', `Leave application submitted for ${guard?.name || 'guard'}`);
    addToast('success', 'Leave Submitted', `Leave request for ${guard?.name || 'guard'} submitted for supervisor approval.`);
  };

  const approveLeave = (id: string) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'Approved', approvedBy: currentUser.name } : l));
    logAudit('APPROVE', 'Leave', `Approved leave request ${id}`);
    addToast('success', 'Leave Approved', 'Guard leave request approved and roster reliever scheduled.');
  };

  const rejectLeave = (id: string) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: 'Rejected' } : l));
    logAudit('REJECT', 'Leave', `Rejected leave request ${id}`);
    addToast('warning', 'Leave Rejected', 'Leave request declined due to staffing shortage.');
  };

  const generateCurrentMonthPayroll = () => {
    const period = 'October 2026';
    const totalGuards = guards.filter(g => g.status === 'Active').length;
    let grossTotal = 0;
    let deductionsTotal = 0;

    const payslips = guards.map((g, idx) => {
      const basic = g.salaryStructure.basic;
      const hra = g.salaryStructure.hra;
      const allowances = g.salaryStructure.conveyance + g.salaryStructure.specialAllowance;
      const otHours = (idx % 3) * 6;
      const otPay = otHours * g.salaryStructure.overtimeHourlyRate;
      const gross = basic + hra + allowances + otPay;
      const pf = Math.round(basic * 0.12);
      const esic = Math.round(gross * 0.0075);
      const pt = 200;
      const deductions = pf + esic + pt;
      const net = gross - deductions;

      grossTotal += gross;
      deductionsTotal += deductions;

      return {
        guardId: g.id,
        guardName: g.name,
        category: g.category,
        daysWorked: 26,
        otHours,
        basicSalary: basic,
        hra,
        allowances,
        otPay,
        grossSalary: gross,
        pfDeduction: pf,
        esicDeduction: esic,
        ptDeduction: pt,
        otherDeductions: 0,
        netSalary: net,
        payslipNumber: `SGF-PS-202610-${String(idx + 1).padStart(3, '0')}`,
        paymentStatus: 'Processing' as const
      };
    });

    const newRun: PayrollRun = {
      id: 'pay-2026-10',
      periodMonth: period,
      runDate: new Date().toISOString().substring(0, 10),
      totalGuards,
      grossPayroll: grossTotal,
      totalDeductions: deductionsTotal,
      netPayroll: grossTotal - deductionsTotal,
      status: 'Calculated',
      payslips
    };

    setPayrollRuns(prev => [newRun, ...prev.filter(r => r.id !== newRun.id)]);
    logAudit('CREATE', 'Payroll', `Calculated ${period} payroll run for ${totalGuards} guards (Net: ₹${(grossTotal - deductionsTotal).toLocaleString()})`);
    addToast('success', 'Payroll Calculated', `${period} payroll run calculated successfully. Awaiting approval.`);
  };

  const approvePayrollRun = (id: string) => {
    setPayrollRuns(prev => prev.map(p => p.id === id ? { ...p, status: 'Approved', approvedBy: currentUser.name } : p));
    logAudit('APPROVE', 'Payroll', `Approved payroll run ${id}`);
    addToast('success', 'Payroll Run Approved', 'Payroll locked for bank NEFT file generation and payslip distribution.');
  };

  const generateInvoiceFromContract = (clientId: string, billingPeriod: string) => {
    const client = clients.find(c => c.id === clientId);
    const contract = contracts.find(c => c.clientId === clientId && c.status === 'Active');
    if (!client || !contract) {
      addToast('warning', 'No Active Contract', 'Cannot generate invoice without active approved contract.');
      return;
    }

    const lineItems = contract.rates.map((rate, idx) => ({
      id: 'li-' + Date.now() + idx,
      description: `${rate.category} Deployment (${rate.requiredCount} posts)`,
      category: rate.category,
      guardsCount: rate.requiredCount,
      ratePerMonth: rate.ratePerMonth,
      amount: rate.requiredCount * rate.ratePerMonth
    }));

    const subtotal = lineItems.reduce((acc, curr) => acc + curr.amount, 0);
    const serviceCharge = Math.round(subtotal * (contract.serviceFeePercent / 100));
    const taxable = subtotal + serviceCharge;
    const cgst = Math.round(taxable * 0.09);
    const sgst = Math.round(taxable * 0.09);
    const total = taxable + cgst + sgst;

    const newInvoice: ClientInvoice = {
      id: 'inv-' + Date.now(),
      invoiceNumber: `SGF-INV-2026-${100 + invoices.length + 1}`,
      clientId: client.id,
      clientName: client.name,
      billingPeriod,
      issueDate: new Date().toISOString().substring(0, 10),
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().substring(0, 10),
      lineItems,
      subtotal,
      serviceChargePercent: contract.serviceFeePercent,
      serviceChargeAmount: serviceCharge,
      cgst,
      sgst,
      totalAmount: total,
      paidAmount: 0,
      balanceDue: total,
      status: 'Review'
    };

    setInvoices(prev => [newInvoice, ...prev]);
    logAudit('CREATE', 'Billing', `Auto-generated invoice ${newInvoice.invoiceNumber} for ${client.name} (₹${total.toLocaleString()})`);
    addToast('success', 'Invoice Generated', `Invoice ${newInvoice.invoiceNumber} created from contract rates.`);
  };

  const approveInvoice = (id: string) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'Issued' } : inv));
    logAudit('APPROVE', 'Billing', `Approved and issued invoice ${id}`);
    addToast('success', 'Invoice Issued', 'Invoice approved and ready for client delivery.');
  };

  const recordPaymentReceipt = (receiptData: Partial<PaymentReceipt>) => {
    const id = 'rc-' + Date.now();
    const client = clients.find(c => c.id === receiptData.clientId);
    const amount = receiptData.amount || 100000;
    const tds = receiptData.tdsAmount || Math.round(amount * 0.02);

    const newReceipt: PaymentReceipt = {
      id,
      receiptNumber: `SGF-RCP-2026-${90 + payments.length + 1}`,
      clientId: receiptData.clientId || 'cl-1',
      clientName: client?.name || 'DLF CyberCity Developers',
      paymentDate: receiptData.paymentDate || new Date().toISOString().substring(0, 10),
      amount,
      tdsDeducted: tds,
      netReceived: amount - tds,
      paymentMode: receiptData.paymentMode || 'NEFT/RTGS',
      referenceNumber: receiptData.referenceNumber || 'UTR' + Math.random().toString().substring(2, 14),
      allocatedInvoiceIds: receiptData.allocatedInvoiceIds || ['inv-1'],
      notes: receiptData.notes || 'Payment credited via bank transfer.'
    };

    setPayments(prev => [newReceipt, ...prev]);

    // Update invoice balance
    setInvoices(prev => prev.map(inv => {
      if (newReceipt.allocatedInvoiceIds.includes(inv.id)) {
        const newPaid = inv.paidAmount + amount;
        const newBal = Math.max(0, inv.totalAmount - newPaid);
        return {
          ...inv,
          paidAmount: newPaid,
          balanceDue: newBal,
          status: newBal === 0 ? 'Paid' : 'Partially Paid'
        };
      }
      return inv;
    }));

    logAudit('CREATE', 'Collections', `Recorded payment receipt ${newReceipt.receiptNumber} of ₹${amount.toLocaleString()} for ${newReceipt.clientName}`);
    addToast('success', 'Payment Recorded', `Receipt voucher ${newReceipt.receiptNumber} generated.`);
  };

  const addCRMLead = (leadData: Partial<CRMLead>) => {
    const id = 'lead-' + Date.now();
    const newLead: CRMLead = {
      id,
      companyName: leadData.companyName || 'New Enterprise Client',
      contactPerson: leadData.contactPerson || 'Operations Head',
      email: leadData.email || 'contact@client.com',
      phone: leadData.phone || '+91 98000 00000',
      industry: leadData.industry || 'Corporate Office',
      requiredGuards: leadData.requiredGuards || 12,
      estimatedMonthlyValue: leadData.estimatedMonthlyValue || 150000,
      stage: leadData.stage || 'Lead',
      assignedTo: leadData.assignedTo || currentUser.name,
      expectedClosingDate: leadData.expectedClosingDate || new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10),
      probabilityPercent: leadData.probabilityPercent || 60,
      notes: leadData.notes || 'Prospect lead created in CRM.'
    };
    setCrmLeads(prev => [newLead, ...prev]);
    logAudit('CREATE', 'CRM', `Added new CRM lead ${newLead.companyName}`);
    addToast('success', 'Lead Created', `${newLead.companyName} added to sales pipeline.`);
  };

  const updateLeadStage = (id: string, stage: CRMLead['stage']) => {
    setCrmLeads(prev => prev.map(l => l.id === id ? { ...l, stage } : l));
    logAudit('UPDATE', 'CRM', `Updated lead ${id} stage to ${stage}`);
    addToast('info', 'CRM Pipeline', `Lead updated to ${stage}.`);
  };

  const convertLeadToClient = (leadId: string) => {
    const lead = crmLeads.find(l => l.id === leadId);
    if (!lead) return;

    addClient({
      name: lead.companyName,
      legalEntityName: lead.companyName + ' Pvt Ltd',
      industry: lead.industry,
      primaryContactName: lead.contactPerson,
      email: lead.email,
      phone: lead.phone,
      monthlyBilledAmount: lead.estimatedMonthlyValue
    });

    setCrmLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: 'Won' } : l));
    logAudit('CREATE', 'CRM', `Converted won lead ${lead.companyName} to client record`);
    addToast('success', 'Lead Won & Converted', `${lead.companyName} converted to client master.`);
  };

  const submitComplaint = (data: Partial<ClientComplaint>) => {
    const id = 'cmp-' + Date.now();
    const newComplaint: ClientComplaint = {
      id,
      complaintNumber: `TKT-2026-${String(complaints.length + 36).padStart(3, '0')}`,
      clientId: currentUser.clientId || 'cl-1',
      clientName: clients.find(c => c.id === (currentUser.clientId || 'cl-1'))?.name || 'Client',
      siteId: data.siteId || 'st-1',
      siteName: sites.find(s => s.id === data.siteId)?.name || 'DLF CyberCity - Tower 10A & 10B',
      title: data.title || 'Client Service Inquiry',
      description: data.description || '',
      priority: data.priority || 'Medium',
      status: 'Open',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setComplaints(prev => [newComplaint, ...prev]);
    logAudit('CREATE', 'Client Portal', `Client logged service ticket ${newComplaint.complaintNumber}`);
    addToast('info', 'Service Ticket Created', `Ticket ${newComplaint.complaintNumber} dispatched to Operations team.`);
  };

  const resolveComplaint = (id: string, notes: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'Resolved', resolutionNotes: notes } : c));
    logAudit('APPROVE', 'Client Portal', `Resolved client ticket ${id}`);
    addToast('success', 'Ticket Resolved', 'Client complaint marked resolved with resolution audit.');
  };

  // Dynamically compute live KPIs from data
  const activeGuardsCount = guards.filter(g => g.status === 'Active').length;
  const requiredStrengthTotal = sites.reduce((sum, s) => sum + s.requiredStrength, 0);
  const deployedCount = attendance.filter(a => a.status === 'Present' || a.status === 'Late' || a.status === 'Overtime').length;
  const deployedPercentage = Math.round((deployedCount / (requiredStrengthTotal || 1)) * 100);
  const unfilledPostsCount = Math.max(0, requiredStrengthTotal - deployedCount);
  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const absentCount = guards.filter(g => g.status === 'On Leave').length + 2;
  const lateCount = attendance.filter(a => a.status === 'Late').length;
  const activeSitesCount = sites.filter(s => s.status === 'Active').length;
  const openIncidentsCount = incidents.filter(i => i.status !== 'Closed' && i.status !== 'Resolved').length;
  const activeSOSCount = sosAlerts.filter(s => s.status === 'Triggered' || s.status === 'Acknowledged').length;
  
  const patrolComplianceRate = patrols.length > 0 
    ? Math.round(patrols.reduce((sum, p) => sum + p.complianceScorePercent, 0) / patrols.length)
    : 100;

  const monthlyPayrollTotal = payrollRuns.length > 0 ? payrollRuns[0].netPayroll : 2482300;
  const monthlyBillingTotal = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const collectionsTotal = payments.reduce((sum, p) => sum + p.amount, 0);
  const outstandingReceivablesTotal = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);
  const overdueInvoicesTotal = invoices.filter(inv => inv.status === 'Overdue').reduce((sum, inv) => sum + inv.balanceDue, 0);
  const grossMarginPercent = monthlyBillingTotal > 0 ? Math.round(((monthlyBillingTotal - monthlyPayrollTotal) / monthlyBillingTotal) * 100) : 18;

  return (
    <ERPContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        language,
        setLanguage,
        toggleLanguage,
        t,
        activeModule,
        setActiveModule,
        adminTab,
        setAdminTab,
        openSetupTab,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebar,
        isAuthenticated,
        currentUser,
        login,
        logout,
        switchRole,
        isSearchOpen,
        setIsSearchOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        toasts,
        addToast,
        removeToast,
        clients,
        sites,
        guards,
        contracts,
        shifts,
        attendance,
        patrols,
        incidents,
        sosAlerts,
        candidates,
        leaves,
        uniforms,
        payrollRuns,
        invoices,
        payments,
        crmLeads,
        complaints,
        integrations,
        auditLogs,
        addGuard,
        updateGuard,
        deleteGuard,
        addClient,
        addSite,
        addContract,
        assignGuardToShift,
        recordPunch,
        regularizeAttendance,
        scanPatrolCheckpoint,
        reportIncident,
        updateIncidentStatus,
        triggerEmergencySOS,
        acknowledgeSOS,
        resolveSOS,
        addCandidate,
        updateCandidateStage,
        convertCandidateToGuard,
        applyLeave,
        approveLeave,
        rejectLeave,
        generateCurrentMonthPayroll,
        approvePayrollRun,
        generateInvoiceFromContract,
        approveInvoice,
        recordPaymentReceipt,
        addCRMLead,
        updateLeadStage,
        convertLeadToClient,
        submitComplaint,
        resolveComplaint,
        kpis: {
          activeGuardsCount,
          requiredStrengthTotal,
          deployedPercentage,
          unfilledPostsCount,
          presentCount,
          absentCount,
          lateCount,
          activeSitesCount,
          openIncidentsCount,
          activeSOSCount,
          patrolComplianceRate,
          monthlyPayrollTotal,
          monthlyBillingTotal,
          collectionsTotal,
          outstandingReceivablesTotal,
          overdueInvoicesTotal,
          grossMarginPercent
        }
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) throw new Error('useERP must be used within an ERPProvider');
  return context;
};
