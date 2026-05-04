// ========================
// Sidebar Component (Premium)
// ========================

function Sidebar({ currentView, setCurrentView, onLogout, user, plan = 'free', usage = 0 }) {
  const planInfo = { free: { limit: 5, name: 'Free Plan' }, pro: { limit: 50, name: 'Pro Plan' }, premium: { limit: 9999, name: 'Premium Plan' } };
  const initials = user?.name ? user.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) : 'U';

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </div>
        <div className="sidebar-logo-text">Codebase AI</div>
      </div>
      <div className="sidebar-nav">
        <div className={`sidebar-item ${currentView === 'main' ? 'active' : ''}`} onClick={() => setCurrentView('main')}>
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          Dashboard
        </div>
        <div className={`sidebar-item ${currentView === 'chat' ? 'active' : ''}`} onClick={() => setCurrentView('chat')}>
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          AI Chat
        </div>
        <div className="sidebar-item" style={{ opacity: 0.5, cursor: 'default' }}>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
          Architecture
          <span style={{ fontSize: '9px', background: 'rgba(255,255,255,.1)', padding: '2px 6px', borderRadius: '4px', marginLeft: 'auto' }}>Soon</span>
        </div>
        <div className="sidebar-item" style={{ opacity: 0.5, cursor: 'default' }}>
          <svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
          Bookmarks
          <span style={{ fontSize: '9px', background: 'rgba(255,255,255,.1)', padding: '2px 6px', borderRadius: '4px', marginLeft: 'auto' }}>Soon</span>
        </div>
        <div className={`sidebar-item ${currentView === 'settings' ? 'active' : ''}`} onClick={() => setCurrentView('settings')}>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          Settings
        </div>
      </div>
      
      {plan === 'free' && (
        <div className="upgrade-box">
          <p>🔒 Upgrade to Pro for 50 daily analyses and advanced AI features.</p>
          <button onClick={() => setCurrentView('pricing')}>Upgrade to Pro →</button>
        </div>
      )}

      <div className="sidebar-bottom">
        <div className="sidebar-user" onClick={() => setCurrentView('profile')}>
          <div className="sidebar-avatar">{initials}</div>
          <div>
            <div className="sidebar-user-name">{user?.name || 'User'}</div>
            <div className="sidebar-user-plan">{planInfo[plan]?.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
