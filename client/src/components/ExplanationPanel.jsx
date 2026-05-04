// ========================
// ExplanationPanel Component (Premium)
// ========================
// 4 Tabs: Code | Explanation | Dependencies | Flow

import { useState, useMemo } from "react";

// Parse imports/requires from file content
function extractDependencies(content) {
  if (!content) return [];
  const deps = [];
  const importRegex = /import\s+(?:(?:\{[^}]*\}|[\w*]+)(?:\s*,\s*(?:\{[^}]*\}|[\w*]+))*\s+from\s+)?['"]([^'"]+)['"]/g;
  const requireRegex = /(?:const|let|var)\s+(?:\{[^}]*\}|[\w]+)\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  let m;
  while ((m = importRegex.exec(content)) !== null) {
    deps.push({ name: m[1], type: m[1].startsWith('.') ? 'local' : 'package' });
  }
  while ((m = requireRegex.exec(content)) !== null) {
    deps.push({ name: m[1], type: m[1].startsWith('.') ? 'local' : 'package' });
  }
  return deps;
}

// Parse exports from file content
function extractExports(content) {
  if (!content) return [];
  const exports = [];
  const defaultExport = content.match(/export\s+default\s+(?:function\s+|class\s+)?(\w+)/);
  if (defaultExport) exports.push({ name: defaultExport[1], type: 'default' });
  const namedExports = content.match(/export\s+(?:const|let|var|function|class)\s+(\w+)/g);
  if (namedExports) {
    namedExports.forEach(e => {
      const name = e.replace(/export\s+(?:const|let|var|function|class)\s+/, '');
      exports.push({ name, type: 'named' });
    });
  }
  const moduleExports = content.match(/module\.exports\s*=\s*(?:\{([^}]+)\}|(\w+))/);
  if (moduleExports) {
    if (moduleExports[1]) {
      moduleExports[1].split(',').forEach(e => {
        const name = e.trim().split(':')[0].trim();
        if (name) exports.push({ name, type: 'named' });
      });
    } else if (moduleExports[2]) {
      exports.push({ name: moduleExports[2], type: 'default' });
    }
  }
  return exports;
}

// Parse key takeaways from AI explanation
function parseKeyTakeaways(explanation) {
  if (!explanation) return [];
  const lines = explanation.split('\n');
  const takeaways = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if ((trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+[\.\)]/.test(trimmed)) && trimmed.length > 10 && trimmed.length < 200) {
      const text = trimmed.replace(/^[-*\d+\.\)]+\s*\**/, '').replace(/\*+$/, '').trim();
      if (text.length > 5) takeaways.push(text);
    }
  }
  return takeaways.slice(0, 5);
}

