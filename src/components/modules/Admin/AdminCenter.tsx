import React, { useState } from 'react';
import { 
  Settings, Users, Shield, Key, Database, 
  Activity, CheckCircle, RefreshCw, Download, 
  ExternalLink, Server, Globe, FileCode, Check,
  Plus, Edit2, Trash2, Search, Filter, ShieldCheck,
  Building2, MapPin, Phone, Mail, AlertTriangle, Lock,
  Eye, Copy, Sliders, CheckSquare, Save, X
} from 'lucide-react';
import { useERP, AdminSubTab } from '../../../context/ERPContext';
import { RoleType } from '../../../types/erp';
import { initialBranches } from '../../../data/initialData';
import { StatusBadge } from '../../common/StatusBadge';
import { Modal } from '../../common/Modal';

interface BranchItem {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  manager: string;
  phone: string;
}

interface StaffUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: RoleType;
  branch: string;
  status: 'Active' | 'Suspended';
  twoFactor: boolean;
  lastLogin: string;
}

interface MasterItem {
  id: string;
  category: string;
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
}

interface CustomFieldItem {
  id: string;
  entity: 'Guards' | 'Clients' | 'Sites' | 'Contracts';
  name: string;
  type: 'Text' | 'Number' | 'Date' | 'Dropdown' | 'File';
  mandatory: boolean;
  status: 'Active' | 'Inactive';
}

