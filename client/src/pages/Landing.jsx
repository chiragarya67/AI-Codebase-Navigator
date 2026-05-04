import { Link } from 'react-router-dom';

export default function Landing() {
  const scrollTo = (selector) => {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleFaq = (e) => {
    e.currentTarget.parentElement.classList.toggle('open');
  };

  return (
    <div id="page-landing" className="page active">
      <nav className="topnav">
        <div className="nav-logo">
          <div className="nav-logo-icon">
            <svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          Codebase AI
        </div>
        <div className="nav-links">
          <a href="#features" onClick={(e) => { e.preventDefault(); scrollTo('.features-section'); }}>Features</a>
          <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo('.pricing-section'); }}>Pricing</a>
          <a href="#docs">Docs</a>
        </div>
        <div className="nav-ctas">
          <Link to="/login" className="btn btn-ghost">Log in</Link>
          <Link to="/signup" className="btn btn-primary">Start free</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          AI-Powered Code Intelligence
        </div>
        <h1>Navigate any codebase<br/><span>with AI precision</span></h1>
        <p>Paste a GitHub URL. Get instant file structure, AI explanations, dependency maps, and an intelligent chat assistant — all in seconds.</p>
        <div className="hero-ctas">
          <Link to="/signup" className="btn btn-primary btn-lg">Get started free →</Link>
          <Link to="/dashboard" className="btn btn-ghost btn-lg">View live demo</Link>
        </div>
        <div className="hero-visual">
          <div className="hero-visual-bar">
            <div className="hero-dot" style={{ background: '#FF5F57' }}></div>
            <div className="hero-dot" style={{ background: '#FFBD2E' }}></div>
            <div className="hero-dot" style={{ background: '#28CA41' }}></div>
            <div className="hero-url">https://github.com/facebook/react</div>
            <div className="hero-analyze">⚡ Analyze</div>
          </div>
          <div className="hero-dashboard">
            <div className="hero-sidebar">
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '8px', padding: '0 8px' }}>Repository</div>
              <div className="hero-file"><span>▾</span><div className="hero-file-icon"></div>react</div>
              <div style={{ paddingLeft: '16px' }}>
                <div className="hero-file active"><div className="hero-file-icon" style={{ background: 'rgba(245,158,11,.5)' }}></div>index.js</div>
                <div className="hero-file"><div className="hero-file-icon"></div>component.js</div>
                <div className="hero-file"><div className="hero-file-icon"></div>hooks.js</div>
              </div>
              <div className="hero-file" style={{ marginTop: '4px' }}><span>▸</span><div className="hero-file-icon" style={{ background: 'rgba(99,102,241,.4)' }}></div>react-dom</div>
              <div className="hero-file"><span>▸</span><div className="hero-file-icon" style={{ background: 'rgba(99,102,241,.4)' }}></div>shared</div>
            </div>
            <div className="hero-content">
              <div className="hero-tabs">
                <div className="hero-tab">Code</div>
                <div className="hero-tab active" style={{ color: 'var(--brand)', borderBottom: '2px solid var(--brand)', paddingBottom: '10px' }}>Explanation</div>
                <div className="hero-tab">Dependencies</div>
                <div className="hero-tab">Flow</div>
              </div>
              <div className="hero-explanation">
                <p>This file is the entry point for the React package. It exports the core React functionality including hooks, components, and utilities.</p>
                <div className="hero-check">
                  <div className="hero-check-icon" style={{ background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  Exports all React APIs
                </div>
                <div className="hero-check">
                  <div className="hero-check-icon" style={{ background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  Includes core hooks like useState, useEffect
                </div>
                <div className="hero-check">
                  <div className="hero-check-icon" style={{ background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  Handles version and internal configurations
                </div>
              </div>
            </div>
            <div className="hero-right">
              <div className="hero-stat-card">
                <div className="hero-stat-num">2,543</div>
                <div className="hero-stat-label">Total Files</div>
              </div>
              <div style={{ background: '#F5F5FA', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#7B7B8F', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '.06em' }}>Languages</div>
                <div style={{ fontSize: '12px', color: '#3D3D4E', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>JavaScript</span><span>68.7%</span>
                </div>
                <div className="hero-lang-bar" style={{ background: '#E4E4EF' }}><div style={{ width: '68.7%', height: '100%', background: '#F59E0B', borderRadius: '3px' }}></div></div>
                <div style={{ fontSize: '12px', color: '#3D3D4E', display: 'flex', justifyContent: 'space-between', margin: '8px 0 4px' }}>
                  <span>TypeScript</span><span>15.3%</span>
                </div>
                <div className="hero-lang-bar" style={{ background: '#E4E4EF' }}><div style={{ width: '15.3%', height: '100%', background: '#4F46E5', borderRadius: '3px' }}></div></div>
                <div style={{ fontSize: '12px', color: '#3D3D4E', display: 'flex', justifyContent: 'space-between', margin: '8px 0 4px' }}>
                  <span>CSS</span><span>7.8%</span>
                </div>
                <div className="hero-lang-bar" style={{ background: '#E4E4EF' }}><div style={{ width: '7.8%', height: '100%', background: '#10B981', borderRadius: '3px' }}></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features-section">
        <div className="section-center">
          <div className="section-tag">Features</div>
          <h2>Everything you need to understand any codebase</h2>
          <p>From instant repository parsing to AI-powered explanations — Codebase AI gives you complete code intelligence.</p>
        </div>
        <div className="grid-3">
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24"><path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6z"/></svg>
            </div>
            <h3>Instant File Tree</h3>
            <p>Paste any GitHub URL and get a fully interactive file tree in seconds. Browse folders, open files, and understand structure instantly.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/><path d="M12 8v4l3 3"/></svg>
            </div>
            <h3>AI File Explanations</h3>
            <p>Click any file and get plain-English explanations of what it does, how it works, and why it exists — powered by the latest AI models.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            </div>
            <h3>AI Chat Assistant</h3>
            <p>Ask questions about the codebase in natural language. "How does authentication work?" — and get precise, contextual answers.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24"><path d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3"/><path d="M4 21h16"/></svg>
            </div>
            <h3>Dependency Maps</h3>
            <p>Visualize how files depend on each other. Spot circular dependencies, understand module architecture at a glance.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <h3>Flow Diagrams</h3>
            <p>Auto-generated execution flow diagrams show you how data moves through the application — from entry point to output.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <h3>Repo Overview</h3>
            <p>Language breakdown, total files, commit activity, contributor stats — get the full picture of any repository at a glance.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" style={{ background: 'var(--surface2)' }}>
        <div className="section-center">
          <div className="section-tag">How it works</div>
          <h2>Three steps to codebase mastery</h2>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <h3>Paste URL</h3>
            <p>Enter any public GitHub repository URL into the analyzer</p>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <h3>AI Analyzes</h3>
            <p>Our AI parses the structure, reads files, and builds context</p>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <h3>Explore & Chat</h3>
            <p>Browse the tree, read explanations, and ask questions freely</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section pricing-section">
        <div className="section-center">
          <div className="section-tag">Pricing</div>
          <h2>Start free, scale as you grow</h2>
          <p>No credit card required for free plan. Upgrade when you need more power.</p>
        </div>
        <div className="pricing-grid">
          <div className="price-card">
            <div className="price-name">Free</div>
            <div className="price-amount">
              <span>$</span><strong>0</strong><em>/mo</em>
            </div>
            <div className="price-desc">Perfect for personal projects and exploration</div>
            <ul className="price-features">
              <li>5 repository analyses/day</li>
              <li>File explanations (basic)</li>
              <li>AI chat (10 messages/day)</li>
              <li>Public repos only</li>
              <li>Standard AI model</li>
            </ul>
            <Link to="/signup" className="btn btn-outline" style={{ width: '100%', display: 'block', textAlign: 'center' }}>Get started free</Link>
          </div>
          <div className="price-card featured">
            <div className="price-badge">Most Popular</div>
            <div className="price-name">Pro</div>
            <div className="price-amount">
              <span>$</span><strong>19</strong><em>/mo</em>
            </div>
            <div className="price-desc">For developers and small teams</div>
            <ul className="price-features">
              <li>50 repository analyses/day</li>
              <li>Advanced AI explanations</li>
              <li>Unlimited AI chat</li>
              <li>Private repo support</li>
              <li>Faster GPT-4 model</li>
              <li>Dependency visualizations</li>
              <li>Bookmarks & history</li>
            </ul>
            <Link to="/signup" className="btn btn-primary" style={{ width: '100%', display: 'block', textAlign: 'center' }}>Upgrade to Pro</Link>
          </div>
          <div className="price-card">
            <div className="price-name">Premium</div>
            <div className="price-amount">
              <span>$</span><strong>49</strong><em>/mo</em>
            </div>
            <div className="price-desc">For power users and teams</div>
            <ul className="price-features">
              <li>Unlimited analyses</li>
              <li>Priority AI responses</li>
              <li>Unlimited AI chat</li>
              <li>Private + Enterprise repos</li>
              <li>Priority GPT-4 access</li>
              <li>Team collaboration</li>
              <li>API access</li>
              <li>Dedicated support</li>
            </ul>
            <Link to="/signup" className="btn btn-ghost" style={{ width: '100%', display: 'block', textAlign: 'center' }}>Upgrade to Premium</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="section-center">
          <div className="section-tag">Testimonials</div>
          <h2>Loved by developers worldwide</h2>
        </div>
        <div className="testi-grid">
          <div className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <div className="testi-text">"Codebase AI saved me hours when onboarding to a new client's React monorepo. I understood the entire architecture in 20 minutes."</div>
            <div className="testi-author">
              <div className="testi-avatar">SR</div>
              <div>
                <div className="testi-name">Sarah Ramirez</div>
                <div className="testi-role">Senior Frontend Engineer, Vercel</div>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <div className="testi-text">"The AI chat is uncannily accurate. Asked it to explain how the auth middleware works in a 50k line codebase — got a perfect answer."</div>
            <div className="testi-author">
              <div className="testi-avatar">MK</div>
              <div>
                <div className="testi-name">Michael Kim</div>
                <div className="testi-role">CTO, Buildfast.io</div>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <div className="testi-text">"We use this for code reviews. Before any PR, we analyze the affected modules. It's completely changed how our team communicates."</div>
            <div className="testi-author">
              <div className="testi-avatar">AP</div>
              <div>
                <div className="testi-name">Anika Patel</div>
                <div className="testi-role">Engineering Manager, Stripe</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="section-center">
          <div className="section-tag">FAQ</div>
          <h2>Common questions</h2>
        </div>
        <div className="faq-list">
          <div className="faq-item">
            <div className="faq-q" onClick={toggleFaq}>What AI model does Codebase AI use?</div>
            <div className="faq-a">Codebase AI uses Claude (Anthropic) for all AI features — file explanations, dependency analysis, and the chat assistant. Pro and Premium users get access to the latest and fastest model variants with priority queue access.</div>
          </div>
          <div className="faq-item">
            <div className="faq-q" onClick={toggleFaq}>Can I analyze private repositories?</div>
            <div className="faq-a">Private repository support is available on Pro and Premium plans. You'll connect your GitHub account via OAuth, and we securely access repos using your scoped credentials. We never store your code — only analysis metadata.</div>
          </div>
          <div className="faq-item">
            <div className="faq-q" onClick={toggleFaq}>How accurate are the AI explanations?</div>
            <div className="faq-a">Very accurate for most common patterns and frameworks. Our AI reads the actual file content and surrounding context, not just file names. For highly custom or domain-specific code, explanations may be more general.</div>
          </div>
          <div className="faq-item">
            <div className="faq-q" onClick={toggleFaq}>Is there a free trial for paid plans?</div>
            <div className="faq-a">The Free plan is free forever with no credit card required. When you're ready to upgrade, we offer a 14-day money-back guarantee on all paid plans — no questions asked.</div>
          </div>
          <div className="faq-item">
            <div className="faq-q" onClick={toggleFaq}>What repositories are supported?</div>
            <div className="faq-a">Any public GitHub repository works on all plans. Private GitHub repos work on Pro and Premium. Support for GitLab and Bitbucket is coming soon for Premium users.</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="footer-brand">⚡ Codebase AI</div>
              <div className="footer-tagline">AI-powered code intelligence for developers. Understand any codebase in minutes, not days.</div>
            </div>
            <div className="footer-col">
              <h4>Product</h4>
              <a href="#">Features</a>
              <a href="#">Pricing</a>
              <a href="#">Changelog</a>
              <a href="#">Roadmap</a>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <a href="#">Documentation</a>
              <a href="#">API Reference</a>
              <a href="#">Blog</a>
              <a href="#">Status</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Contact</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Codebase AI. All rights reserved.</span>
            <span>Made with ♥ for developers</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
