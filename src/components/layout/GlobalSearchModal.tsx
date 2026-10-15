import React, { useState, useEffect } from 'react';
import { Search, X, Users, Building2, MapPin, FileText, AlertTriangle, ArrowRight } from 'lucide-react';
import { useERP, NavigationModule } from '../../context/ERPContext';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchOpen, setIsSearchOpen, 
    setActiveModule, 
    guards, clients, sites, invoices, incidents 
  } = useERP();

  const [query, setQuery] = useState('');

  // Handle Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  // Search matches
  const matchedGuards = guards.filter(g => 
    g.name.toLowerCase().includes(q) || 
    g.guardIdNumber.toLowerCase().includes(q) || 
    g.phone.includes(q) ||
    g.category.toLowerCase().includes(q)
  ).slice(0, 4);

  const matchedClients = clients.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.clientCode.toLowerCase().includes(q) ||
    c.industry.toLowerCase().includes(q)
  ).slice(0, 3);

  const matchedSites = sites.filter(s => 
    s.name.toLowerCase().includes(q) || 
    s.city.toLowerCase().includes(q) ||
    s.address.toLowerCase().includes(q)
  ).slice(0, 3);

  const matchedInvoices = invoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(q) || 
    inv.clientName.toLowerCase().includes(q)
  ).slice(0, 3);

  const matchedIncidents = incidents.filter(inc => 
    inc.incidentNumber.toLowerCase().includes(q) || 
    inc.title.toLowerCase().includes(q) ||
    inc.category.toLowerCase().includes(q)
  ).slice(0, 3);

  const navigateTo = (mod: NavigationModule) => {
    setActiveModule(mod);
    setIsSearchOpen(false);
    setQuery('');
  };

  return (
    <div className="modal-overlay" onClick={() => setIsSearchOpen(false)}>
      <div 
        className="modal-dialog" 
        style={{ maxWidth: '640px', marginTop: '40px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)'
        }}>
          <Search size={20} color="var(--accent-gold)" />
          <input 
            type="text"
            autoFocus
            placeholder="Search guards, clients, sites, invoices, incidents..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '15px',
              color: 'var(--text-primary)',
              fontFamily: 'inherit'
            }}
          />
          <button 
            className="icon-btn" 
            onClick={() => setIsSearchOpen(false)}
            style={{ width: '28px', height: '28px' }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Results Container */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '16px 20px' }}>
          {query.length === 0 ? (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Quick Navigation Shortcuts
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <div className="sidebar-link" onClick={() => navigateTo('dashboard')} style={{ background: 'var(--bg-subtle)' }}>
                  Executive Dashboard
                </div>
                <div className="sidebar-link" onClick={() => navigateTo('guards')} style={{ background: 'var(--bg-subtle)' }}>
                  Guard Master & KYC
                </div>
                <div className="sidebar-link" onClick={() => navigateTo('attendance')} style={{ background: 'var(--bg-subtle)' }}>
                  Live GPS Attendance
                </div>
                <div className="sidebar-link" onClick={() => navigateTo('payroll')} style={{ background: 'var(--bg-subtle)' }}>
                  Payroll & Salaries
                </div>
                <div className="sidebar-link" onClick={() => navigateTo('billing')} style={{ background: 'var(--bg-subtle)' }}>
                  Client Invoices
                </div>
                <div className="sidebar-link" onClick={() => navigateTo('sos')} style={{ background: 'var(--bg-subtle)' }}>
                  Emergency SOS Center
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Guards matches */}
              {matchedGuards.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Guards & Security Staff
                  </div>
                  {matchedGuards.map(g => (
                    <div 
                      key={g.id}
                      onClick={() => navigateTo('guards')}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-subtle)',
                        marginBottom: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Users size={16} color="var(--brand-gold-400)" />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600 }}>{g.name} ({g.guardIdNumber})</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{g.category} • {g.phone}</div>
                        </div>
                      </div>
                      <ArrowRight size={14} color="var(--text-muted)" />
                    </div>
                  ))}
                </div>
              )}

              {/* Sites matches */}
              {matchedSites.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Client Sites & Geofences
                  </div>
                  {matchedSites.map(s => (
                    <div 
                      key={s.id}
                      onClick={() => navigateTo('sites')}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-subtle)',
                        marginBottom: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <MapPin size={16} color="var(--status-info)" />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600 }}>{s.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.city} • Strength: {s.requiredStrength} guards</div>
                        </div>
                      </div>
                      <ArrowRight size={14} color="var(--text-muted)" />
                    </div>
                  ))}
                </div>
              )}

              {/* Invoices matches */}
              {matchedInvoices.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Client Invoices
                  </div>
                  {matchedInvoices.map(inv => (
                    <div 
                      key={inv.id}
                      onClick={() => navigateTo('billing')}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-subtle)',
                        marginBottom: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={16} color="var(--status-success)" />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600 }}>{inv.invoiceNumber} — {inv.clientName}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>₹{inv.totalAmount.toLocaleString()} • Status: {inv.status}</div>
                        </div>
                      </div>
                      <ArrowRight size={14} color="var(--text-muted)" />
                    </div>
                  ))}
                </div>
              )}

              {matchedGuards.length === 0 && matchedSites.length === 0 && matchedInvoices.length === 0 && (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No records matching "{query}".
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '10px 20px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11.5px',
          color: 'var(--text-muted)',
          background: 'var(--bg-subtle)'
        }}>
          <span>Press ESC to close</span>
          <span>Search spans entire enterprise database</span>
        </div>
      </div>
    </div>
  );
};
