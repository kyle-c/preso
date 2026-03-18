/* ── Embedded CSS for shadow DOM ── */

/* Font-face CSS is generated dynamically in overlay.ts using chrome.runtime.getURL */

export const STYLES = `
:host {
  all: initial;
  font-family: 'Saans', system-ui, -apple-system, sans-serif;
  color: #FEFCF9;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

.preso-root {
  position: fixed;
  inset: 0;
  z-index: 999999;
  background: #082422;
  overflow: hidden;
  user-select: none;
  font-family: 'Saans', system-ui, -apple-system, sans-serif;
}

/* ── Typography ── */
.font-display { font-family: 'Plain', system-ui, sans-serif; }
.font-mono { font-family: 'Geist Mono', 'SF Mono', 'Fira Code', monospace; }
.font-sans { font-family: 'Saans', system-ui, -apple-system, sans-serif; }

/* ── Slide Container ── */
.slide {
  position: absolute;
  inset: 0;
  display: none;
  flex-direction: column;
  overflow: hidden;
}
.slide.active { display: flex; animation: fadeIn 0.3s ease; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* ── Backgrounds ── */
.bg-dark { background-color: #082422; }
.bg-light { background-color: #EFEBE7; }
.bg-brand { background-color: #2BF2F1; }

/* ── Slide Content Area ── */
.slide-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 3rem;
  position: relative;
  z-index: 10;
}
.slide-inner {
  width: 100%;
  max-width: 1050px;
}

/* ── Progress Bar ── */
.progress-track {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  z-index: 50;
  transition: background-color 0.5s;
}
.progress-track.dark { background: rgba(255,255,255,0.1); }
.progress-track.light { background: rgba(207,202,191,0.3); }
.progress-track.brand { background: rgba(8,36,34,0.1); }
.progress-fill {
  height: 100%;
  transition: width 0.5s ease-out;
}
.progress-fill.dark { background: #5DF7F5; }
.progress-fill.light { background: #14D4D3; }
.progress-fill.brand { background: rgba(8,36,34,0.6); }

/* ── Counter Pill ── */
.counter-pill {
  position: absolute;
  top: 1rem;
  left: 1.5rem;
  z-index: 50;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  backdrop-filter: blur(8px);
  border: 1px solid;
  font-size: 0.8125rem;
  font-weight: 500;
  transition: all 0.5s;
}
.counter-pill.dark { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); }
.counter-pill.light { background: rgba(255,255,255,0.9); border-color: #CFCABF; color: #082422; }
.counter-pill.brand { background: rgba(8,36,34,0.2); border-color: rgba(8,36,34,0.2); color: rgba(8,36,34,0.8); }

/* ── Close Button ── */
.close-btn {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  z-index: 100;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  backdrop-filter: blur(8px);
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  background: none;
  padding: 0;
}
.close-btn.dark { border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); }
.close-btn.light { border-color: #CFCABF; color: #082422; background: rgba(255,255,255,0.9); }
.close-btn.brand { border-color: rgba(8,36,34,0.2); color: rgba(8,36,34,0.7); }
.close-btn:hover { transform: scale(1.1); }
.close-btn svg { width: 18px; height: 18px; }

/* ── Regenerate Button ── */
.regen-btn {
  position: absolute;
  top: 1rem;
  right: 4.5rem;
  z-index: 100;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  backdrop-filter: blur(8px);
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  background: none;
  opacity: 0.6;
}
.regen-btn.dark { border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); }
.regen-btn.light { border-color: #CFCABF; color: #082422; background: rgba(255,255,255,0.9); }
.regen-btn.brand { border-color: rgba(8,36,34,0.2); color: rgba(8,36,34,0.7); }
.regen-btn:hover { transform: scale(1.1); opacity: 1; }
.regen-btn svg { width: 16px; height: 16px; }

/* ── Dot Navigation ── */
.dots {
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  display: flex;
  gap: 0.5rem;
}
.dot {
  height: 0.5rem;
  border-radius: 9999px;
  transition: all 0.3s;
  cursor: pointer;
  border: none;
  padding: 0;
}
.dot.inactive { width: 0.5rem; }
.dot.active { width: 3rem; }
.dot.inactive.dark { background: rgba(255,255,255,0.2); }
.dot.inactive.light { background: #CFCABF; }
.dot.inactive.brand { background: rgba(8,36,34,0.2); }
.dot.active.dark { background: #5DF7F5; }
.dot.active.light { background: #14D4D3; }
.dot.active.brand { background: rgba(8,36,34,0.7); }
.dot:hover { opacity: 0.8; }

/* ── Prev/Next Arrows ── */
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  padding: 0.75rem;
  border-radius: 9999px;
  backdrop-filter: blur(8px);
  border: 1px solid;
  cursor: pointer;
  transition: all 0.5s;
  background: none;
  display: flex;
}
.nav-arrow.prev { left: 1rem; }
.nav-arrow.next { right: 1rem; }
.nav-arrow.hidden { opacity: 0; pointer-events: none; }
.nav-arrow.dark { border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); }
.nav-arrow.light { border-color: #CFCABF; color: #082422; background: rgba(255,255,255,0.9); }
.nav-arrow.brand { border-color: rgba(8,36,34,0.15); color: rgba(8,36,34,0.7); }
.nav-arrow:hover:not(.hidden) { transform: translateY(-50%) scale(1.05); }
.nav-arrow svg { width: 20px; height: 20px; }

/* ── Footer ── */
.slide-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 3rem 1.5rem;
  font-size: 0.75rem;
}
.slide-footer .brand-label { font-family: 'Plain', system-ui, sans-serif; font-weight: 800; font-size: 0.8125rem; }
.slide-footer .url { position: absolute; left: 50%; transform: translateX(-50%); }

/* ── Text Colors ── */
.text-dark { color: #FEFCF9; }
.text-dark-muted { color: rgba(254,252,249,0.5); }
.text-dark-subtle { color: rgba(255,255,255,0.75); }
.text-light { color: #082422; }
.text-light-muted { color: #35605F; }
.text-brand { color: #082422; }
.text-brand-muted { color: rgba(8,36,34,0.6); }
.text-turquoise { color: #2BF2F1; }
.text-lime { color: #DCFF00; }

/* ── Title Slide ── */
.title-heading {
  font-family: 'Plain', system-ui, sans-serif;
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.02em;
  text-align: center;
}
.title-heading.huge { font-size: clamp(2.5rem, 6vw, 5rem); }
.title-subtitle {
  font-family: 'Geist Mono', 'SF Mono', 'Fira Code', monospace;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

/* ── Pill Badge ── */
.pill-badge {
  display: inline-block;
  border-radius: 9999px;
  padding: 0.375rem 1.25rem;
  font-family: 'Saans', system-ui, sans-serif;
  font-weight: 600;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.pill-badge.dark { background: rgba(43,242,241,0.2); color: #2BF2F1; }
.pill-badge.light { background: #2BF2F1; color: #082422; }
.pill-badge.brand { background: rgba(8,36,34,0.2); color: #082422; }

/* ── Section Heading ── */
.section-heading {
  font-family: 'Plain', system-ui, sans-serif;
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.02em;
  font-size: clamp(1.75rem, 4vw, 3rem);
  margin-bottom: 1.5rem;
}

/* ── Body Text ── */
.body-text {
  font-size: 0.9375rem;
  line-height: 1.7;
}

/* ── Grid Layouts ── */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}
.grid-2-3 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
}
.col-span-2 { grid-column: span 2; }

/* ── Info Card ── */
.info-card {
  border-radius: 1rem;
  padding: 1.25rem 1.5rem;
}
.info-card.dark { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
.info-card.light { background: white; border: 1px solid #CFCABF; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.info-card-title {
  font-family: 'Plain', system-ui, sans-serif;
  font-weight: 900;
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 0.75rem;
}
.info-card-body {
  font-size: 0.875rem;
  line-height: 1.65;
}

/* ── Bullet List ── */
.bullet-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.bullet-item {
  display: flex;
  gap: 0.625rem;
  font-size: 0.9375rem;
  line-height: 1.6;
  align-items: flex-start;
}
.bullet-icon {
  flex-shrink: 0;
  margin-top: 0.15rem;
  font-size: 1rem;
}
.bullet-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background: #2BF2F1;
  flex-shrink: 0;
  margin-top: 0.45rem;
}

/* ── Quote Slide ── */
.quote-text {
  font-family: 'Plain', system-ui, sans-serif;
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  font-weight: 500;
  line-height: 1.5;
  font-style: italic;
  max-width: 800px;
}
.quote-attribution {
  font-family: 'Geist Mono', 'SF Mono', 'Fira Code', monospace;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-top: 1.5rem;
}

/* ── Checklist ── */
.check-item {
  display: flex;
  gap: 0.625rem;
  font-size: 0.9375rem;
  line-height: 1.6;
  align-items: flex-start;
}
.check-icon {
  flex-shrink: 0;
  font-size: 1rem;
  margin-top: 0.1rem;
}

/* ── Closing Slide ── */
.closing-big {
  font-family: 'Geist Mono', 'SF Mono', 'Fira Code', monospace;
  font-weight: 700;
  color: rgba(8,36,34,0.1);
  font-size: clamp(100px, 20vw, 240px);
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

/* ── Comment Markers ── */
.comment-marker {
  position: absolute;
  z-index: 200;
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
}
.comment-ring {
  position: absolute;
  inset: -6px;
  border-radius: 9999px;
  opacity: 0.6;
  animation: commentPulse 2s ease-in-out infinite;
}
.comment-marker:hover .comment-ring { animation: none; }
.comment-circle {
  position: relative;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  transition: transform 0.2s;
}
.comment-marker:hover .comment-circle { transform: scale(1.1); }

@keyframes commentPulse {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.6); opacity: 0; }
}

/* ── Comment Popover ── */
.comment-popover {
  position: absolute;
  z-index: 300;
  width: 280px;
  background: rgba(8,36,34,0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 0.75rem;
  box-shadow: 0 16px 48px rgba(0,0,0,0.4);
  padding: 1rem;
  font-size: 0.8125rem;
}
.comment-popover-author {
  font-weight: 600;
  color: #2BF2F1;
  margin-bottom: 0.375rem;
}
.comment-popover-text {
  color: rgba(255,255,255,0.8);
  line-height: 1.5;
}
.comment-popover-reply {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}
.comment-popover-reply-author {
  font-weight: 600;
  color: rgba(255,255,255,0.6);
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
}

/* ── Loading Overlay ── */
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 999999;
  background: #082422;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}
.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(43,242,241,0.2);
  border-top-color: #2BF2F1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.loading-text {
  font-family: 'Plain', system-ui, sans-serif;
  font-weight: 600;
  color: rgba(254,252,249,0.6);
  font-size: 1rem;
}
.loading-subtitle {
  font-family: 'Geist Mono', 'SF Mono', 'Fira Code', monospace;
  font-size: 0.75rem;
  color: rgba(254,252,249,0.3);
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

/* ── Error State ── */
.error-overlay {
  position: fixed;
  inset: 0;
  z-index: 999999;
  background: #082422;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
}
.error-title {
  font-family: 'Plain', system-ui, sans-serif;
  font-weight: 900;
  color: #F26629;
  font-size: 1.25rem;
}
.error-message {
  color: rgba(254,252,249,0.6);
  font-size: 0.875rem;
  max-width: 400px;
  text-align: center;
  line-height: 1.6;
}
.error-btn {
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.1);
  color: #FEFCF9;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.error-btn:hover { background: rgba(255,255,255,0.15); }

/* ── Image Slide ── */
.slide-image {
  max-width: 100%;
  max-height: 60vh;
  border-radius: 1rem;
  object-fit: contain;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .slide-body { padding: 1.5rem; }
  .grid-2 { grid-template-columns: 1fr; }
  .nav-arrow { display: none; }
  .slide-footer { padding: 0 1.5rem 1rem; }
}
`
