// ========================
// Dashboard Page (Premium)
// ========================

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import FileTree from "../components/FileTree";
import ExplanationPanel from "../components/ExplanationPanel";
import ChatSection from "../components/ChatSection";

// Language color mapping
const LANG_COLORS = {
  JavaScript: '#F7DF1E', TypeScript: '#3178C6', CSS: '#10B981', HTML: '#E34F26',
  JSON: '#6B7280', Markdown: '#B91C1C', Python: '#3776AB', YAML: '#CB171E',
  Shell: '#89E051', SVG: '#FFB13B', Other: '#9CA3AF'
};
const EXT_LANG = {
  js: 'JavaScript', jsx: 'JavaScript', mjs: 'JavaScript', cjs: 'JavaScript',
  ts: 'TypeScript', tsx: 'TypeScript', css: 'CSS', scss: 'CSS', less: 'CSS',
  html: 'HTML', htm: 'HTML', json: 'JSON', md: 'Markdown', mdx: 'Markdown',
  py: 'Python', yml: 'YAML', yaml: 'YAML', sh: 'Shell', bash: 'Shell',
  svg: 'SVG', xml: 'HTML'
};

function countLanguages(tree) {
  const counts = {};
  function walk(nodes) {
    if (!nodes) return;
    nodes.forEach(n => {
      if (n.type === 'blob') {
        const ext = n.name.split('.').pop().toLowerCase();
        const lang = EXT_LANG[ext] || 'Other';
        counts[lang] = (counts[lang] || 0) + 1;
      }
      if (n.children) walk(n.children);
    });
  }
  walk(tree);
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
}

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [repoUrl, setRepoUrl] = useState("");
  const [repoData, setRepoData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loadingRepo, setLoadingRepo] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [toast, setToast] = useState(null);
  const [currentView, setCurrentView] = useState("main");

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token) { navigate("/login"); return; }
    if (userData) setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) { showToast("Please enter a GitHub repository URL"); return; }
    if (!repoUrl.includes("github.com/")) { showToast("Please enter a valid GitHub URL"); return; }
    setLoadingRepo(true); setSelectedFile(null); setFileContent(""); setExplanation("");
    try {
      const { analyzeRepoAPI } = await import("../services/api");
      const res = await analyzeRepoAPI(repoUrl);
      setRepoData(res.data.data);
      showToast(`Successfully analyzed "${res.data.data.repoName}" — ${res.data.data.totalFiles} files found`, "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to analyze repository.");
    } finally { setLoadingRepo(false); }
  };

  const handleFileClick = async (file) => {
    setSelectedFile(file); setLoadingFile(true); setFileContent(""); setExplanation("");
    try {
      const { getFileContentAPI, explainFileAPI } = await import("../services/api");
      const contentRes = await getFileContentAPI(repoData.owner, repoData.repoName, file.path);
      const content = contentRes.data.data.content;
      setFileContent(content);
      const explainRes = await explainFileAPI(file.name, content);
      setExplanation(explainRes.data.data.explanation);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to load file.";
      setExplanation(msg); showToast(msg);
    } finally { setLoadingFile(false); }
  };

  // Helper: flatten file tree into a readable text list
  const flattenTree = (nodes, prefix = "") => {
    let result = "";
    if (!nodes) return result;
    nodes.forEach((node) => {
      if (node.type === "tree") {
        result += `${prefix}📁 ${node.name}/\n`;
        if (node.children) result += flattenTree(node.children, prefix + "  ");
      } else {
        result += `${prefix}📄 ${node.name}\n`;
      }
    });
    return result;
  };

  const handleSendMessage = async (message) => {
    try {
      const { askQuestionAPI } = await import("../services/api");
      let context = "";

      if (repoData) {
        // Build a rich project context with full tree structure
        context += `=== REPOSITORY INFO ===\n`;
        context += `Name: ${repoData.repoName}\n`;
        context += `Owner: ${repoData.owner}\n`;
        context += `Branch: ${repoData.branch || "main"}\n`;
        context += `Total Files: ${repoData.totalFiles}\n`;
        context += `Total Folders: ${repoData.totalFolders || 0}\n\n`;

        // Add language breakdown
        if (langStats.length > 0) {
          context += `=== LANGUAGES ===\n`;
          langStats.forEach((l) => {
            context += `${l.lang}: ${l.pct}% (${l.count} files)\n`;
          });
          context += `\n`;
        }

        // Add full file tree structure (up to a reasonable size)
        if (repoData.tree) {
          context += `=== FILE STRUCTURE ===\n`;
          const treeText = flattenTree(repoData.tree);
          // Limit tree to ~4000 chars to avoid exceeding token limits
          context += treeText.slice(0, 4000);
          if (treeText.length > 4000) context += `\n... (truncated, ${repoData.totalFiles} total files)\n`;
          context += `\n`;
        }
      }

      // Add currently viewed file for extra context
      if (selectedFile && fileContent) {
        context += `=== CURRENTLY VIEWING ===\n`;
        context += `File: ${selectedFile.name} (${selectedFile.path})\n`;
        context += `Content:\n\`\`\`\n${fileContent.slice(0, 3000)}\n\`\`\`\n`;
      }

      const res = await askQuestionAPI(message, context || "No repository loaded yet.");
      return res.data.data.answer;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to get answer");
    }
  };

  const langStats = useMemo(() => {
    if (!repoData?.tree) return [];
    const counts = countLanguages(repoData.tree);
    const total = counts.reduce((s, [, c]) => s + c, 0);
    return counts.map(([lang, count]) => ({ lang, count, pct: ((count / total) * 100).toFixed(1), color: LANG_COLORS[lang] || '#9CA3AF' }));
  }, [repoData]);

  // Sub-views
  const renderProfile = () => (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div className="profile-page">
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Profile</h2>
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar-lg">{user?.name ? user.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) : 'U'}</div>
            <div>
              <div className="profile-name">{user?.name || 'User'}</div>
              <div className="profile-email">{user?.email || 'user@example.com'}</div>
              <div style={{ marginTop: '8px' }}><span className="plan-badge plan-free">Free Plan</span></div>
            </div>
          </div>
          <div className="info-row"><span className="info-label">Member since</span><span className="info-value">April 2025</span></div>
          <div className="info-row"><span className="info-label">Repositories analyzed</span><span className="info-value">0</span></div>
        </div>
      </div>
    </div>
  );

  const renderPricing = () => (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div className="pricing-page">
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Upgrade your plan</h2>
        <p style={{ color: 'var(--ink2)', marginBottom: '32px', fontSize: '15px' }}>Unlock more power. Cancel anytime.</p>
        <div className="pricing-grid">
          <div className="price-card">
            <div className="price-name">Free</div>
            <div className="price-amount"><span>$</span><strong>0</strong><em>/mo</em></div>
            <div className="price-desc">Your current plan</div>
            <ul className="price-features"><li>5 repo analyses/day</li><li>Basic AI explanations</li><li>10 AI chats/day</li></ul>
            <button className="btn btn-ghost" style={{ width: '100%' }} disabled>Current plan</button>
          </div>
          <div className="price-card featured">
            <div className="price-badge">Recommended</div>
            <div className="price-name">Pro</div>
            <div className="price-amount"><span>$</span><strong>19</strong><em>/mo</em></div>
            <div className="price-desc">For serious developers</div>
            <ul className="price-features"><li>50 analyses/day</li><li>Advanced AI (GPT-4)</li><li>Unlimited AI chat</li><li>Private repos</li></ul>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => showToast('Payments disabled in demo', 'error')}>Upgrade — $19/mo</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <div className="profile-page">
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Settings</h2>
        <div className="profile-card">
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Account Settings</h3>
          <div className="form-group"><label className="form-label">Display name</label><input type="text" className="form-input" defaultValue={user?.name || ''} /></div>
          <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" defaultValue={user?.email || ''} /></div>
          <button className="btn btn-primary btn-sm" onClick={() => showToast('Settings saved!', 'success')}>Save changes</button>
        </div>
        <div className="profile-card">
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: 'var(--red)' }}>Danger Zone</h3>
          <button className="btn btn-sm" style={{ background: '#FEF2F2', color: 'var(--red)', border: '1px solid #FECACA' }} onClick={handleLogout}>Sign out</button>
        </div>
      </div>
    </div>
  );

  const renderRepoOverview = () => {
    if (!repoData) return <div style={{ color: 'var(--ink3)', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>Analyze a repo to see overview</div>;
    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          <div className="stat-card"><div className="stat-card-num">{repoData.totalFiles}</div><div className="stat-card-label">Total Files</div></div>
          <div className="stat-card" style={{ background: 'var(--surface2)', color: 'var(--ink)' }}>
            <div className="stat-card-num" style={{ fontSize: '18px', color: 'var(--ink)' }}>{repoData.totalFolders || 0}</div>
            <div className="stat-card-label" style={{ color: 'var(--ink3)' }}>Folders</div>
          </div>
        </div>
        <div style={{ background: 'var(--surface2)', borderRadius: '10px', padding: '14px', marginBottom: '16px', fontSize: '13px', color: 'var(--ink2)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Name</span><strong style={{ color: 'var(--ink)' }}>{repoData.repoName}</strong>
        </div>
        {/* Language Stats */}
        {langStats.length > 0 && (
          <div className="lang-stats">
            <div className="lang-stats-title">Languages</div>
            {langStats.map((l, i) => (
              <div className="lang-stat-item" key={i}>
                <div className="lang-stat-row">
                  <span className="lang-stat-name"><span className="lang-stat-dot" style={{ background: l.color }}></span>{l.lang}</span>
                  <span className="lang-stat-pct">{l.pct}%</span>
                </div>
                <div className="lang-stat-bar"><div className="lang-stat-fill" style={{ width: `${l.pct}%`, background: l.color }}></div></div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="page-dashboard" className="page active">
      {toast && <div className={`toast show ${toast.type}`}>{toast.message}</div>}
      <div className="dashboard-layout">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} onLogout={handleLogout} user={user} plan="free" usage={0} />
        <div className="dash-main">
          <Topbar repoUrl={repoUrl} setRepoUrl={setRepoUrl} onAnalyze={handleAnalyze} loading={loadingRepo} user={user} plan="free" usage={0} setCurrentView={setCurrentView} />

          {currentView === 'main' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div className="dash-content">
                <div className="panel panel-left">
                  <div className="panel-title">
                    Repository Structure
                    <div style={{ display: 'flex', gap: '4px' }}><button title="Refresh" onClick={handleAnalyze}>↺</button></div>
                  </div>
                  <div className="file-tree">
                    {repoData ? (
                      <FileTree tree={repoData.tree} repoName={repoData.repoName} onFileClick={handleFileClick} selectedFile={selectedFile?.path || ""} />
                    ) : (
                      <div className="empty-state" style={{ height: 'auto', padding: '20px 0' }}>
                        <div style={{ fontSize: '32px', marginBottom: '12px' }}>📁</div>
                        <p style={{ fontSize: '13px', color: 'var(--ink3)' }}>Paste a GitHub URL and click Analyze to see the file tree</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="panel panel-center" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div id="explanation-panel">
                    <ExplanationPanel selectedFile={selectedFile} explanation={explanation} fileContent={fileContent} loading={loadingFile} repoOwner={repoData?.owner} repoName={repoData?.repoName} />
                  </div>
                  {repoData && (
                    <div id="chat-panel">
                      <ChatSection onSendMessage={handleSendMessage} repoInfo={{ totalFiles: repoData.totalFiles, totalFolders: repoData.totalFolders }} />
                    </div>
                  )}
                </div>

                <div className="panel panel-right">
                  <div className="panel-title">Repository Overview</div>
                  {renderRepoOverview()}
                </div>
              </div>
            </div>
          )}

          {currentView === 'chat' && (
            <ChatSection onSendMessage={handleSendMessage} repoInfo={repoData ? { totalFiles: repoData.totalFiles, totalFolders: repoData.totalFolders } : null} fullView={true} />
          )}

          {currentView === 'profile' && renderProfile()}
          {currentView === 'pricing' && renderPricing()}
          {currentView === 'settings' && renderSettings()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
