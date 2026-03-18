"use strict";
(() => {
  // content/styles.ts
  var STYLES = `
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

/* \u2500\u2500 Typography \u2500\u2500 */
.font-display { font-family: 'Plain', system-ui, sans-serif; }
.font-mono { font-family: 'Geist Mono', 'SF Mono', 'Fira Code', monospace; }
.font-sans { font-family: 'Saans', system-ui, -apple-system, sans-serif; }

/* \u2500\u2500 Slide Container \u2500\u2500 */
.slide {
  position: absolute;
  inset: 0;
  display: none;
  flex-direction: column;
  overflow: hidden;
}
.slide.active { display: flex; animation: fadeIn 0.3s ease; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* \u2500\u2500 Backgrounds \u2500\u2500 */
.bg-dark { background-color: #082422; }
.bg-light { background-color: #EFEBE7; }
.bg-brand { background-color: #2BF2F1; }

/* \u2500\u2500 Slide Content Area \u2500\u2500 */
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

/* \u2500\u2500 Progress Bar \u2500\u2500 */
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

/* \u2500\u2500 Counter Pill \u2500\u2500 */
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

/* \u2500\u2500 Close Button \u2500\u2500 */
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

/* \u2500\u2500 Regenerate Button \u2500\u2500 */
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

/* \u2500\u2500 Dot Navigation \u2500\u2500 */
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

/* \u2500\u2500 Prev/Next Arrows \u2500\u2500 */
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

/* \u2500\u2500 Footer \u2500\u2500 */
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

/* \u2500\u2500 Text Colors \u2500\u2500 */
.text-dark { color: #FEFCF9; }
.text-dark-muted { color: rgba(254,252,249,0.5); }
.text-dark-subtle { color: rgba(255,255,255,0.75); }
.text-light { color: #082422; }
.text-light-muted { color: #35605F; }
.text-brand { color: #082422; }
.text-brand-muted { color: rgba(8,36,34,0.6); }
.text-turquoise { color: #2BF2F1; }
.text-lime { color: #DCFF00; }

/* \u2500\u2500 Title Slide \u2500\u2500 */
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

/* \u2500\u2500 Pill Badge \u2500\u2500 */
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

/* \u2500\u2500 Section Heading \u2500\u2500 */
.section-heading {
  font-family: 'Plain', system-ui, sans-serif;
  font-weight: 900;
  line-height: 0.95;
  letter-spacing: -0.02em;
  font-size: clamp(1.75rem, 4vw, 3rem);
  margin-bottom: 1.5rem;
}

/* \u2500\u2500 Body Text \u2500\u2500 */
.body-text {
  font-size: 0.9375rem;
  line-height: 1.7;
}

/* \u2500\u2500 Grid Layouts \u2500\u2500 */
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

/* \u2500\u2500 Info Card \u2500\u2500 */
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

/* \u2500\u2500 Bullet List \u2500\u2500 */
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

/* \u2500\u2500 Quote Slide \u2500\u2500 */
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

/* \u2500\u2500 Checklist \u2500\u2500 */
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

/* \u2500\u2500 Closing Slide \u2500\u2500 */
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

/* \u2500\u2500 Comment Markers \u2500\u2500 */
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

/* \u2500\u2500 Comment Popover \u2500\u2500 */
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

/* \u2500\u2500 Loading Overlay \u2500\u2500 */
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

/* \u2500\u2500 Error State \u2500\u2500 */
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

/* \u2500\u2500 Image Slide \u2500\u2500 */
.slide-image {
  max-width: 100%;
  max-height: 60vh;
  border-radius: 1rem;
  object-fit: contain;
}

/* \u2500\u2500 Responsive \u2500\u2500 */
@media (max-width: 768px) {
  .slide-body { padding: 1.5rem; }
  .grid-2 { grid-template-columns: 1fr; }
  .nav-arrow { display: none; }
  .slide-footer { padding: 0 1.5rem 1rem; }
}
`;

  // shared/colors.ts
  var COMMENT_COLORS = [
    { bg: "#6060BF", tint: "rgba(96,96,191,0.3)", name: "blueberry" },
    { bg: "#60D06F", tint: "rgba(96,208,111,0.3)", name: "cactus" },
    { bg: "#F19D38", tint: "rgba(241,157,56,0.3)", name: "mango" },
    { bg: "#F26629", tint: "rgba(242,102,41,0.3)", name: "papaya" },
    { bg: "#2BF2F1", tint: "rgba(43,242,241,0.3)", name: "turquoise" }
  ];
  function pickCommentColor(id) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = (hash << 5) - hash + id.charCodeAt(i) | 0;
    return COMMENT_COLORS[Math.abs(hash) % COMMENT_COLORS.length];
  }

  // content/renderer.ts
  function el(tag, cls, attrs) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (attrs) Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    return e;
  }
  function textEl(tag, text, cls) {
    const e = el(tag, cls);
    e.textContent = text;
    return e;
  }
  function htmlEl(tag, html, cls) {
    const e = el(tag, cls);
    e.innerHTML = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    return e;
  }
  function textColor(bg, variant = "main") {
    if (bg === "brand") return variant === "muted" ? "text-brand-muted" : "text-brand";
    if (bg === "light") return variant === "muted" ? "text-light-muted" : "text-light";
    return variant === "muted" ? "text-dark-muted" : "text-dark";
  }
  function renderFooter(num, total, bg) {
    const footer = el("div", `slide-footer ${textColor(bg, "muted")}`);
    const brand = el("span", `brand-label font-display ${textColor(bg)}`);
    brand.textContent = "Felix";
    const url = el("span", `url`);
    url.textContent = "felixpago.com";
    const counter = el("span", textColor(bg));
    counter.textContent = `${num} / ${total}`;
    footer.append(brand, url, counter);
    return footer;
  }
  function renderBadge(text, bg) {
    return textEl("span", text, `pill-badge ${bg}`);
  }
  function renderBullets(bullets, bg) {
    const list = el("div", "bullet-list");
    bullets?.forEach((b) => {
      const item = el("div", `bullet-item ${textColor(bg, "muted")}`);
      if (b.icon) {
        const icon = el("span", "bullet-icon");
        icon.textContent = b.icon;
        item.appendChild(icon);
      } else {
        item.appendChild(el("div", `bullet-dot`));
      }
      item.appendChild(htmlEl("span", b.text));
      list.appendChild(item);
    });
    return list;
  }
  function renderCards(cards, bg) {
    const grid = el("div", "grid-2-3");
    cards?.forEach((c) => {
      const card = el("div", `info-card ${bg === "dark" ? "dark" : "light"}`);
      const title = el("div", "info-card-title");
      title.textContent = c.title;
      title.style.color = c.titleColor;
      card.appendChild(title);
      card.appendChild(htmlEl("div", c.body, `info-card-body ${textColor(bg, "muted")}`));
      grid.appendChild(card);
    });
    return grid;
  }
  function renderComments(comments, slideEl) {
    let activePopover = null;
    comments.forEach((c) => {
      const color = pickCommentColor(c.author);
      const marker = el("button", "comment-marker");
      marker.style.left = `${c.x}%`;
      marker.style.top = `${c.y}%`;
      marker.style.transform = "translate(-50%, -50%)";
      const ring = el("div", "comment-ring");
      ring.style.backgroundColor = color.tint;
      marker.appendChild(ring);
      const circle = el("div", "comment-circle");
      circle.style.backgroundColor = color.bg;
      circle.textContent = c.author.charAt(0).toUpperCase();
      marker.appendChild(circle);
      marker.addEventListener("click", (e) => {
        e.stopPropagation();
        if (activePopover) {
          activePopover.remove();
          activePopover = null;
        }
        const popover = el("div", "comment-popover");
        popover.style.left = `${Math.min(c.x, 70)}%`;
        popover.style.top = `${c.y + 5}%`;
        const author = textEl("div", c.author, "comment-popover-author");
        const text = textEl("div", c.text, "comment-popover-text");
        popover.append(author, text);
        c.replies.forEach((r) => {
          const reply = el("div", "comment-popover-reply");
          reply.appendChild(textEl("div", r.author, "comment-popover-reply-author"));
          reply.appendChild(textEl("div", r.text, "comment-popover-text"));
          popover.appendChild(reply);
        });
        slideEl.appendChild(popover);
        activePopover = popover;
      });
      slideEl.appendChild(marker);
    });
    slideEl.addEventListener("click", () => {
      if (activePopover) {
        activePopover.remove();
        activePopover = null;
      }
    });
  }
  function renderTitleSlide(s, num, total) {
    const slide = el("div", `slide bg-${s.bg}`);
    const body = el("div", "slide-body");
    const inner = el("div", "slide-inner");
    inner.style.textAlign = "center";
    inner.style.display = "flex";
    inner.style.flexDirection = "column";
    inner.style.alignItems = "center";
    const h1 = el("h1", `title-heading huge ${textColor(s.bg)}`);
    h1.innerHTML = s.title.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    if (s.subtitle) {
      h1.innerHTML += `<br><span style="opacity:0.6">${s.subtitle.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</span>`;
    }
    inner.appendChild(h1);
    if (s.badge) {
      const badge = renderBadge(s.badge, s.bg);
      badge.style.marginTop = "1.5rem";
      inner.appendChild(badge);
    }
    body.appendChild(inner);
    slide.append(body, renderFooter(num, total, s.bg));
    return slide;
  }
  function renderSectionSlide(s, num, total) {
    const slide = el("div", `slide bg-${s.bg}`);
    const body = el("div", "slide-body");
    const inner = el("div", "slide-inner");
    inner.style.textAlign = "center";
    inner.style.display = "flex";
    inner.style.flexDirection = "column";
    inner.style.alignItems = "center";
    if (s.badge) inner.appendChild(renderBadge(s.badge, s.bg));
    const h2 = el("h2", `section-heading ${textColor(s.bg)}`);
    h2.style.fontSize = "clamp(2rem, 5vw, 3.5rem)";
    h2.style.marginTop = s.badge ? "1rem" : "0";
    h2.innerHTML = s.title.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    if (s.subtitle) {
      h2.innerHTML += `<br><span class="text-turquoise">${s.subtitle.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</span>`;
    }
    inner.appendChild(h2);
    body.appendChild(inner);
    slide.append(body, renderFooter(num, total, s.bg));
    return slide;
  }
  function renderContentSlide(s, num, total) {
    const slide = el("div", `slide bg-${s.bg}`);
    const body = el("div", "slide-body");
    const inner = el("div", "slide-inner");
    if (s.badge) {
      const badge = renderBadge(s.badge, s.bg);
      badge.style.marginBottom = "1rem";
      inner.appendChild(badge);
    }
    inner.appendChild(textEl("h2", s.title, `section-heading ${textColor(s.bg)}`));
    if (s.body) {
      inner.appendChild(htmlEl("p", s.body, `body-text ${textColor(s.bg, "muted")}`));
    }
    body.appendChild(inner);
    slide.append(body, renderFooter(num, total, s.bg));
    return slide;
  }
  function renderBulletsSlide(s, num, total) {
    const slide = el("div", `slide bg-${s.bg}`);
    const body = el("div", "slide-body");
    const inner = el("div", "slide-inner");
    if (s.badge) {
      const badge = renderBadge(s.badge, s.bg);
      badge.style.marginBottom = "1rem";
      inner.appendChild(badge);
    }
    inner.appendChild(textEl("h2", s.title, `section-heading ${textColor(s.bg)}`));
    if (s.body) {
      const p = htmlEl("p", s.body, `body-text ${textColor(s.bg, "muted")}`);
      p.style.marginBottom = "1.5rem";
      inner.appendChild(p);
    }
    if (s.bullets) inner.appendChild(renderBullets(s.bullets, s.bg));
    body.appendChild(inner);
    slide.append(body, renderFooter(num, total, s.bg));
    return slide;
  }
  function renderTwoColumnSlide(s, num, total) {
    const slide = el("div", `slide bg-${s.bg}`);
    const body = el("div", "slide-body");
    const inner = el("div", "slide-inner");
    if (s.badge) {
      const badge = renderBadge(s.badge, s.bg);
      badge.style.marginBottom = "1rem";
      inner.appendChild(badge);
    }
    inner.appendChild(textEl("h2", s.title, `section-heading ${textColor(s.bg)}`));
    const grid = el("div", "grid-2");
    s.columns?.forEach((col) => {
      const colEl = el("div", `info-card ${s.bg === "dark" ? "dark" : "light"}`);
      if (col.heading) colEl.appendChild(textEl("h3", col.heading, `info-card-title text-turquoise`));
      if (col.body) colEl.appendChild(htmlEl("p", col.body, `info-card-body ${textColor(s.bg, "muted")}`));
      if (col.bullets) colEl.appendChild(renderBullets(col.bullets, s.bg));
      grid.appendChild(colEl);
    });
    inner.appendChild(grid);
    body.appendChild(inner);
    slide.append(body, renderFooter(num, total, s.bg));
    return slide;
  }
  function renderCardsSlide(s, num, total) {
    const slide = el("div", `slide bg-${s.bg}`);
    const body = el("div", "slide-body");
    const inner = el("div", "slide-inner");
    if (s.badge) {
      const badge = renderBadge(s.badge, s.bg);
      badge.style.marginBottom = "1rem";
      inner.appendChild(badge);
    }
    inner.appendChild(textEl("h2", s.title, `section-heading ${textColor(s.bg)}`));
    if (s.cards) inner.appendChild(renderCards(s.cards, s.bg));
    body.appendChild(inner);
    slide.append(body, renderFooter(num, total, s.bg));
    return slide;
  }
  function renderQuoteSlide(s, num, total) {
    const slide = el("div", `slide bg-${s.bg}`);
    const body = el("div", "slide-body");
    body.style.flexDirection = "column";
    body.style.textAlign = "center";
    if (s.badge) body.appendChild(renderBadge(s.badge, s.bg));
    const q = el("blockquote", `quote-text ${textColor(s.bg)}`);
    q.innerHTML = `&ldquo;${(s.quote?.text || s.body || "").replace(/&/g, "&amp;").replace(/</g, "&lt;")}&rdquo;`;
    body.appendChild(q);
    if (s.quote?.attribution) {
      body.appendChild(textEl("p", `\u2014 ${s.quote.attribution}`, `quote-attribution ${textColor(s.bg, "muted")}`));
    }
    slide.append(body, renderFooter(num, total, s.bg));
    return slide;
  }
  function renderImageSlide(s, num, total) {
    const slide = el("div", `slide bg-${s.bg}`);
    const body = el("div", "slide-body");
    body.style.flexDirection = "column";
    body.style.gap = "1.5rem";
    if (s.title) body.appendChild(textEl("h2", s.title, `section-heading ${textColor(s.bg)}`));
    if (s.imageUrl) {
      const img = document.createElement("img");
      img.src = s.imageUrl;
      img.className = "slide-image";
      img.alt = s.title;
      body.appendChild(img);
    }
    if (s.body) body.appendChild(htmlEl("p", s.body, `body-text ${textColor(s.bg, "muted")}`));
    slide.append(body, renderFooter(num, total, s.bg));
    return slide;
  }
  function renderChecklistSlide(s, num, total) {
    const slide = el("div", `slide bg-${s.bg}`);
    const body = el("div", "slide-body");
    const inner = el("div", "slide-inner");
    if (s.badge) {
      const badge = renderBadge(s.badge, s.bg);
      badge.style.marginBottom = "1rem";
      inner.appendChild(badge);
    }
    inner.appendChild(textEl("h2", s.title, `section-heading ${textColor(s.bg)}`));
    const list = el("div", "bullet-list");
    s.bullets?.forEach((b) => {
      const item = el("div", `check-item ${textColor(s.bg, "muted")}`);
      const icon = el("span", "check-icon");
      icon.textContent = b.icon || "\u2713";
      item.append(icon, htmlEl("span", b.text));
      list.appendChild(item);
    });
    inner.appendChild(list);
    body.appendChild(inner);
    slide.append(body, renderFooter(num, total, s.bg));
    return slide;
  }
  function renderClosingSlide(s, num, total) {
    const slide = el("div", `slide bg-${s.bg}`);
    const bigText = el("div", "closing-big");
    bigText.textContent = "\u2726";
    slide.appendChild(bigText);
    const body = el("div", "slide-body");
    body.style.position = "relative";
    body.style.zIndex = "10";
    const inner = el("div", "slide-inner");
    inner.style.textAlign = "center";
    inner.style.display = "flex";
    inner.style.flexDirection = "column";
    inner.style.alignItems = "center";
    const h2 = el("h2", `title-heading huge ${textColor(s.bg)}`);
    h2.textContent = s.title;
    inner.appendChild(h2);
    if (s.subtitle || s.body) {
      const p = htmlEl("p", s.subtitle || s.body || "", `body-text ${textColor(s.bg, "muted")}`);
      p.style.maxWidth = "560px";
      p.style.marginTop = "1.25rem";
      inner.appendChild(p);
    }
    body.appendChild(inner);
    slide.append(body, renderFooter(num, total, s.bg));
    return slide;
  }
  var RENDERERS = {
    title: renderTitleSlide,
    section: renderSectionSlide,
    content: renderContentSlide,
    bullets: renderBulletsSlide,
    "two-column": renderTwoColumnSlide,
    cards: renderCardsSlide,
    quote: renderQuoteSlide,
    image: renderImageSlide,
    checklist: renderChecklistSlide,
    closing: renderClosingSlide
  };
  function renderSlides(slides) {
    const total = slides.length;
    return slides.map((s, i) => {
      const renderer = RENDERERS[s.type] || renderContentSlide;
      const slideEl = renderer(s, i + 1, total);
      if (s.comments?.length) {
        renderComments(s.comments, slideEl);
      }
      return slideEl;
    });
  }
  function renderSingleSlide(slide, index, total) {
    const renderer = RENDERERS[slide.type] || renderContentSlide;
    const slideEl = renderer(slide, index + 1, total);
    if (slide.comments?.length) {
      renderComments(slide.comments, slideEl);
    }
    return slideEl;
  }

  // content/extractor.ts
  function getPageTitle() {
    const titleEl = document.querySelector('.notion-page-block [placeholder="Untitled"]') || document.querySelector('.notion-frame [contenteditable="true"][data-root="true"]') || document.querySelector(".notion-page-content")?.closest('[class*="page"]')?.querySelector("h1, [contenteditable]");
    return titleEl?.textContent?.trim() || document.title.replace(/ - Notion$/, "").trim() || "Untitled";
  }
  function getPageIcon() {
    const iconEl = document.querySelector(".notion-page-block .notion-record-icon img");
    if (iconEl) return iconEl.src;
    const emojiEl = document.querySelector(".notion-page-block .notion-record-icon [aria-label]");
    if (emojiEl) return emojiEl.textContent?.trim() || void 0;
    return void 0;
  }
  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
  async function expandAllToggles() {
    const collapsed = [];
    const toggles = document.querySelectorAll(
      '[class*="toggle"][aria-expanded="false"], .notion-toggle:not(.notion-toggle-open), [class*="toggle-block"]:not([class*="open"])'
    );
    for (const toggle of toggles) {
      const btn = toggle.querySelector('[class*="toggle-button"], [class*="triangleDown"], [role="button"]') || toggle.querySelector('div[style*="cursor"]') || toggle;
      if (btn instanceof HTMLElement) {
        collapsed.push(toggle);
        btn.click();
      }
    }
    const blockToggles = document.querySelectorAll("[data-block-id]");
    for (const el2 of blockToggles) {
      const cls = el2.className || "";
      if (!cls.includes("toggle")) continue;
      if (el2.getAttribute("aria-expanded") === "false") {
        const btn = el2.querySelector('[class*="triangle"], [class*="arrow"], [role="button"]') || el2;
        if (btn instanceof HTMLElement && !collapsed.includes(el2)) {
          collapsed.push(el2);
          btn.click();
        }
      }
    }
    if (collapsed.length > 0) {
      await sleep(800);
      await sleep(400);
    }
    return collapsed;
  }
  function collapseToggles(toggles) {
    for (const toggle of toggles) {
      const btn = toggle.querySelector('[class*="toggle-button"], [class*="triangleDown"], [role="button"]') || toggle.querySelector('div[style*="cursor"]') || toggle;
      if (btn instanceof HTMLElement) btn.click();
    }
  }
  async function scrollToLoadImages() {
    const scroller = document.querySelector(".notion-scroller") || document.querySelector(".notion-frame") || document.scrollingElement || document.body;
    if (!scroller) return;
    const originalTop = scroller.scrollTop;
    const step = window.innerHeight;
    const maxScroll = scroller.scrollHeight;
    for (let pos = 0; pos < maxScroll; pos += step) {
      scroller.scrollTop = pos;
      await sleep(100);
    }
    scroller.scrollTop = originalTop;
    await sleep(300);
  }
  function classifyBlock(el2) {
    const cls = el2.className || "";
    if (cls.includes("notion-h1") || cls.includes("header-block") || cls.includes("heading_1")) return "heading1";
    if (cls.includes("notion-h2") || cls.includes("sub_header-block") || cls.includes("heading_2")) return "heading2";
    if (cls.includes("notion-h3") || cls.includes("sub_sub_header-block") || cls.includes("heading_3")) return "heading3";
    if (cls.includes("notion-to-do") || cls.includes("to_do-block") || cls.includes("to_do")) return "todo";
    if (cls.includes("notion-toggle") || cls.includes("toggle-block") || cls.includes("toggle")) return "toggle";
    if (cls.includes("notion-callout") || cls.includes("callout-block") || cls.includes("callout")) return "callout";
    if (cls.includes("notion-quote") || cls.includes("quote-block") || cls.includes("quote")) return "quote";
    if (cls.includes("notion-code") || cls.includes("code-block")) return "code";
    if (cls.includes("notion-image") || cls.includes("image-block") || cls.includes("image")) return "image";
    if (cls.includes("notion-hr") || cls.includes("divider-block") || cls.includes("divider")) return "divider";
    if (cls.includes("notion-bookmark") || cls.includes("bookmark-block")) return "paragraph";
    if (cls.includes("notion-simple-table") || cls.includes("table-block") || cls.includes("table_block")) return "table";
    if (cls.includes("notion-list-disc") || cls.includes("bulleted_list-block") || cls.includes("bulleted_list")) return "bullet";
    if (cls.includes("notion-list-numbered") || cls.includes("numbered_list-block") || cls.includes("numbered_list")) return "numbered";
    if (el2.querySelector("h1")) return "heading1";
    if (el2.querySelector("h2")) return "heading2";
    if (el2.querySelector("h3")) return "heading3";
    if (el2.querySelector('.notion-asset-wrapper-image, img.lazy-image-real, [class*="notion-image"]')) return "image";
    if (cls.includes("notion-text") || cls.includes("text-block") || cls.includes("text")) return "paragraph";
    const text = el2.textContent?.trim() || "";
    if (text.length > 0) return "paragraph";
    return null;
  }
  function extractImageUrl(el2) {
    const lazyImg = el2.querySelector("img.lazy-image-real, img.lazy-image-loaded");
    if (lazyImg?.src && !lazyImg.src.startsWith("data:")) return lazyImg.src;
    const assetImg = el2.querySelector(".notion-asset-wrapper img, .notion-asset-wrapper-image img");
    if (assetImg?.src && !assetImg.src.startsWith("data:")) return assetImg.src;
    const img = el2.querySelector("img");
    if (img?.src && !img.src.startsWith("data:")) return img.src;
    const bgEl = el2.querySelector('[style*="background-image"]');
    if (bgEl) {
      const match = bgEl.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
      if (match?.[1]) return match[1];
    }
    const dataSrcImg = el2.querySelector("img[data-src]");
    if (dataSrcImg?.getAttribute("data-src")) return dataSrcImg.getAttribute("data-src");
    const source = el2.querySelector("source[srcset]");
    if (source?.srcset) return source.srcset.split(",")[0].trim().split(" ")[0];
    return "";
  }
  function extractImageCaption(el2) {
    const caption = el2.querySelector('.notion-asset-caption, [class*="caption"]');
    if (caption?.textContent?.trim()) return caption.textContent.trim();
    const img = el2.querySelector("img");
    return img?.alt || "";
  }
  function extractBlocks(container) {
    const blocks = [];
    const blockEls = container.querySelectorAll("[data-block-id]");
    const seen = /* @__PURE__ */ new Set();
    blockEls.forEach((el2) => {
      const blockId = el2.getAttribute("data-block-id");
      if (!blockId || seen.has(blockId)) return;
      const parent = el2.parentElement?.closest("[data-block-id]");
      if (parent) {
        const parentId = parent.getAttribute("data-block-id") || "";
        if (seen.has(parentId)) {
          const parentCls = parent.className || "";
          if (!parentCls.includes("toggle")) return;
        }
      }
      seen.add(blockId);
      const type = classifyBlock(el2);
      if (!type) return;
      const block = { type, text: "" };
      if (type === "image") {
        block.imageUrl = extractImageUrl(el2);
        block.text = extractImageCaption(el2);
      } else if (type === "code") {
        block.text = el2.querySelector("code, pre")?.textContent?.trim() || el2.textContent?.trim() || "";
        const langEl = el2.querySelector('[class*="language"]');
        block.language = langEl?.textContent?.trim() || void 0;
      } else if (type === "todo") {
        const checkbox = el2.querySelector('input[type="checkbox"]');
        block.checked = checkbox?.checked || false;
        const textEl2 = el2.querySelector('[class*="to-do-children"], [contenteditable]');
        block.text = textEl2?.textContent?.trim() || el2.textContent?.trim() || "";
      } else if (type === "divider") {
        block.text = "---";
      } else if (type === "toggle") {
        const headingEl = el2.querySelector('[contenteditable], [class*="toggle-content"] > span, p');
        block.text = headingEl?.textContent?.trim() || el2.firstChild?.textContent?.trim() || "";
        const childContainer = el2.querySelector('[class*="toggle-content"] + div') || el2.querySelector(".notion-display-contents") || el2.querySelector('[class*="indented"]') || el2.querySelector('[style*="margin-left"]');
        if (childContainer) {
          const childBlocks = extractChildBlocks(childContainer, seen);
          if (childBlocks.length > 0) block.children = childBlocks;
        }
        if (!block.children || block.children.length === 0) {
          const childBlockEls = el2.querySelectorAll(":scope > [data-block-id], :scope > div > [data-block-id]");
          const children = [];
          childBlockEls.forEach((childEl) => {
            const childId = childEl.getAttribute("data-block-id");
            if (!childId || childId === blockId || seen.has(childId)) return;
            seen.add(childId);
            const childType = classifyBlock(childEl);
            if (!childType) return;
            const child = { type: childType, text: "" };
            if (childType === "image") {
              child.imageUrl = extractImageUrl(childEl);
              child.text = extractImageCaption(childEl);
            } else {
              child.text = childEl.textContent?.trim() || "";
            }
            if (child.text || child.imageUrl) children.push(child);
          });
          if (children.length > 0) block.children = children;
        }
      } else {
        block.text = el2.textContent?.trim() || "";
      }
      if (block.text || block.imageUrl || type === "divider") {
        blocks.push(block);
      }
    });
    if (blocks.length === 0) {
      const allEls = container.querySelectorAll("h1, h2, h3, p, li, blockquote, pre, img, hr, table, figure");
      allEls.forEach((el2) => {
        const tag = el2.tagName.toLowerCase();
        let type = "paragraph";
        if (tag === "h1") type = "heading1";
        else if (tag === "h2") type = "heading2";
        else if (tag === "h3") type = "heading3";
        else if (tag === "li") type = "bullet";
        else if (tag === "blockquote") type = "quote";
        else if (tag === "pre") type = "code";
        else if (tag === "img" || tag === "figure") type = "image";
        else if (tag === "hr") type = "divider";
        else if (tag === "table") type = "table";
        const block = { type, text: el2.textContent?.trim() || "" };
        if (type === "image") {
          block.imageUrl = tag === "figure" ? extractImageUrl(el2) : el2.src;
          block.text = tag === "figure" ? extractImageCaption(el2) : el2.alt || "";
        }
        if (block.text || block.imageUrl || type === "divider") {
          blocks.push(block);
        }
      });
    }
    return blocks;
  }
  function extractChildBlocks(container, parentSeen) {
    const blocks = [];
    const childEls = container.querySelectorAll("[data-block-id]");
    childEls.forEach((el2) => {
      const blockId = el2.getAttribute("data-block-id");
      if (!blockId || parentSeen.has(blockId)) return;
      parentSeen.add(blockId);
      const type = classifyBlock(el2);
      if (!type) return;
      const block = { type, text: "" };
      if (type === "image") {
        block.imageUrl = extractImageUrl(el2);
        block.text = extractImageCaption(el2);
      } else if (type === "divider") {
        block.text = "---";
      } else if (type === "toggle") {
        const headingEl = el2.querySelector("[contenteditable], p");
        block.text = headingEl?.textContent?.trim() || "";
        const nested = el2.querySelector('[class*="indented"], .notion-display-contents, [style*="margin-left"]');
        if (nested) block.children = extractChildBlocks(nested, parentSeen);
      } else {
        block.text = el2.textContent?.trim() || "";
      }
      if (block.text || block.imageUrl || type === "divider") {
        blocks.push(block);
      }
    });
    return blocks;
  }
  function extractComments() {
    const comments = [];
    const commentContainers = document.querySelectorAll(
      '[class*="discussion"], [class*="comment-thread"], [class*="sidebar-comment"]'
    );
    commentContainers.forEach((container) => {
      const authorEl = container.querySelector('[class*="author"], [class*="user-name"], [class*="name"]');
      const textEl2 = container.querySelector('[class*="comment-body"], [class*="discussion-body"], [class*="comment-text"]');
      const blockTextEl = container.querySelector('[class*="context"], [class*="referenced"]');
      const author = authorEl?.textContent?.trim() || "Unknown";
      const text = textEl2?.textContent?.trim() || "";
      const blockText = blockTextEl?.textContent?.trim() || "";
      if (text) {
        const replyEls = container.querySelectorAll('[class*="reply"]');
        const replies = [];
        replyEls.forEach((replyEl) => {
          const replyAuthor = replyEl.querySelector('[class*="author"], [class*="name"]')?.textContent?.trim() || "Unknown";
          const replyText = replyEl.querySelector('[class*="body"], [class*="text"]')?.textContent?.trim() || replyEl.textContent?.trim() || "";
          if (replyText && replyText !== text) {
            replies.push({ author: replyAuthor, text: replyText });
          }
        });
        comments.push({ blockText, author, text, replies });
      }
    });
    const highlights = document.querySelectorAll('[class*="highlight-yellow"], [style*="background: rgba(255, 212, 0"]');
    highlights.forEach((hl) => {
      const text = hl.textContent?.trim() || "";
      if (text && !comments.some((c) => c.blockText === text)) {
        comments.push({
          blockText: text,
          author: "Notion",
          text: `Comment on: "${text}"`,
          replies: []
        });
      }
    });
    return comments;
  }
  function detectToggles() {
    return document.querySelectorAll(
      '[class*="toggle"][aria-expanded="false"], .notion-toggle:not(.notion-toggle-open), [class*="toggle-block"]:not([class*="open"])'
    ).length > 0;
  }
  function detectLazyImages() {
    return document.querySelectorAll(
      'img.lazy-image:not(.lazy-image-real):not(.lazy-image-loaded), img[data-src]:not([src]), .notion-image img[src*="data:"]'
    ).length > 0;
  }
  function quickExtractNotionPage() {
    const title = getPageTitle();
    const icon = getPageIcon();
    const contentArea = document.querySelector(".notion-page-content") || document.querySelector(".notion-frame") || document.querySelector('[class*="notion-page"]') || document.body;
    const blocks = extractBlocks(contentArea);
    const comments = extractComments();
    return { title, icon, blocks, comments };
  }
  async function extractNotionPage() {
    const title = getPageTitle();
    const icon = getPageIcon();
    const hasToggles = detectToggles();
    const hasLazy = detectLazyImages();
    const expandedToggles = hasToggles ? await expandAllToggles() : [];
    if (hasLazy) await scrollToLoadImages();
    const contentArea = document.querySelector(".notion-page-content") || document.querySelector(".notion-frame") || document.querySelector('[class*="notion-page"]') || document.body;
    const blocks = extractBlocks(contentArea);
    const comments = extractComments();
    if (expandedToggles.length > 0) {
      await sleep(200);
      collapseToggles(expandedToggles);
    }
    return { title, icon, blocks, comments };
  }

  // content/gdocs-extractor.ts
  function getDocTitle() {
    const titleEl = document.querySelector(".docs-title-input") || document.querySelector("#docs-title");
    if (titleEl?.textContent?.trim()) return titleEl.textContent.trim();
    return document.title.replace(/\s*[-–]\s*Google Docs$/i, "").trim() || "Untitled";
  }
  function classifyParagraph(el2) {
    const roleEl = el2.querySelector('[role="heading"]');
    if (roleEl) {
      const level = roleEl.getAttribute("aria-level");
      if (level === "1") return "heading1";
      if (level === "2") return "heading2";
      if (level === "3") return "heading3";
    }
    const cls = el2.className || "";
    if (/heading.?1/i.test(cls)) return "heading1";
    if (/heading.?2/i.test(cls)) return "heading2";
    if (/heading.?3/i.test(cls)) return "heading3";
    if (/title/i.test(cls)) return "heading1";
    if (/subtitle/i.test(cls)) return "heading2";
    const firstSpan = el2.querySelector("span");
    if (firstSpan) {
      const size = parseFloat(window.getComputedStyle(firstSpan).fontSize);
      if (size >= 26) return "heading1";
      if (size >= 20) return "heading2";
      if (size >= 16) return "heading3";
    }
    if (el2.closest('[role="list"]') || el2.querySelector('[role="listitem"]')) return "bullet";
    return "paragraph";
  }
  function extractBlocks2() {
    const blocks = [];
    const paraEls = document.querySelectorAll(".kix-paragraphrenderer");
    if (paraEls.length > 0) {
      paraEls.forEach((el2) => {
        const text = el2.textContent?.trim() || "";
        if (!text) return;
        const type = classifyParagraph(el2);
        if (el2.querySelector(".kix-lineview-horizontal-rule")) {
          blocks.push({ type: "divider", text: "---" });
          return;
        }
        blocks.push({ type, text });
      });
    } else {
      const editable = document.querySelector('[contenteditable="true"]');
      if (editable) {
        editable.querySelectorAll("p, h1, h2, h3, h4, li, blockquote, hr").forEach((el2) => {
          const tag = el2.tagName.toLowerCase();
          let type = "paragraph";
          if (tag === "h1") type = "heading1";
          else if (tag === "h2") type = "heading2";
          else if (tag === "h3" || tag === "h4") type = "heading3";
          else if (tag === "li") type = "bullet";
          else if (tag === "blockquote") type = "quote";
          else if (tag === "hr") type = "divider";
          const text = el2.textContent?.trim() || "";
          if (text || type === "divider") {
            blocks.push({ type, text });
          }
        });
      }
    }
    return blocks;
  }
  function extractGDocsPage() {
    const title = getDocTitle();
    const blocks = extractBlocks2();
    return { title, icon: void 0, blocks, comments: [] };
  }

  // content/overlay.ts
  var isGDocs = () => window.location.hostname.includes("docs.google.com");
  async function extractCurrentPage() {
    return isGDocs() ? extractGDocsPage() : await extractNotionPage();
  }
  function quickExtractCurrentPage() {
    return isGDocs() ? extractGDocsPage() : quickExtractNotionPage();
  }
  async function hashContent(text) {
    const encoded = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  function serializeForHash(page) {
    return page.title + "\n" + page.blocks.map((b) => b.text).join("\n");
  }
  var backgroundCache = null;
  var preProcessSent = false;
  var mutationDebounce = null;
  async function backgroundExtract() {
    try {
      const page = quickExtractCurrentPage();
      const contentStr = serializeForHash(page);
      const hash = await hashContent(contentStr);
      if (backgroundCache?.hash === hash) return;
      backgroundCache = {
        page,
        hash,
        timestamp: Date.now(),
        hasToggles: !isGDocs() && detectToggles(),
        hasLazyImages: !isGDocs() && detectLazyImages()
      };
      if (!preProcessSent || backgroundCache.hash !== hash) {
        preProcessSent = true;
        chrome.runtime.sendMessage(
          { type: "PRE_PROCESS", payload: page },
          () => {
          }
        );
      }
    } catch {
    }
  }
  function setupBackgroundExtraction() {
    setTimeout(backgroundExtract, 3e3);
    const contentArea = document.querySelector(".notion-page-content") || document.querySelector(".notion-frame") || document.querySelector(".kix-appview-editor") || document.body;
    const observer = new MutationObserver(() => {
      if (mutationDebounce) clearTimeout(mutationDebounce);
      mutationDebounce = setTimeout(backgroundExtract, 1e4);
    });
    observer.observe(contentArea, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
  setupBackgroundExtraction();
  var fontsInjected = false;
  function injectFonts() {
    if (fontsInjected) return;
    fontsInjected = true;
    const plainBlack = chrome.runtime.getURL("fonts/plain/Plain-Black.woff2");
    const plainExtrabold = chrome.runtime.getURL("fonts/plain/Plain-Extrabold.woff2");
    const saansLight = chrome.runtime.getURL("fonts/saans/SaansLight.woff2");
    const saansRegular = chrome.runtime.getURL("fonts/saans/SaansRegular.woff2");
    const saansMedium = chrome.runtime.getURL("fonts/saans/SaansMedium.woff2");
    const saansSemiBold = chrome.runtime.getURL("fonts/saans/SaansSemiBold.woff2");
    const css = `
    @font-face { font-family: 'Plain'; font-weight: 900; font-display: swap; src: url('${plainBlack}') format('woff2'); }
    @font-face { font-family: 'Plain'; font-weight: 800; font-display: swap; src: url('${plainExtrabold}') format('woff2'); }
    @font-face { font-family: 'Saans'; font-weight: 300; font-display: swap; src: url('${saansLight}') format('woff2'); }
    @font-face { font-family: 'Saans'; font-weight: 400; font-display: swap; src: url('${saansRegular}') format('woff2'); }
    @font-face { font-family: 'Saans'; font-weight: 500; font-display: swap; src: url('${saansMedium}') format('woff2'); }
    @font-face { font-family: 'Saans'; font-weight: 600; font-display: swap; src: url('${saansSemiBold}') format('woff2'); }
  `;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }
  var overlayHost = null;
  function destroy() {
    if (overlayHost) {
      overlayHost.remove();
      overlayHost = null;
      document.body.style.overflow = "";
    }
  }
  function showLoading(shadow) {
    const loading = document.createElement("div");
    loading.className = "loading-overlay";
    loading.innerHTML = `
    <div class="loading-spinner"></div>
    <div class="loading-text" id="loading-phase">Extracting page content\u2026</div>
    <div class="loading-subtitle" id="loading-model">Expanding toggles &amp; loading images</div>
  `;
    shadow.appendChild(loading);
    return loading;
  }
  function updateLoadingPhase(shadow, phase, subtitle) {
    const phaseEl = shadow.getElementById("loading-phase");
    const sub = shadow.getElementById("loading-model");
    if (phaseEl) phaseEl.textContent = phase;
    if (subtitle && sub) {
      sub.textContent = subtitle;
      return;
    }
    chrome.storage.sync.get(["provider", "anthropicModel", "openrouterModel"], (result) => {
      if (!sub) return;
      const provider = result.provider || "anthropic";
      if (provider === "openrouter") {
        const m = result.openrouterModel || "openrouter model";
        sub.textContent = `Using ${m} via OpenRouter`;
      } else {
        const m = result.anthropicModel || "claude-sonnet-4-20250514";
        const short = {
          "claude-haiku-4-5-20251001": "Claude Haiku 4.5",
          "claude-sonnet-4-20250514": "Claude Sonnet 4",
          "claude-sonnet-4-5-20250514": "Claude Sonnet 4.5",
          "claude-sonnet-4-6-20250514": "Claude Sonnet 4.6"
        };
        sub.textContent = `Using ${short[m] || m}`;
      }
    });
  }
  function showError(shadow, message) {
    const err = document.createElement("div");
    err.className = "error-overlay";
    err.innerHTML = `
    <div class="error-title">Something went wrong</div>
    <div class="error-message">${message.replace(/</g, "&lt;")}</div>
    <button class="error-btn">Close</button>
  `;
    err.querySelector(".error-btn")?.addEventListener("click", destroy);
    shadow.appendChild(err);
  }
  function createStreamingPresentation(shadow) {
    const root = document.createElement("div");
    root.className = "preso-root";
    let current = 0;
    let total = 0;
    const slideEls = [];
    const slides = [];
    const progressTrack = document.createElement("div");
    const progressFill = document.createElement("div");
    const counter = document.createElement("div");
    const regenBtn = document.createElement("button");
    regenBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 105.64-11.36L3 10"/></svg>`;
    regenBtn.title = "Regenerate (ignore cache)";
    regenBtn.addEventListener("click", () => triggerGeneration(true));
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
    closeBtn.addEventListener("click", destroy);
    const dotsContainer = document.createElement("div");
    dotsContainer.className = "dots";
    const dots = [];
    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 19l-7-7 7-7"/></svg>`;
    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 5l7 7-7 7"/></svg>`;
    function getBgClass() {
      return slides[current]?.bg || "dark";
    }
    function updateChrome() {
      if (total === 0) return;
      const bg = getBgClass();
      progressTrack.className = `progress-track ${bg}`;
      progressFill.className = `progress-fill ${bg}`;
      progressFill.style.width = `${(current + 1) / total * 100}%`;
      counter.className = `counter-pill ${bg}`;
      counter.textContent = `${current + 1} / ${total}`;
      regenBtn.className = `regen-btn ${bg}`;
      closeBtn.className = `close-btn ${bg}`;
      dots.forEach((d, i) => {
        d.className = `dot ${i === current ? "active" : "inactive"} ${bg}`;
      });
      prevBtn.className = `nav-arrow prev ${bg} ${current === 0 ? "hidden" : ""}`;
      nextBtn.className = `nav-arrow next ${bg} ${current === total - 1 ? "hidden" : ""}`;
    }
    function goTo(index) {
      if (index < 0 || index >= slideEls.length || index === current) return;
      slideEls[current]?.classList.remove("active");
      current = index;
      slideEls[current]?.classList.add("active");
      updateChrome();
    }
    function next() {
      goTo(current + 1);
    }
    function prev() {
      goTo(current - 1);
    }
    const keyHandler = (e) => {
      const t = e.target;
      if (t?.tagName === "INPUT" || t?.tagName === "TEXTAREA") return;
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        destroy();
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(slideEls.length - 1);
      }
    };
    window.addEventListener("keydown", keyHandler, true);
    let touchX = null;
    root.addEventListener("touchstart", (e) => {
      touchX = e.targetTouches[0].clientX;
    });
    root.addEventListener("touchend", (e) => {
      if (touchX === null) return;
      const diff = touchX - e.changedTouches[0].clientX;
      if (diff > 50) next();
      else if (diff < -50) prev();
      touchX = null;
    });
    const origDestroy = destroy;
    destroy = () => {
      window.removeEventListener("keydown", keyHandler, true);
      origDestroy();
    };
    prevBtn.addEventListener("click", prev);
    nextBtn.addEventListener("click", next);
    progressTrack.appendChild(progressFill);
    root.appendChild(progressTrack);
    root.appendChild(counter);
    root.appendChild(regenBtn);
    root.appendChild(closeBtn);
    root.appendChild(dotsContainer);
    root.appendChild(prevBtn);
    root.appendChild(nextBtn);
    shadow.appendChild(root);
    return {
      addSlide(slide, index) {
        slides[index] = slide;
        total = Math.max(total, index + 1);
        const slideEl = renderSingleSlide(slide, index, total);
        if (index === 0) slideEl.classList.add("active");
        slideEls[index] = slideEl;
        root.insertBefore(slideEl, dotsContainer);
        const dot = document.createElement("button");
        dot.addEventListener("click", () => goTo(index));
        dots[index] = dot;
        dotsContainer.appendChild(dot);
        updateChrome();
      },
      finalize(finalSlides) {
        total = finalSlides.length;
        slideEls.forEach((el2) => el2?.remove());
        slideEls.length = 0;
        slides.length = 0;
        dots.forEach((d) => d?.remove());
        dots.length = 0;
        dotsContainer.innerHTML = "";
        const rendered = renderSlides(finalSlides);
        rendered.forEach((el2, i) => {
          slides[i] = finalSlides[i];
          slideEls[i] = el2;
          if (i === current) el2.classList.add("active");
          root.insertBefore(el2, dotsContainer);
          const dot = document.createElement("button");
          dot.addEventListener("click", () => goTo(i));
          dots[i] = dot;
          dotsContainer.appendChild(dot);
        });
        updateChrome();
      }
    };
  }
  function createPresentation(shadow, slides) {
    const root = document.createElement("div");
    root.className = "preso-root";
    let current = 0;
    const total = slides.length;
    const slideEls = renderSlides(slides);
    slideEls[0]?.classList.add("active");
    const progressTrack = document.createElement("div");
    const progressFill = document.createElement("div");
    const counter = document.createElement("div");
    const regenBtn = document.createElement("button");
    regenBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 105.64-11.36L3 10"/></svg>`;
    regenBtn.title = "Regenerate (ignore cache)";
    regenBtn.addEventListener("click", () => triggerGeneration(true));
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
    closeBtn.addEventListener("click", destroy);
    const dotsContainer = document.createElement("div");
    dotsContainer.className = "dots";
    const dots = [];
    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 19l-7-7 7-7"/></svg>`;
    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 5l7 7-7 7"/></svg>`;
    function getBgClass() {
      return slides[current]?.bg || "dark";
    }
    function updateChrome() {
      const bg = getBgClass();
      progressTrack.className = `progress-track ${bg}`;
      progressFill.className = `progress-fill ${bg}`;
      progressFill.style.width = `${(current + 1) / total * 100}%`;
      counter.className = `counter-pill ${bg}`;
      counter.textContent = `${current + 1} / ${total}`;
      regenBtn.className = `regen-btn ${bg}`;
      closeBtn.className = `close-btn ${bg}`;
      dots.forEach((d, i) => {
        d.className = `dot ${i === current ? "active" : "inactive"} ${bg}`;
      });
      prevBtn.className = `nav-arrow prev ${bg} ${current === 0 ? "hidden" : ""}`;
      nextBtn.className = `nav-arrow next ${bg} ${current === total - 1 ? "hidden" : ""}`;
    }
    function goTo(index) {
      if (index < 0 || index >= total || index === current) return;
      slideEls[current].classList.remove("active");
      current = index;
      slideEls[current].classList.add("active");
      updateChrome();
    }
    function next() {
      goTo(current + 1);
    }
    function prev() {
      goTo(current - 1);
    }
    for (let i = 0; i < total; i++) {
      const dot = document.createElement("button");
      dot.addEventListener("click", () => goTo(i));
      dots.push(dot);
      dotsContainer.appendChild(dot);
    }
    const keyHandler = (e) => {
      const t = e.target;
      if (t?.tagName === "INPUT" || t?.tagName === "TEXTAREA") return;
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        destroy();
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(total - 1);
      }
    };
    window.addEventListener("keydown", keyHandler, true);
    let touchX = null;
    root.addEventListener("touchstart", (e) => {
      touchX = e.targetTouches[0].clientX;
    });
    root.addEventListener("touchend", (e) => {
      if (touchX === null) return;
      const diff = touchX - e.changedTouches[0].clientX;
      if (diff > 50) next();
      else if (diff < -50) prev();
      touchX = null;
    });
    const origDestroy = destroy;
    destroy = () => {
      window.removeEventListener("keydown", keyHandler, true);
      origDestroy();
    };
    prevBtn.addEventListener("click", prev);
    nextBtn.addEventListener("click", next);
    progressTrack.appendChild(progressFill);
    root.appendChild(progressTrack);
    root.appendChild(counter);
    root.appendChild(regenBtn);
    root.appendChild(closeBtn);
    slideEls.forEach((s) => root.appendChild(s));
    root.appendChild(dotsContainer);
    root.appendChild(prevBtn);
    root.appendChild(nextBtn);
    updateChrome();
    shadow.appendChild(root);
  }
  function showPresentation(slides) {
    injectFonts();
    destroy();
    overlayHost = document.createElement("div");
    overlayHost.id = "notion-preso-overlay";
    overlayHost.style.cssText = "position:fixed;inset:0;z-index:999999;";
    document.body.appendChild(overlayHost);
    document.body.style.overflow = "hidden";
    const shadow = overlayHost.attachShadow({ mode: "closed" });
    const style = document.createElement("style");
    style.textContent = STYLES;
    shadow.appendChild(style);
    createPresentation(shadow, slides);
  }
  function triggerGeneration(forceRefresh = false) {
    injectFonts();
    destroy();
    overlayHost = document.createElement("div");
    overlayHost.id = "notion-preso-overlay";
    overlayHost.style.cssText = "position:fixed;inset:0;z-index:999999;";
    document.body.appendChild(overlayHost);
    document.body.style.overflow = "hidden";
    const shadow = overlayHost.attachShadow({ mode: "closed" });
    const style = document.createElement("style");
    style.textContent = STYLES;
    shadow.appendChild(style);
    const loading = showLoading(shadow);
    const canUseCached = !forceRefresh && backgroundCache && Date.now() - backgroundCache.timestamp < 6e4 && !backgroundCache.hasToggles && !backgroundCache.hasLazyImages;
    const extractPromise = canUseCached ? Promise.resolve(backgroundCache.page) : (async () => {
      if (backgroundCache && !backgroundCache.hasToggles && !backgroundCache.hasLazyImages) {
        return quickExtractCurrentPage();
      }
      updateLoadingPhase(shadow, "Extracting page content\u2026", "Expanding toggles & loading images");
      return await extractCurrentPage();
    })();
    extractPromise.then((page) => {
      updateLoadingPhase(shadow, "Generating presentation\u2026");
      const port = chrome.runtime.connect({ name: "preso-stream" });
      port.postMessage({ type: "GENERATE_STREAM", payload: page, forceRefresh });
      let streamingPreso = null;
      let loadingRemoved = false;
      let slideCount = 0;
      port.onMessage.addListener((msg) => {
        if (msg.type === "STREAM_START") {
        }
        if (msg.type === "STREAM_SLIDE") {
          if (!loadingRemoved) {
            loading.remove();
            loadingRemoved = true;
            streamingPreso = createStreamingPresentation(shadow);
          }
          streamingPreso.addSlide(msg.slide, msg.index);
          slideCount++;
        }
        if (msg.type === "STREAM_DONE") {
          if (!loadingRemoved) {
            loading.remove();
            loadingRemoved = true;
          }
          if (msg.slides.length > 0) {
            if (streamingPreso && slideCount > 0) {
              streamingPreso.finalize(msg.slides);
            } else {
              createPresentation(shadow, msg.slides);
            }
          } else {
            showError(shadow, "No slides generated. Please try again.");
          }
          port.disconnect();
        }
        if (msg.type === "STREAM_ERROR") {
          if (!loadingRemoved) {
            loading.remove();
            loadingRemoved = true;
          }
          showError(shadow, msg.error);
          port.disconnect();
        }
      });
      port.onDisconnect.addListener(() => {
        if (!loadingRemoved) {
          loading.remove();
          showError(shadow, "Connection to extension lost. Please try again.");
        }
      });
    }).catch((err) => {
      loading.remove();
      showError(shadow, err.message || "Failed to extract page content");
    });
  }
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "TRIGGER_EXTRACT") {
      triggerGeneration(!!message.forceRefresh);
    }
  });
})();
