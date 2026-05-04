// ========================
// ChatSection Component (Premium)
// ========================

import { useState, useRef, useEffect } from "react";

// Simple markdown-like rendering
function renderMarkdown(text) {
  if (!text) return text;
  return text
    .replace(/```[\s\S]*?```/g, match => {
      const code = match.slice(3, -3).replace(/^\w+\n/, '');
      return `<pre>${code}</pre>`;
    })
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

function ChatSection({ onSendMessage, repoInfo, fullView = false }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hello! I'm your AI coding assistant. Analyze a repository and ask me anything about the codebase. 👋",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (messageText) => {
    const userMessage = (messageText || input).trim();
    if (!userMessage || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      if (onSendMessage) {
        const response = await onSendMessage(userMessage);
        setMessages((prev) => [...prev, { role: "ai", text: response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "ai", text: "Please analyze a repository first to ask questions about a specific codebase. You can still ask me general coding questions!" },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedPrompts = repoInfo
    ? ["What does this project do?", "Explain the architecture", "Find potential bugs", "How are components connected?"]
    : ["What is React?", "Explain async/await", "REST vs GraphQL", "How does Git work?"];

  const containerClass = fullView ? "chat-fullview" : "";
  const bodyClass = fullView ? "chat-fullview-body" : "chat-messages";
  const inputAreaClass = fullView ? "chat-fullview-input" : "chat-input-area";

  const chatContent = (
    <>
      {fullView && (
        <div className="chat-fullview-header">
          <div className="chat-fullview-icon">🤖</div>
          <div>
            <div className="chat-fullview-title">AI Assistant</div>
            <div className="chat-fullview-sub">
              {repoInfo ? `Analyzing repo with ${repoInfo.totalFiles} files` : 'Ask me anything about code'}
            </div>
          </div>
        </div>
      )}

      {!fullView && (
        <div className="panel-title" style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🤖</span> AI Assistant
          </div>
        </div>
      )}
      
      <div className={bodyClass} style={!fullView ? { flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' } : undefined}>
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role === 'user' ? 'user' : 'ai'}`}>
            <div 
              className="chat-bubble"
              dangerouslySetInnerHTML={msg.role === 'ai' ? { __html: renderMarkdown(msg.text) } : undefined}
            >
              {msg.role === 'user' ? msg.text : undefined}
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-message ai">
            <div className="chat-bubble" style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '14px 20px' }}>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 1 && !loading && (
        <div className="suggested-prompts">
          {suggestedPrompts.map((prompt, i) => (
            <button key={i} className="suggested-prompt" onClick={() => handleSend(prompt)}>
              {prompt}
            </button>
          ))}
        </div>
      )}

      <div className={inputAreaClass} style={!fullView ? { padding: '16px', borderTop: '1px solid var(--border)' } : undefined}>
        <div className="chat-input-wrapper">
          <input 
            type="text" 
            placeholder="Ask anything about this codebase..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button 
            className="chat-send-btn" 
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
          >
            ➤
          </button>
        </div>
        <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--ink3)', marginTop: '8px' }}>
          AI can make mistakes. Verify critical code.
        </div>
      </div>
    </>
  );

  if (fullView) {
    return <div className={containerClass}>{chatContent}</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
      {chatContent}
    </div>
  );
}

export default ChatSection;
