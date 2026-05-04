// ========================
// Topbar Component (Refined)
// ========================

function Topbar({ repoUrl, setRepoUrl, onAnalyze, loading, user, plan = 'free', usage = 0, setCurrentView }) {
  const planInfo = { free: { limit: 5 }, pro: { limit: 50 }, premium: { limit: 9999 } };
  const initials = user?.name ? user.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) : 'U';
  const usageLeft = Math.max(0, planInfo[plan].limit - usage);

  return (
    <div className="topbar">
      <div className="url-input-wrap">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input 
          type="text" 
          placeholder="https://github.com/owner/repository" 
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAnalyze()}
        />
        <button className="btn btn-sm" style={{ background: 'transparent', color: 'var(--ink3)', padding: '4px 8px' }} onClick={() => setRepoUrl('')}>✕</button>
      </div>
      <button className="btn btn-primary btn-sm" onClick={onAnalyze} disabled={loading}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
      <div className="topbar-user">
        <div style={{ fontSize: '12px', background: 'var(--surface2)', border: '1px solid var(--border)', padding: '5px 10px', borderRadius: '6px', color: 'var(--ink2)' }}>
          {usageLeft}/{planInfo[plan].limit > 9999 ? '∞' : planInfo[plan].limit} left today
        </div>
        <div className="topbar-avatar" onClick={() => setCurrentView('profile')}>
          {initials}
        </div>
      </div>
    </div>
  );
}

export default Topbar;
