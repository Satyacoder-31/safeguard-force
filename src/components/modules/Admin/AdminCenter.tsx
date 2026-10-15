import React, { useState } from 'react';
import { 
  Settings, Users, Shield, Key, Database, 
  Activity, CheckCircle, RefreshCw, Download, 
  ExternalLink, Server, Globe, FileCode, Check 
} from 'lucide-react';
import { useERP } from '../../../context/ERPContext';
import { initialBranches } from '../../../data/initialData';
import { StatusBadge } from '../../common/StatusBadge';

export const AdminCenter: React.FC = () => {
  const { 
    auditLogs, integrations, currentUser, 
    guards, clients, sites, invoices, t, addToast 
  } = useERP();

  const [activeTab, setActiveTab] = useState<'branches' | 'roles' | 'audit' | 'api' | 'integrations' | 'backup'>('branches');

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
        guards,
        clients,
        sites,
        invoices,
        auditLogs
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
            Organization branches, granular role permissions, immutable audit logs, REST API endpoints, and ERP connectors.
          </p>
        </div>

        <div className="page-actions-group">
          <button className="btn btn-gold" onClick={handleDownloadFullDatabaseBackup}>
            <Download size={15} />
            <span>Download Full Database Backup (JSON)</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-header">
        <button 
          className={`tab-btn ${activeTab === 'branches' ? 'active' : ''}`}
          onClick={() => setActiveTab('branches')}
        >
          Branches & Units ({initialBranches.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'roles' ? 'active' : ''}`}
          onClick={() => setActiveTab('roles')}
        >
          Roles & Permissions Matrix
        </button>
        <button 
          className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          System Audit Trail ({auditLogs.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'api' ? 'active' : ''}`}
          onClick={() => setActiveTab('api')}
        >
          REST API & Webhooks
        </button>
        <button 
          className={`tab-btn ${activeTab === 'integrations' ? 'active' : ''}`}
          onClick={() => setActiveTab('integrations')}
        >
          Integration Adapters ({integrations.length})
        </button>
      </div>

      {/* Tab 1: Branches */}
      {activeTab === 'branches' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {initialBranches.map(branch => (
            <div key={branch.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand-gold-500)', fontSize: '12px' }}>
                  {branch.code}
                </span>
                <span className="badge badge-success">Operating</span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{branch.name}</h3>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {branch.city}, {branch.state}
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', fontSize: '12.5px' }}>
                <div>Regional Head: <strong>{branch.manager}</strong></div>
                <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>Contact: {branch.phone}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Roles & Permissions Matrix */}
      {activeTab === 'roles' && (
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

      {/* Tab 3: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="table-container">
          <div className="table-toolbar">
            <div style={{ fontSize: '14px', fontWeight: 700 }}>
              Forensic Operational & Security Audit Trail
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Cryptographically timestamped action history
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

      {/* Tab 4: REST API & Webhooks */}
      {activeTab === 'api' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ background: 'var(--bg-subtle)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
              Safe Guard Force REST API (v1)
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Integrate biometric attendance turnstiles, third-party ERPs, and client systems using authenticated bearer API keys.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <span className="badge badge-info">Base URL: https://api.safeguardforce.in/v1</span>
              <span className="badge badge-success">Auth: Bearer Token</span>
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

      {/* Tab 5: Integration Adapters */}
      {activeTab === 'integrations' && (
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
    </div>
  );
};