function ExplanationPanel({ selectedFile, explanation, fileContent, loading, repoOwner, repoName }) {
  const [activeTab, setActiveTab] = useState("Explanation");
  const tabs = ["Code", "Explanation", "Dependencies", "Flow"];

  const dependencies = useMemo(() => extractDependencies(fileContent), [fileContent]);
  const exports = useMemo(() => extractExports(fileContent), [fileContent]);
  const takeaways = useMemo(() => parseKeyTakeaways(explanation), [explanation]);

  // Empty state
  if (!selectedFile) {
    return (
      <div className="empty-state">
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
        <h2>Select a file</h2>
        <p>Click on any file in the repository structure to see its content and AI explanation.</p>
      </div>
    );
  }

  const getFileBadge = (name) => {
    const ext = name.split(".").pop().toUpperCase();
    const colors = {
      JS: { bg: "#FFFBEB", color: "#B45309", label: "JS" },
      JSX: { bg: "#EFF6FF", color: "#1D4ED8", label: "JSX" },
      TS: { bg: "#EFF6FF", color: "#1D4ED8", label: "TS" },
      TSX: { bg: "#EFF6FF", color: "#1D4ED8", label: "TSX" },
      CSS: { bg: "#F0FDF4", color: "#15803D", label: "CSS" },
      JSON: { bg: "#F3F4F6", color: "#374151", label: "{ }" },
      MD: { bg: "#FEF2F2", color: "#B91C1C", label: "MD" },
      PY: { bg: "#FEF9C3", color: "#854D0E", label: "PY" },
    };
    return colors[ext] || { bg: "var(--surface2)", color: "var(--ink2)", label: ext.slice(0, 3) };
  };

  const badge = getFileBadge(selectedFile.name);

  return (
    <>
      <div className="file-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="file-icon" style={{ background: badge.bg, color: badge.color }}>
            {badge.label}
          </div>
          <div>
            <div className="file-title">{selectedFile.name}</div>
            <div className="file-path">{selectedFile.path}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {repoOwner && repoName && (
            <a href={`https://github.com/${repoOwner}/${repoName}/blob/main/${selectedFile.path}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline">
              GitHub ↗
            </a>
          )}
        </div>
      </div>

      <div className="tabs">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="tab-content" style={{ flex: 1, overflowY: 'auto' }}>
        {/* === EXPLANATION TAB === */}
        {activeTab === "Explanation" && (
          <div style={{ padding: '20px' }}>
            <div className="ai-explanation-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontWeight: '600', color: 'var(--brand)' }}>
                <span>✨</span> AI Analysis
              </div>
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--ink2)', fontSize: '14px' }}>
                  <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                  Generating explanation...
                </div>
              ) : (
                <div style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--ink)', whiteSpace: 'pre-wrap' }}>
                  {explanation || "No explanation available. Please try analyzing this file again."}
                </div>
              )}
            </div>
            
            {!loading && takeaways.length > 0 && (
              <div style={{ marginTop: '20px', padding: '16px', background: 'var(--surface2)', borderRadius: '10px', fontSize: '13px', color: 'var(--ink2)' }}>
                <strong style={{ color: 'var(--ink)' }}>✅ Key Takeaways:</strong>
                <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                  {takeaways.map((t, i) => <li key={i} style={{ marginBottom: '6px' }}>{t}</li>)}
                </ul>
              </div>
            )}

            {!loading && takeaways.length === 0 && explanation && (
              <div style={{ marginTop: '20px', padding: '16px', background: 'var(--surface2)', borderRadius: '10px', fontSize: '13px', color: 'var(--ink2)' }}>
                <strong style={{ color: 'var(--ink)' }}>📌 Quick Info:</strong>
                <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                  <li style={{ marginBottom: '6px' }}>File type: <strong>{selectedFile.name.split('.').pop().toUpperCase()}</strong></li>
                  <li style={{ marginBottom: '6px' }}>{dependencies.length} dependencies found</li>
                  <li style={{ marginBottom: '6px' }}>{exports.length} exports detected</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* === CODE TAB === */}
        {activeTab === "Code" && (
          <div className="code-block" style={{ margin: '0', borderRadius: '0', border: 'none', height: '100%' }}>
            {fileContent ? fileContent.split('\n').map((line, i) => (
              <div className="code-line" key={i}>
                <div className="line-num">{i + 1}</div>
                <div className="line-content">{line}</div>
              </div>
            )) : (
              <div style={{ padding: '20px', color: 'var(--ink3)' }}>Loading code...</div>
            )}
          </div>
        )}

        {/* === DEPENDENCIES TAB === */}
        {activeTab === "Dependencies" && (
          <div style={{ padding: '20px' }}>
            {dependencies.length > 0 ? (
              <>
                <div style={{ fontSize: '13px', color: 'var(--ink3)', marginBottom: '16px' }}>
                  Found <strong style={{ color: 'var(--ink)' }}>{dependencies.length}</strong> dependencies in this file
                </div>
                <div className="dep-list">
                  {dependencies.map((dep, i) => (
                    <div className="dep-item" key={i}>
                      <div className="dep-icon">{dep.type === 'package' ? '📦' : '📄'}</div>
                      <div className="dep-name">{dep.name}</div>
                      <div className="dep-type">{dep.type}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="dep-empty">
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔗</div>
                <div>No imports or dependencies found in this file.</div>
              </div>
            )}
          </div>
        )}

        {/* === FLOW TAB === */}
        {activeTab === "Flow" && (
          <div className="flow-container">
            {dependencies.length > 0 && (
              <div className="flow-section">
                <div className="flow-section-title">Imports From</div>
                {dependencies.map((dep, i) => (
                  <div className="flow-node" key={i}>
                    <span className="flow-node-icon">{dep.type === 'package' ? '📦' : '📄'}</span>
                    <span className="flow-node-label">{dep.name}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flow-connector"></div>

            <div className="flow-section">
              <div className="flow-section-title">Current File</div>
              <div className="flow-node flow-current">
                <span className="flow-node-icon">⚡</span>
                <span className="flow-node-label">{selectedFile.name}</span>
              </div>
            </div>

            <div className="flow-connector"></div>

            <div className="flow-section flow-exports-section">
              <div className="flow-section-title">Exports</div>
              {exports.length > 0 ? exports.map((exp, i) => (
                <div className="flow-node" key={i}>
                  <span className="flow-node-icon">📤</span>
                  <span className="flow-node-label">{exp.name}</span>
                  <span className="dep-type">{exp.type}</span>
                </div>
              )) : (
                <div className="flow-node" style={{ opacity: 0.5 }}>
                  <span className="flow-node-icon">—</span>
                  <span className="flow-node-label" style={{ fontStyle: 'italic' }}>No exports detected</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ExplanationPanel;