export const AdminCenter: React.FC = () => {
  const { 
    auditLogs, integrations, currentUser, 
    guards, clients, sites, invoices, t, addToast,
    adminTab, setAdminTab
  } = useERP();

  // Branches State
  const [branches, setBranches] = useState<BranchItem[]>(initialBranches);
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [newBranch, setNewBranch] = useState({
    name: '',
    code: '',
    city: '',
    state: '',
    manager: '',
    phone: ''
  });

  // Users State
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([
    { id: 'usr-1', name: 'Brig. Alok Sharma (Retd.)', email: 'admin@safeguardforce.in', phone: '+91 98110 55443', role: 'SUPER_ADMIN', branch: 'Delhi NCR Regional HQ', status: 'Active', twoFactor: true, lastLogin: '10 mins ago' },
    { id: 'usr-2', name: 'Maj. Sandeep Batra (Retd.)', email: 'ops.manager@safeguardforce.in', phone: '+91 98111 22334', role: 'OPERATIONS_MANAGER', branch: 'Delhi NCR Regional HQ', status: 'Active', twoFactor: true, lastLogin: '25 mins ago' },
    { id: 'usr-3', name: 'Pooja Kashyap', email: 'hr.recruitment@safeguardforce.in', phone: '+91 98222 33445', role: 'HR_RECRUITMENT', branch: 'Delhi NCR Regional HQ', status: 'Active', twoFactor: true, lastLogin: '2 hours ago' },
    { id: 'usr-4', name: 'Ramesh Chandra', email: 'accounts@safeguardforce.in', phone: '+91 98333 44556', role: 'PAYROLL_ACCOUNTS', branch: 'Delhi NCR Regional HQ', status: 'Active', twoFactor: true, lastLogin: 'Yesterday' },
    { id: 'usr-5', name: 'Subedar Balwant Singh', email: 'supervisor.north@safeguardforce.in', phone: '+91 98444 55667', role: 'SITE_SUPERVISOR', branch: 'Delhi NCR Regional HQ', status: 'Active', twoFactor: false, lastLogin: 'Today 08:30' },
    { id: 'usr-6', name: 'Ajay Kadam', email: 'mumbai.ops@safeguardforce.in', phone: '+91 22 28456789', role: 'OPERATIONS_MANAGER', branch: 'Mumbai Western Operations', status: 'Active', twoFactor: true, lastLogin: 'Today 09:15' },
    { id: 'usr-7', name: 'M. S. Murthy', email: 'bangalore.ops@safeguardforce.in', phone: '+91 80 23456789', role: 'OPERATIONS_MANAGER', branch: 'Bengaluru Southern Hub', status: 'Active', twoFactor: true, lastLogin: '3 days ago' },
    { id: 'usr-8', name: 'K. V. Reddy', email: 'hyderabad.ops@safeguardforce.in', phone: '+91 40 24567890', role: 'OPERATIONS_MANAGER', branch: 'Hyderabad Cyberabad', status: 'Active', twoFactor: false, lastLogin: 'Yesterday' }
  ]);
  const [userSearch, setUserSearch] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'OPERATIONS_MANAGER' as RoleType,
    branch: 'Delhi NCR Regional HQ'
  });

  // Masters State
  const [masterCategory, setMasterCategory] = useState('designations');
  const [mastersList, setMastersList] = useState<MasterItem[]>([
    { id: 'm-1', category: 'designations', name: 'Unarmed Security Guard', code: 'DES-SG', status: 'Active' },
    { id: 'm-2', category: 'designations', name: 'Armed Gunman (12 Bore / .32)', code: 'DES-GUN', status: 'Active' },
    { id: 'm-3', category: 'designations', name: 'Head Security Guard', code: 'DES-HG', status: 'Active' },
    { id: 'm-4', category: 'designations', name: 'Site Area Supervisor', code: 'DES-SUP', status: 'Active' },
    { id: 'm-5', category: 'designations', name: 'Assistant Security Officer (ASO)', code: 'DES-ASO', status: 'Active' },
    { id: 'm-6', category: 'designations', name: 'Security Officer (SO)', code: 'DES-SO', status: 'Active' },
    { id: 'm-7', category: 'designations', name: 'Executive Protection / Bouncer', code: 'DES-CPO', status: 'Active' },

    { id: 'm-8', category: 'uniforms', name: 'Security Guard Shirt (Khaki / Navy)', code: 'UNI-SHIRT', status: 'Active' },
    { id: 'm-9', category: 'uniforms', name: 'Tactical Trousers (Navy Blue)', code: 'UNI-PANTS', status: 'Active' },
    { id: 'm-10', category: 'uniforms', name: 'Beret with Brass Shield Crest', code: 'UNI-BERET', status: 'Active' },
    { id: 'm-11', category: 'uniforms', name: 'High-Ankle Tactical DMS Boots', code: 'UNI-BOOTS', status: 'Active' },
    { id: 'm-12', category: 'uniforms', name: 'Lanyard with Brass Whistle', code: 'UNI-WHISTLE', status: 'Active' },
    { id: 'm-13', category: 'uniforms', name: 'High-Visibility Reflective Night Vest', code: 'UNI-VEST', status: 'Active' },

    { id: 'm-14', category: 'shifts', name: 'Morning Shift (06:00 - 14:00)', code: 'SHT-MORN', status: 'Active' },
    { id: 'm-15', category: 'shifts', name: 'Evening Shift (14:00 - 22:00)', code: 'SHT-EVE', status: 'Active' },
    { id: 'm-16', category: 'shifts', name: 'Night Vigil Shift (22:00 - 06:00)', code: 'SHT-NGT', status: 'Active' },
    { id: 'm-17', category: 'shifts', name: 'General Office Shift (09:00 - 18:00)', code: 'SHT-GEN', status: 'Active' },
    { id: 'm-18', category: 'shifts', name: '12-Hour Continuous Day (08:00 - 20:00)', code: 'SHT-12D', status: 'Active' },
    { id: 'm-19', category: 'shifts', name: '12-Hour Continuous Night (20:00 - 08:00)', code: 'SHT-12N', status: 'Active' },

    { id: 'm-20', category: 'incidents', name: 'Unauthorized Entry / Trespassing', code: 'INC-TRES', status: 'Active' },
    { id: 'm-21', category: 'incidents', name: 'Theft / Asset Pilferage Attempt', code: 'INC-THEFT', status: 'Active' },
    { id: 'm-22', category: 'incidents', name: 'Perimeter Barrier or Gate Breach', code: 'INC-BREACH', status: 'Active' },
    { id: 'm-23', category: 'incidents', name: 'Fire / Smoke Sensor Alarm Activation', code: 'INC-FIRE', status: 'Active' },
    { id: 'm-24', category: 'incidents', name: 'Guard Asleep / Negligence on Duty', code: 'INC-NEGL', status: 'Active' },
    { id: 'm-25', category: 'incidents', name: 'Client Staff Dispute / Altercation', code: 'INC-DISP', status: 'Active' },

    { id: 'm-26', category: 'industries', name: 'IT & ITES Cyber Parks', code: 'IND-IT', status: 'Active' },
    { id: 'm-27', category: 'industries', name: 'Grade-A Commercial Office Towers', code: 'IND-COMM', status: 'Active' },
    { id: 'm-28', category: 'industries', name: 'Banking & Financial Vault Facilities', code: 'IND-BFSI', status: 'Active' },
    { id: 'm-29', category: 'industries', name: 'Gated Luxury Residential Communities', code: 'IND-RESI', status: 'Active' },
    { id: 'm-30', category: 'industries', name: 'Heavy Industrial & Logistics Warehouses', code: 'IND-MFG', status: 'Active' },

    { id: 'm-31', category: 'leaves', name: 'Earned Leave (EL / PL)', code: 'LV-EL', status: 'Active' },
    { id: 'm-32', category: 'leaves', name: 'Casual Leave (CL)', code: 'LV-CL', status: 'Active' },
    { id: 'm-33', category: 'leaves', name: 'Medical / Sick Leave (SL)', code: 'LV-SL', status: 'Active' },
    { id: 'm-34', category: 'leaves', name: 'Compensatory Off (CO)', code: 'LV-CO', status: 'Active' }
  ]);
  const [isAddMasterOpen, setIsAddMasterOpen] = useState(false);
  const [newMaster, setNewMaster] = useState({ name: '', code: '' });

  // Custom Fields State
  const [customFields, setCustomFields] = useState<CustomFieldItem[]>([
    { id: 'cf-1', entity: 'Guards', name: 'Police Verification File Reference No.', type: 'Text', mandatory: true, status: 'Active' },
    { id: 'cf-2', entity: 'Guards', name: 'Ex-Serviceman Army Regimental Corps', type: 'Dropdown', mandatory: false, status: 'Active' },
    { id: 'cf-3', entity: 'Guards', name: 'Firefighting Training Certificate ID', type: 'Text', mandatory: false, status: 'Active' },
    { id: 'cf-4', entity: 'Sites', name: 'Perimeter Geofence Radius (Meters)', type: 'Number', mandatory: true, status: 'Active' },
    { id: 'cf-5', entity: 'Sites', name: 'Hazard Fire Zone Rating', type: 'Dropdown', mandatory: true, status: 'Active' },
    { id: 'cf-6', entity: 'Contracts', name: 'Client Cost Center / GL Code', type: 'Text', mandatory: false, status: 'Active' },
    { id: 'cf-7', entity: 'Contracts', name: 'Special SLA Penalties Applicable', type: 'Dropdown', mandatory: false, status: 'Active' }
  ]);
  const [isAddCustomFieldOpen, setIsAddCustomFieldOpen] = useState(false);
  const [newCustomField, setNewCustomField] = useState({
    entity: 'Guards' as CustomFieldItem['entity'],
    name: '',
    type: 'Text' as CustomFieldItem['type'],
    mandatory: false
  });

  // Settings State
  const [companySettings, setCompanySettings] = useState({
    companyName: 'Safe Guard Force Private Limited',
    tagline: 'Enterprise Security & Workforce Management',
    cin: 'U74920DL1990PTC041289',
    psaraLicense: 'PSARA/DEL/2021/8892',
    psaraExpiry: '31/03/2028',
    gstin: '07AAACS1429B1Z8',
    pan: 'AAACS1429B',
    pfCode: 'DL/CPM/0029384/000',
    esicCode: '11000348290001001',
    currency: 'INR (₹)',
    timezone: 'Asia/Kolkata (IST +05:30)',
    financialYear: '01 April - 31 March',
    geofenceToleranceMeters: 100,
    autoAbsentMinutes: 60,
    sessionTimeoutMinutes: 30,
    enforce2FA: true
  });

  // Permissions list for roles
  const permissionsList = [
    { module: 'Guard Master & KYC', view: true, create: true, edit: true, approve: true, delete: false },
    { module: 'Client & Site Contracts', view: true, create: true, edit: true, approve: true, delete: false },
    { module: 'Shift Rostering & Deployments', view: true, create: true, edit: true, approve: true, delete: true },
    { module: 'GPS Attendance & Regularization', view: true, create: true, edit: true, approve: true, delete: false },
    { module: 'Patrol Checkpoints', view: true, create: true, edit: true, approve: false, delete: false },
    { module: 'Incident Dossiers & CAPA', view: true, create: true, edit: true, approve: true, delete: false },
    { module: 'Payroll Disbursal & Payslips', view: true, create: true, edit: true, approve: true, delete: false },
    { module: 'Client Invoicing & GST', view: true, create: true, edit: true, approve: true, delete: false },
    { module: 'Collections & Bank Receipts', view: true, create: true, edit: true, approve: true, delete: false },
    { module: 'Emergency SOS Broadcast', view: true, create: true, edit: true, approve: true, delete: false }
  ];

  // Handlers
  const handleDownloadFullDatabaseBackup = () => {
    const fullBackup = {
      backupTimestamp: new Date().toISOString(),
      platform: "Safe Guard Force Enterprise ERP",
      version: "2.4.0-PROD",
      database: {
        guardsCount: guards.length,
        clientsCount: clients.length,
        sitesCount: sites.length,
        invoicesCount: invoices.length,
        auditLogsCount: auditLogs.length,
        branchesCount: branches.length,
        usersCount: staffUsers.length,
        companySettings,
        guards,
        clients,
        sites,
        invoices,
        auditLogs,
        branches,
        staffUsers,
        mastersList,
        customFields
      }
    };

    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SGF_Full_Enterprise_Backup_${new Date().toISOString().substring(0, 10)}.json`;
    link.click();
    addToast('success', 'Backup Exported', 'Full JSON database snapshot exported with zero lock-in.');
  };

  const handleAddBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch.name || !newBranch.code) {
      addToast('warning', 'Validation', 'Branch Name and Code are required.');
      return;
    }
    const created: BranchItem = {
      id: `br-${Date.now()}`,
      name: newBranch.name,
      code: newBranch.code.toUpperCase(),
      city: newBranch.city || 'Gurugram',
      state: newBranch.state || 'Haryana',
      manager: newBranch.manager || 'Regional Head',
      phone: newBranch.phone || '+91 124 4567890'
    };
    setBranches(prev => [...prev, created]);
    setIsAddBranchOpen(false);
    setNewBranch({ name: '', code: '', city: '', state: '', manager: '', phone: '' });
    addToast('success', 'Branch Created', `${created.name} registered successfully.`);
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      addToast('warning', 'Validation', 'Name and Email are required.');
      return;
    }
    const created: StaffUser = {
      id: `usr-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone || '+91 98000 00000',
      role: newUser.role,
      branch: newUser.branch,
      status: 'Active',
      twoFactor: false,
      lastLogin: 'Never (Invited)'
    };
    setStaffUsers(prev => [created, ...prev]);
    setIsAddUserOpen(false);
    setNewUser({ name: '', email: '', phone: '', role: 'OPERATIONS_MANAGER', branch: 'Delhi NCR Regional HQ' });
    addToast('success', 'User Invited', `Activation invite dispatched to ${created.email}.`);
  };

  const handleAddMasterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaster.name) {
      addToast('warning', 'Validation', 'Master entry name is required.');
      return;
    }
    const code = newMaster.code || `${masterCategory.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const created: MasterItem = {
      id: `m-${Date.now()}`,
      category: masterCategory,
      name: newMaster.name,
      code,
      status: 'Active'
    };
    setMastersList(prev => [...prev, created]);
    setIsAddMasterOpen(false);
    setNewMaster({ name: '', code: '' });
    addToast('success', 'Master Created', `${created.name} added to ${masterCategory}.`);
  };

  const handleAddCustomFieldSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomField.name) {
      addToast('warning', 'Validation', 'Custom field name is required.');
      return;
    }
    const created: CustomFieldItem = {
      id: `cf-${Date.now()}`,
      entity: newCustomField.entity,
      name: newCustomField.name,
      type: newCustomField.type,
      mandatory: newCustomField.mandatory,
      status: 'Active'
    };
    setCustomFields(prev => [...prev, created]);
    setIsAddCustomFieldOpen(false);
    setNewCustomField({ entity: 'Guards', name: '', type: 'Text', mandatory: false });
    addToast('success', 'Field Added', `Custom field "${created.name}" attached to ${created.entity}.`);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Settings Saved', 'Company profile, PSARA parameters, and tax IDs updated.');
  };

  const filteredUsers = staffUsers.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.branch.toLowerCase().includes(userSearch.toLowerCase())
  );

  const currentMasters = mastersList.filter(m => m.category === masterCategory);

  return (
    <div>
      {/* Header */}
      <div className="page-header-row">
        <div className="page-title-box">
          <h1>
            <Settings size={26} color="var(--brand-gold-400)" />
            {t('admin')}
          </h1>
          <p>
            Organization branches, staff user directory, RBAC permissions, system masters, custom fields, company settings, and forensic audit logs.
          </p>
        </div>

        <div className="page-actions-group">
          {adminTab === 'branches' && (
            <button className="btn btn-gold" onClick={() => setIsAddBranchOpen(true)}>
              <Plus size={15} />
              <span>Add Operating Branch</span>
            </button>
          )}
          {adminTab === 'users' && (
            <button className="btn btn-gold" onClick={() => setIsAddUserOpen(true)}>
              <Plus size={15} />
              <span>Invite Staff User</span>
            </button>
          )}
          {adminTab === 'masters' && (
            <button className="btn btn-gold" onClick={() => setIsAddMasterOpen(true)}>
              <Plus size={15} />
              <span>Add Master Entry</span>
            </button>
          )}
          {adminTab === 'customFields' && (
            <button className="btn btn-gold" onClick={() => setIsAddCustomFieldOpen(true)}>
              <Plus size={15} />
              <span>New Custom Field</span>
            </button>
          )}
          <button className="btn btn-secondary" onClick={handleDownloadFullDatabaseBackup}>
            <Download size={15} />
            <span>Full Backup (JSON)</span>
          </button>
        </div>
      </div>

      {/* Tabs Header with All Setup SubTabs */}
      <div className="tabs-header" style={{ overflowX: 'auto', flexWrap: 'nowrap', gap: '6px' }}>
        <button 
          className={`tab-btn ${adminTab === 'branches' ? 'active' : ''}`}
          onClick={() => setAdminTab('branches')}
        >
          <Building2 size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Branches ({branches.length})
        </button>
        <button 
          className={`tab-btn ${adminTab === 'users' ? 'active' : ''}`}
          onClick={() => setAdminTab('users')}
        >
          <Users size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Users & Staff ({staffUsers.length})
        </button>
        <button 
          className={`tab-btn ${adminTab === 'roles' ? 'active' : ''}`}
          onClick={() => setAdminTab('roles')}
        >
          <Shield size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Roles & Permissions
        </button>
        <button 
          className={`tab-btn ${adminTab === 'masters' ? 'active' : ''}`}
          onClick={() => setAdminTab('masters')}
        >
          <CheckSquare size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Masters ({mastersList.length})
        </button>
        <button 
          className={`tab-btn ${adminTab === 'customFields' ? 'active' : ''}`}
          onClick={() => setAdminTab('customFields')}
        >
          <Sliders size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Custom Fields ({customFields.length})
        </button>
        <button 
          className={`tab-btn ${adminTab === 'settings' ? 'active' : ''}`}
          onClick={() => setAdminTab('settings')}
        >
          <Settings size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Company Settings
        </button>
        <button 
          className={`tab-btn ${adminTab === 'audit' ? 'active' : ''}`}
          onClick={() => setAdminTab('audit')}
        >
          <Activity size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Audit Trail ({auditLogs.length})
        </button>
        <button 
          className={`tab-btn ${adminTab === 'api' ? 'active' : ''}`}
          onClick={() => setAdminTab('api')}
        >
          <Key size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          REST API & Webhooks
        </button>
        <button 
          className={`tab-btn ${adminTab === 'integrations' ? 'active' : ''}`}
          onClick={() => setAdminTab('integrations')}
        >
          <Server size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Integrations ({integrations.length})
        </button>
      </div>

      {/* =========================================================================
          TAB 1: BRANCHES & UNITS
         ========================================================================= */}
      {adminTab === 'branches' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '20px' }}>
          {branches.map(branch => (
            <div key={branch.id} className="card" style={{ borderTop: '3px solid var(--brand-gold-500)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand-gold-500)', fontSize: '12px' }}>
                  {branch.code}
                </span>
                <span className="badge badge-success">Operating</span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{branch.name}</h3>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={13} color="var(--brand-gold-400)" />
                {branch.city}, {branch.state}
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', fontSize: '12.5px' }}>
                <div>Regional Head: <strong>{branch.manager}</strong></div>
                <div style={{ color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={12} /> {branch.phone}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================================
          TAB 2: USERS & STAFF DIRECTORY
         ========================================================================= */}
      {adminTab === 'users' && (
        <div className="table-container">
          <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', minWidth: '240px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
                <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search user by name, email, or role..." 
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  style={{ paddingLeft: '32px' }}
                />
              </div>
            </div>

            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Showing <strong>{filteredUsers.length}</strong> active staff members
            </div>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Staff Member</th>
                  <th>System Role</th>
                  <th>Assigned Branch</th>
                  <th>Contact Info</th>
                  <th>2FA Status</th>
                  <th>Last Active</th>
                  <th>Account Status</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #1e3a8a, #0f172a)',
                          border: '1px solid var(--brand-gold-500)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '12px',
                          color: '#ffffff'
                        }}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{user.name}</div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        user.role === 'SUPER_ADMIN' ? 'badge-danger' :
                        user.role === 'OPERATIONS_MANAGER' ? 'badge-warning' :
                        user.role === 'HR_RECRUITMENT' ? 'badge-info' : 'badge-neutral'
                      }`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ fontSize: '12.5px' }}>{user.branch}</td>
                    <td style={{ fontSize: '12px', fontFamily: 'monospace' }}>{user.phone}</td>
                    <td>
                      {user.twoFactor ? (
                        <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={11} /> Enabled
                        </span>
                      ) : (
                        <span className="badge badge-neutral">Disabled</span>
                      )}
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user.lastLogin}</td>
                    <td>
                      <span className="badge badge-success">{user.status}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => addToast('info', 'Reset Password', `A secure password reset link has been dispatched to ${user.email}`)}
                        title="Send Password Reset"
                      >
                        Reset Key
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: ROLES & PERMISSIONS MATRIX
         ========================================================================= */}
      {adminTab === 'roles' && (
        <div className="table-container">
          <div className="table-toolbar">
            <div style={{ fontSize: '14px', fontWeight: 700 }}>
              Granular Role-Based Access Control (RBAC) Matrix
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Active User Persona: <strong>{currentUser.role}</strong>
            </div>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Functional Module</th>
                  <th style={{ textAlign: 'center' }}>View</th>
                  <th style={{ textAlign: 'center' }}>Create</th>
                  <th style={{ textAlign: 'center' }}>Edit / Update</th>
                  <th style={{ textAlign: 'center' }}>Approve</th>
                  <th style={{ textAlign: 'center' }}>Archive / Delete</th>
                </tr>
              </thead>
              <tbody>
                {permissionsList.map((p, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{p.module}</td>
                    <td style={{ textAlign: 'center' }}>{p.view ? <Check size={16} color="var(--status-success)" /> : '—'}</td>
                    <td style={{ textAlign: 'center' }}>{p.create ? <Check size={16} color="var(--status-success)" /> : '—'}</td>
                    <td style={{ textAlign: 'center' }}>{p.edit ? <Check size={16} color="var(--status-success)" /> : '—'}</td>
                    <td style={{ textAlign: 'center' }}>{p.approve ? <Check size={16} color="var(--brand-gold-400)" /> : '—'}</td>
                    <td style={{ textAlign: 'center' }}>{p.delete ? <Check size={16} color="var(--status-danger)" /> : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: MASTERS & LOOKUPS
         ========================================================================= */}
      {adminTab === 'masters' && (
        <div>
          {/* Master Categories Pill Bar */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
            {[
              { id: 'designations', label: 'Guard Designations' },
              { id: 'uniforms', label: 'Uniform & Kit Items' },
              { id: 'shifts', label: 'Operational Shifts' },
              { id: 'incidents', label: 'Incident Categories' },
              { id: 'industries', label: 'Client Industry Sectors' },
              { id: 'leaves', label: 'Leave Types' }
            ].map(cat => (
              <button
                key={cat.id}
                className={`btn ${masterCategory === cat.id ? 'btn-gold' : 'btn-secondary'} btn-sm`}
                onClick={() => setMasterCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="table-container">
            <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '13.5px' }}>
                Master Lookup Entries: <span style={{ color: 'var(--brand-gold-400)' }}>{masterCategory.toUpperCase()}</span>
              </div>
              <button className="btn btn-gold btn-sm" onClick={() => setIsAddMasterOpen(true)}>
                <Plus size={13} />
                <span>Add Entry</span>
              </button>
            </div>

            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Entry Name</th>
                    <th>System Code</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMasters.map(m => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 600 }}>{m.name}</td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '12px' }}>
                          {m.code}
                        </span>
                      </td>
                      <td style={{ textTransform: 'capitalize', color: 'var(--text-muted)' }}>{m.category}</td>
                      <td>
                        <span className="badge badge-success">{m.status}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => addToast('info', 'System Protected', 'Default master entry cannot be deleted while assigned to active contracts.')}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: CUSTOM FIELDS & EXTENSIBLE SCHEMA
         ========================================================================= */}
      {adminTab === 'customFields' && (
        <div className="table-container">
          <div className="table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>Extensible Data Attributes & Custom Fields</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Attach custom metadata fields to core ERP records without database migrations.</div>
            </div>
            <button className="btn btn-gold btn-sm" onClick={() => setIsAddCustomFieldOpen(true)}>
              <Plus size={13} />
              <span>Add Custom Field</span>
            </button>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Target Entity</th>
                  <th>Field Name</th>
                  <th>Data Type</th>
                  <th>Mandatory</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {customFields.map(f => (
                  <tr key={f.id}>
                    <td>
                      <span className="badge badge-info">{f.entity}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{f.name}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{f.type}</td>
                    <td>
                      {f.mandatory ? (
                        <span className="badge badge-danger">Required</span>
                      ) : (
                        <span className="badge badge-neutral">Optional</span>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-success">{f.status}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => addToast('info', 'Edit Custom Field', `Field "${f.name}" schema view active.`)}
                      >
                        Configure
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: COMPANY & SYSTEM SETTINGS
         ========================================================================= */}
      {adminTab === 'settings' && (
        <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Statutory & Legal Identity */}
          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={18} color="var(--brand-gold-400)" />
              Company Legal Identity & Statutory Registration
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Registered Legal Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={companySettings.companyName}
                  onChange={e => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Corporate Identity Number (CIN)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={companySettings.cin}
                  onChange={e => setCompanySettings({ ...companySettings, cin: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">PSARA License Number (Security Regulation)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={companySettings.psaraLicense}
                  onChange={e => setCompanySettings({ ...companySettings, psaraLicense: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">PSARA Expiry Date</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={companySettings.psaraExpiry}
                  onChange={e => setCompanySettings({ ...companySettings, psaraExpiry: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">GSTIN (Goods & Services Tax)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={companySettings.gstin}
                  onChange={e => setCompanySettings({ ...companySettings, gstin: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Permanent Account Number (PAN)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={companySettings.pan}
                  onChange={e => setCompanySettings({ ...companySettings, pan: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">EPFO Establishment Code</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={companySettings.pfCode}
                  onChange={e => setCompanySettings({ ...companySettings, pfCode: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">ESIC Registration Code</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={companySettings.esicCode}
                  onChange={e => setCompanySettings({ ...companySettings, esicCode: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Operational Policy & Attendance Rules */}
          <div className="card">
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="var(--brand-gold-400)" />
              Operations, Geofencing & Security Policy
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">GPS Geofence Radius Tolerance (Meters)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={companySettings.geofenceToleranceMeters}
                  onChange={e => setCompanySettings({ ...companySettings, geofenceToleranceMeters: Number(e.target.value) })}
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Punches outside this perimeter trigger a geofence deviation flag.</span>
              </div>

              <div className="form-group">
                <label className="form-label">Auto-mark Absent after Shift Start (Minutes)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={companySettings.autoAbsentMinutes}
                  onChange={e => setCompanySettings({ ...companySettings, autoAbsentMinutes: Number(e.target.value) })}
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>If unpunched, post is marked vacant and supervisor notified.</span>
              </div>

              <div className="form-group">
                <label className="form-label">Session Idle Inactivity Timeout (Minutes)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={companySettings.sessionTimeoutMinutes}
                  onChange={e => setCompanySettings({ ...companySettings, sessionTimeoutMinutes: Number(e.target.value) })}
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Auto lock ERP portal after continuous inactivity.</span>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <label className="form-label">Multi-Factor Authentication (MFA / 2FA)</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '6px' }}>
                  <input 
                    type="checkbox" 
                    checked={companySettings.enforce2FA}
                    onChange={e => setCompanySettings({ ...companySettings, enforce2FA: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--brand-gold-400)' }}
                  />
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Enforce OTP Verification for Admin & Accounts Roles</span>
                </label>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="submit" className="btn btn-gold">
              <Save size={15} />
              <span>Save Company Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* =========================================================================
          TAB 7: FORENSIC AUDIT TRAIL
         ========================================================================= */}
      {adminTab === 'audit' && (
        <div className="table-container">
          <div className="table-toolbar">
            <div style={{ fontSize: '14px', fontWeight: 700 }}>
              Forensic Operational & Security Audit Trail
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Cryptographically timestamped action history ({auditLogs.length} immutable records)
            </div>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User Email</th>
                  <th>Role</th>
                  <th>Action</th>
                  <th>Module</th>
                  <th>Forensic Details</th>
                  <th>Client IP</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{log.timestamp}</td>
                    <td style={{ fontWeight: 600 }}>{log.userEmail}</td>
                    <td><span className="badge badge-neutral">{log.userRole}</span></td>
                    <td>
                      <span style={{
                        fontWeight: 700,
                        fontSize: '11px',
                        color: log.action === 'CREATE' ? 'var(--status-success)' : log.action === 'APPROVE' ? 'var(--brand-gold-400)' : log.action === 'DELETE' ? 'var(--status-danger)' : 'var(--status-info)'
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{log.module}</td>
                    <td style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{log.details}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '11.5px', color: 'var(--text-muted)' }}>{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 8: REST API & WEBHOOKS
         ========================================================================= */}
      {adminTab === 'api' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ background: 'var(--bg-subtle)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
              Safe Guard Force REST API (v1)
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Integrate biometric attendance turnstiles, third-party ERPs, and client systems using authenticated bearer API keys.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
              <span className="badge badge-info">Base URL: https://api.safeguardforce.in/v1</span>
              <span className="badge badge-success">Auth: Bearer Token</span>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => addToast('success', 'Token Copied', 'Active bearer API key copied to clipboard.')}
              >
                <Copy size={12} />
                <span>Copy Active API Key</span>
              </button>
            </div>
          </div>

          <div className="table-container">
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Endpoint</th>
                    <th>Description</th>
                    <th>Rate Limit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="badge badge-info">GET</span></td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>/api/v1/guards</td>
                    <td>Fetch active guard profiles, KYC verification, and status</td>
                    <td>1000 req / min</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-success">POST</span></td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>/api/v1/attendance/punch</td>
                    <td>Ingest biometric punch with GPS coordinates and geofence check</td>
                    <td>3000 req / min</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-info">GET</span></td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>/api/v1/patrols/compliance</td>
                    <td>Retrieve real-time QR checkpoint compliance logs</td>
                    <td>1000 req / min</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-danger">POST</span></td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>/api/v1/emergency/sos</td>
                    <td>Trigger high-priority distress broadcast to responder network</td>
                    <td>Unlimited</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-info">GET</span></td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>/api/v1/billing/invoices</td>
                    <td>Export client tax invoices and billing registers to accounting</td>
                    <td>500 req / min</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 9: INTEGRATION ADAPTERS
         ========================================================================= */}
      {adminTab === 'integrations' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {integrations.map(adapter => (
            <div key={adapter.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span className="badge badge-info">{adapter.category}</span>
                <StatusBadge status={adapter.status} />
              </div>

              <h3 style={{ fontSize: '15px', fontWeight: 700, marginTop: '4px' }}>
                {adapter.name}
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Telemetry Sync: <strong>{adapter.lastPing || 'Active'}</strong>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => addToast('success', 'Ping Successful', `${adapter.name} responded with HTTP 200 OK (Latency: 28ms).`)}
                >
                  <RefreshCw size={13} />
                  <span>Test Connectivity</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================================
          MODALS
         ========================================================================= */}
      {/* Modal: Add Operating Branch */}
      <Modal
        isOpen={isAddBranchOpen}
        onClose={() => setIsAddBranchOpen(false)}
        title="Add Operating Branch / Regional Unit"
        subtitle="Establish a new regional operating office for guard deployment and client management."
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddBranchOpen(false)}>Cancel</button>
            <button className="btn btn-gold" onClick={handleAddBranchSubmit}>Register Branch</button>
          </>
        }
      >
        <form onSubmit={handleAddBranchSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Branch Name *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Pune Central Operations"
                value={newBranch.name}
                onChange={e => setNewBranch({ ...newBranch, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Branch Code *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. SGF-PUN"
                value={newBranch.code}
                onChange={e => setNewBranch({ ...newBranch, code: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Pune"
                value={newBranch.city}
                onChange={e => setNewBranch({ ...newBranch, city: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Maharashtra"
                value={newBranch.state}
                onChange={e => setNewBranch({ ...newBranch, state: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Regional Manager</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Vikram Deshmukh"
                value={newBranch.manager}
                onChange={e => setNewBranch({ ...newBranch, manager: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. +91 20 26543210"
                value={newBranch.phone}
                onChange={e => setNewBranch({ ...newBranch, phone: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Modal: Invite Staff User */}
      <Modal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        title="Invite New Staff User"
        subtitle="Grant role-based credentials to ERP management personnel."
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddUserOpen(false)}>Cancel</button>
            <button className="btn btn-gold" onClick={handleAddUserSubmit}>Send Invitation</button>
          </>
        }
      >
        <form onSubmit={handleAddUserSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Capt. Rajesh Nair"
                value={newUser.name}
                onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Corporate Email Address *</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="e.g. rajesh.nair@safeguardforce.in"
                value={newUser.email}
                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">System Role *</label>
              <select 
                className="form-control"
                value={newUser.role}
                onChange={e => setNewUser({ ...newUser, role: e.target.value as RoleType })}
              >
                <option value="OPERATIONS_MANAGER">Head of Operations / Ops Manager</option>
                <option value="HR_RECRUITMENT">HR & Recruitment Manager</option>
                <option value="PAYROLL_ACCOUNTS">Payroll & Accounts Officer</option>
                <option value="SITE_SUPERVISOR">Area Site Supervisor</option>
                <option value="SALES_CRM">Sales & Business Development</option>
                <option value="SUPER_ADMIN">Managing Director / Super Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Assigned Branch</label>
              <select 
                className="form-control"
                value={newUser.branch}
                onChange={e => setNewUser({ ...newUser, branch: e.target.value })}
              >
                {branches.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Contact Mobile Number</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="+91 98XXX XXXXX"
                value={newUser.phone}
                onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Master Entry */}
      <Modal
        isOpen={isAddMasterOpen}
        onClose={() => setIsAddMasterOpen(false)}
        title={`Add Master Entry: ${masterCategory.toUpperCase()}`}
        subtitle="Insert a standard lookup value available across dropdown selectors."
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddMasterOpen(false)}>Cancel</button>
            <button className="btn btn-gold" onClick={handleAddMasterSubmit}>Save Entry</button>
          </>
        }
      >
        <form onSubmit={handleAddMasterSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Display Name *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Senior Dog Squad Handler"
                value={newMaster.name}
                onChange={e => setNewMaster({ ...newMaster, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">System Code (Optional)</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. DES-K9"
                value={newMaster.code}
                onChange={e => setNewMaster({ ...newMaster, code: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Custom Field */}
      <Modal
        isOpen={isAddCustomFieldOpen}
        onClose={() => setIsAddCustomFieldOpen(false)}
        title="Create Extensible Custom Field"
        subtitle="Add a dynamic form field to capture company-specific security attributes."
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddCustomFieldOpen(false)}>Cancel</button>
            <button className="btn btn-gold" onClick={handleAddCustomFieldSubmit}>Attach Field</button>
          </>
        }
      >
        <form onSubmit={handleAddCustomFieldSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Target ERP Record *</label>
              <select 
                className="form-control"
                value={newCustomField.entity}
                onChange={e => setNewCustomField({ ...newCustomField, entity: e.target.value as CustomFieldItem['entity'] })}
              >
                <option value="Guards">Guard Master & Profile</option>
                <option value="Clients">Client Master</option>
                <option value="Sites">Client Site / Location</option>
                <option value="Contracts">Contract & Rates Agreement</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Field Label / Name *</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Armored Vehicle Gun License No."
                value={newCustomField.name}
                onChange={e => setNewCustomField({ ...newCustomField, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Data Input Type *</label>
              <select 
                className="form-control"
                value={newCustomField.type}
                onChange={e => setNewCustomField({ ...newCustomField, type: e.target.value as CustomFieldItem['type'] })}
              >
                <option value="Text">Single Line Text</option>
                <option value="Number">Numeric Value</option>
                <option value="Date">Calendar Date Picker</option>
                <option value="Dropdown">Dropdown Single Select</option>
                <option value="File">Document / PDF Attachment</option>
              </select>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={newCustomField.mandatory}
                  onChange={e => setNewCustomField({ ...newCustomField, mandatory: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--brand-gold-400)' }}
                />
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Field is Mandatory for Record Creation</span>
              </label>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
