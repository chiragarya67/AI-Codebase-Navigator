// ========================
// FileTree Component (Refined)
// ========================

import { useState } from "react";

// File icon mapping by extension
const getFileIcon = (name) => {
  const ext = name.split(".").pop().toLowerCase();
  const icons = {
    js: "🟨", jsx: "⚛️", ts: "🔷", tsx: "⚛️",
    css: "🎨", html: "🌐", json: "📋", md: "📝",
    py: "🐍", gitignore: "🙈", lock: "🔒", yml: "⚙️",
    yaml: "⚙️", env: "🔐", svg: "🖼️", png: "🖼️",
  };
  return icons[ext] || "📄";
};

// Recursive tree node
function TreeNode({ node, onFileClick, selectedFile, depth = 0 }) {
  const [isOpen, setIsOpen] = useState(depth < 1); // Auto-open first level
  const isFolder = node.type === "tree";
  const isSelected = selectedFile === node.path;

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      onFileClick(node);
    }
  };

  return (
    <>
      <div 
        className={`tree-node ${isSelected ? 'active' : ''}`} 
        style={{ paddingLeft: `${depth * 14 + 10}px` }} 
        onClick={handleClick}
      >
        {isFolder ? (
          <span className={`tree-arrow ${isOpen ? 'open' : ''}`}>▸</span>
        ) : (
          <span className="tree-arrow" style={{ opacity: 0 }}>▸</span>
        )}
        <span className="tree-icon">{isFolder ? (isOpen ? "📂" : "📁") : getFileIcon(node.name)}</span>
        <span className="tree-label">{node.name}</span>
      </div>

      {isFolder && isOpen && node.children && (
        <div>
          {node.children.map((child, index) => (
            <TreeNode
              key={index}
              node={child}
              onFileClick={onFileClick}
              selectedFile={selectedFile}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </>
  );
}

// Main FileTree
function FileTree({ tree, repoName, onFileClick, selectedFile }) {
  if (!tree || tree.length === 0) {
    return null;
  }

  return (
    <>
      <div className="tree-node" style={{ paddingLeft: '10px' }}>
        <span className="tree-arrow open">▸</span>
        <span className="tree-icon">📁</span>
        <span className="tree-label" style={{ fontWeight: '600', color: 'var(--ink)' }}>{repoName}</span>
      </div>
      <div>
        {tree.map((node, index) => (
          <TreeNode
            key={index}
            node={node}
            onFileClick={onFileClick}
            selectedFile={selectedFile}
            depth={1}
          />
        ))}
      </div>
    </>
  );
}

export default FileTree;
