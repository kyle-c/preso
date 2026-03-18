"use strict";
(() => {
  // background/claude-prompt.ts
  var SYSTEM_PROMPT = `You are a presentation designer for F\xE9lix Pago, a fintech company building cross-border payment solutions. You convert document content into structured slide presentations that follow the F\xE9lix design system.

## Brand Identity

### Typography
- Display / headings: Plain (font-weight 800\u2013900). Use for all titles, section headers, and large text.
- Body / UI text: Saans (font-weight 300\u2013600). Use for body copy, bullets, badges, and secondary text.
- Monospace: Geist Mono. Use sparingly for code or data labels.

### Color Palette
Primary:
- Turquoise: #2BF2F1 (brand primary accent)
- Slate: #082422 (brand dark / text on light)

Turquoise scale: 50 #EEFEFE, 100 #D4FFFE, 200 #AEFFFE, 300 #8DFDFA, 400 #5DF7F5, 500 #2BF2F1, 600 #14D4D3, 700 #10A8A7, 800 #128585, 900 #156D6C, 950 #064949

Secondary:
- Blueberry: #6060BF
- Cactus: #60D06F
- Mango: #F19D38
- Papaya: #F26629
- Lime: #DCFF00
- Lychee: #FFCD9C
- Fortuna: #FFB05A
- Sage: #7BA882

Neutral:
- Stone: #EFEBE7 (light background)
- Linen: #FEFCF9 (lightest / paper white)
- Concrete: #CFCABF (borders, separators)
- Mocha: #877867 (muted text)
- Evergreen: #35605F (dark muted text)

### Design Principles
- Clean, confident, contemporary fintech aesthetic
- Generous whitespace \u2014 never crowd a slide
- Strong typographic hierarchy with Plain for impact and Saans for clarity
- One idea per slide. If in doubt, split.
- Use the secondary palette (Blueberry, Cactus, Mango, Papaya, Lime) for visual variety in cards, accents, and data

## Slide Types Available
- "title": Full-screen opener. Always use bg "brand". Set a bold title and optional subtitle.
- "section": Section divider with large display text. Use bg "dark". Good for transitioning between topics.
- "content": Standard heading + body text. For explanations and narrative. bg "dark" or "light".
- "bullets": Heading + bullet list. For key points, steps, requirements. bg "dark" or "light". Keep bullets to 3\u20136 items, each 1\u20132 sentences max.
- "two-column": Two-column comparison or paired info. bg "dark" or "light". Use columns[0] and columns[1] with optional headings and bullets.
- "cards": Grid of info cards. bg "dark". Use 2\u20134 cards. Vary titleColor across the secondary palette for visual interest.
- "quote": Large highlighted quote or callout. bg "dark" or "brand". Use for impactful statements or data callouts.
- "image": Image-focused slide. bg "dark".
- "checklist": List with check/x icons. For do's and don'ts, criteria, requirements. bg "dark".
- "closing": Thank you / summary slide. Always use bg "brand". End with a clear takeaway.

## Presentation Best Practices (from the F\xE9lix design system)

### Background Rhythm
- Alternate between "dark" (slate #082422) and "light" (stone #EFEBE7) for content slides to create visual rhythm
- Prefer "dark" slides \u2014 they look more polished
- Use "brand" (turquoise #2BF2F1) sparingly: title slide, closing slide, and at most one accent slide mid-deck
- Never use the same bg color for 3+ consecutive slides

### Content Density
- Title slides: title only, or title + short subtitle. No body text.
- Content/bullet slides: one heading, one idea. 3\u20136 bullets max.
- Cards: 2\u20134 cards. Each card title \u2264 5 words, body \u2264 2 sentences.
- Two-column: balanced content \u2014 don't overload one side.

### Badge Usage
- Use the badge field for category labels: "Overview", "Key Insight", "Action Items", "Deep Dive", "Next Steps", etc.
- Badges help readers scan and orient. Use them on most slides.

### Structure
- Aim for 6\u201312 slides. One major topic per slide.
- Each heading1 in the source content typically becomes a new slide or section.
- Group related bullets and short paragraphs into single slides.
- If content has a natural intro, create a bullets or content slide after the title.
- End with a closing slide that crystallizes the key takeaway.

## Comment Mapping
If document comments are provided, map each to the most relevant slide. Position at:
- x: 85\u201395 (right side)
- y: 20\u201380 (distributed vertically)
Preserve original author and reply threads.

## Output Format
Return ONLY a valid JSON array of slide objects. No markdown wrapping, no explanation. Each object:

{
  "type": one of the slide types above,
  "bg": "dark" | "light" | "brand",
  "badge": optional string,
  "title": string (required),
  "subtitle": optional string,
  "body": optional string (supports **bold** markers),
  "bullets": optional array of { "text": string, "icon": optional emoji },
  "cards": optional array of { "title": string, "titleColor": hex color from secondary palette, "body": string },
  "columns": optional tuple of two { "heading": string, "body": string, "bullets": array },
  "quote": optional { "text": string, "attribution": optional string },
  "imageUrl": optional string,
  "comments": optional array of { "author": string, "text": string, "replies": array, "x": number, "y": number }
}
`;
  var OUTLINE_PROMPT = `You are a document analyst preparing content for a presentation designer. Read the document and produce a concise presentation brief.

Output a structured outline \u2014 one slide per section:

# [Document Title]
SLIDES: [estimated count, 6-12]

1. TITLE | "[Main title]" | subtitle: "[optional]"
2. [TYPE] | "[Slide title]" | badge: "[category]"
   - [Key point verbatim from doc]
   - [Key point verbatim from doc]
   - data: [any numbers, stats, quotes \u2014 exact]
3. ...

Rules:
- Preserve ALL numbers, quotes, proper nouns, and technical terms EXACTLY as written
- Suggest slide types: TITLE, SECTION, BULLETS, CONTENT, CARDS, TWO-COLUMN, QUOTE, CHECKLIST, CLOSING
- Keep each point to 1 sentence max
- Remove filler prose \u2014 keep only substance
- Group related paragraphs into single slides
- Identify the best quotes or data callouts for QUOTE slides
- Note images with their context: [IMAGE: description]
- Aim for 6-12 slides total
- End with a CLOSING slide summarizing the key takeaway`;
  function buildUserMessage(title, content, comments) {
    let msg = `Convert this document into a F\xE9lix Pago presentation.

Document Title: ${title}

## Content
${content}`;
    if (comments) {
      msg += `

## Document Comments
${comments}`;
    }
    return msg;
  }
  function buildOutlineUserMessage(title, content) {
    return `Create a presentation brief for this document.

Document Title: ${title}

## Content
${content}`;
  }
  function buildFromOutlineMessage(title, outline, extraContent) {
    let msg = `Convert this presentation brief into a F\xE9lix Pago presentation.

Document Title: ${title}

## Presentation Brief
${outline}`;
    if (extraContent) {
      msg += `

## Additional Content (from expanded sections)
${extraContent}`;
    }
    return msg;
  }

  // background/service-worker.ts
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === "GENERATE_PRESO") {
      const forceRefresh = !!message.forceRefresh;
      handleGenerate(message.payload, forceRefresh).then((slides) => sendResponse({ type: "PRESO_RESULT", payload: { slides } })).catch((err) => sendResponse({ type: "PRESO_ERROR", payload: { error: err.message || String(err) } }));
      return true;
    }
    if (message.type === "PRE_PROCESS") {
      handlePreProcess(message.payload).then((result) => sendResponse({ type: "PRE_PROCESS_DONE", payload: result })).catch(() => sendResponse({ type: "PRE_PROCESS_DONE", payload: { hash: "", hasOutline: false } }));
      return true;
    }
  });
  chrome.runtime.onConnect.addListener((port) => {
    if (port.name !== "preso-stream") return;
    port.onMessage.addListener(async (message) => {
      if (message.type === "GENERATE_STREAM") {
        try {
          await handleStreamGenerate(
            message.payload,
            !!message.forceRefresh,
            port
          );
        } catch (err) {
          const msg = {
            type: "STREAM_ERROR",
            error: err instanceof Error ? err.message : String(err)
          };
          try {
            port.postMessage(msg);
          } catch {
          }
        }
      }
    });
  });
  async function hashContent(text) {
    const encoded = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  var CACHE_PREFIX = "preso-cache:";
  var OUTLINE_PREFIX = "preso-outline:";
  var CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1e3;
  async function getCached(hash) {
    return new Promise((resolve) => {
      chrome.storage.local.get(CACHE_PREFIX + hash, (result) => {
        const entry = result[CACHE_PREFIX + hash];
        if (entry && Date.now() - entry.timestamp < CACHE_MAX_AGE) {
          resolve(entry.slides);
        } else {
          resolve(null);
        }
      });
    });
  }
  async function setCache(hash, slides) {
    const entry = { hash, slides, timestamp: Date.now() };
    return new Promise((resolve) => {
      chrome.storage.local.set({ [CACHE_PREFIX + hash]: entry }, resolve);
    });
  }
  async function getOutline(hash) {
    return new Promise((resolve) => {
      chrome.storage.local.get(OUTLINE_PREFIX + hash, (result) => {
        const entry = result[OUTLINE_PREFIX + hash];
        if (entry && Date.now() - entry.timestamp < CACHE_MAX_AGE) {
          resolve(entry.outline);
        } else {
          resolve(null);
        }
      });
    });
  }
  async function setOutline(hash, outline) {
    const entry = { hash, outline, timestamp: Date.now() };
    return new Promise((resolve) => {
      chrome.storage.local.set({ [OUTLINE_PREFIX + hash]: entry }, resolve);
    });
  }
  async function evictStaleCache() {
    return new Promise((resolve) => {
      chrome.storage.local.get(null, (all) => {
        const stale = [];
        for (const [key, val] of Object.entries(all)) {
          if (key.startsWith(CACHE_PREFIX) || key.startsWith(OUTLINE_PREFIX)) {
            const entry = val;
            if (Date.now() - entry.timestamp > CACHE_MAX_AGE) stale.push(key);
          }
        }
        if (stale.length) chrome.storage.local.remove(stale, resolve);
        else resolve();
      });
    });
  }
  var DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-4-20250514";
  var DEFAULT_OPENROUTER_MODEL = "anthropic/claude-haiku-4.5";
  var CHEAP_ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";
  var CHEAP_OPENROUTER_MODEL = "google/gemini-2.5-flash-lite";
  async function getSettings() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(
        [
          "provider",
          "anthropicKey",
          "anthropicModel",
          "openrouterKey",
          "openrouterModel",
          "claudeApiKey",
          "claudeModel"
        ],
        (result) => {
          if (result.claudeApiKey && !result.anthropicKey) {
            result.provider = "anthropic";
            result.anthropicKey = result.claudeApiKey;
            result.anthropicModel = result.claudeModel;
          }
          const provider = result.provider || "anthropic";
          if (provider === "openrouter") {
            if (!result.openrouterKey) return reject(new Error("No OpenRouter API key configured. Go to extension settings."));
            resolve({
              provider: "openrouter",
              apiKey: result.openrouterKey,
              model: result.openrouterModel || DEFAULT_OPENROUTER_MODEL
            });
          } else {
            if (!result.anthropicKey) return reject(new Error("No API key configured. Go to extension settings."));
            resolve({
              provider: "anthropic",
              apiKey: result.anthropicKey,
              model: result.anthropicModel || DEFAULT_ANTHROPIC_MODEL
            });
          }
        }
      );
    });
  }
  function serializeBlocks(page) {
    return page.blocks.map((b) => {
      const prefix = b.type === "heading1" ? "# " : b.type === "heading2" ? "## " : b.type === "heading3" ? "### " : b.type === "bullet" ? "- " : b.type === "numbered" ? "1. " : b.type === "todo" ? `[${b.checked ? "x" : " "}] ` : b.type === "callout" ? "> \u{1F4A1} " : b.type === "quote" ? "> " : b.type === "code" ? "```\n" : b.type === "divider" ? "---" : b.type === "image" ? `[Image: ${b.imageUrl || ""}] ` : "";
      const suffix = b.type === "code" ? "\n```" : "";
      let result = `${prefix}${b.text}${suffix}`;
      if (b.children) {
        result += "\n" + b.children.map((c) => `  - ${c.text}`).join("\n");
      }
      return result;
    }).join("\n");
  }
  function serializeComments(page) {
    if (page.comments.length === 0) return "";
    return page.comments.map((c) => {
      let s = `[${c.author}] on "${c.blockText}": ${c.text}`;
      c.replies.forEach((r) => {
        s += `
  \u21B3 [${r.author}]: ${r.text}`;
      });
      return s;
    }).join("\n");
  }
  async function callApiNonStream(settings, systemPrompt, userMessage, model) {
    const useModel = model || settings.model;
    if (settings.provider === "openrouter") {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${settings.apiKey}`,
          "HTTP-Referer": "https://felix.pago",
          "X-OpenRouter-Title": "Doc Preso"
        },
        body: JSON.stringify({
          model: useModel,
          max_tokens: 4096,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ]
        })
      });
      if (!response.ok) {
        const err = await response.text();
        throw new Error(`OpenRouter API error (${response.status}): ${err}`);
      }
      const data = await response.json();
      return data.choices?.[0]?.message?.content || "";
    } else {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": settings.apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: useModel,
          max_tokens: 4096,
          system: systemPrompt,
          messages: [{ role: "user", content: userMessage }]
        })
      });
      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Anthropic API error (${response.status}): ${err}`);
      }
      const data = await response.json();
      return data.content?.[0]?.text || "";
    }
  }
  async function* streamAnthropic(settings, userMessage) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": settings.apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: settings.model,
        max_tokens: 16384,
        stream: true,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }]
      })
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Anthropic API error (${response.status}): ${err}`);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") return;
        try {
          const event = JSON.parse(data);
          if (event.type === "content_block_delta" && event.delta?.text) {
            yield event.delta.text;
          }
        } catch {
        }
      }
    }
  }
  async function* streamOpenRouter(settings, userMessage) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${settings.apiKey}`,
        "HTTP-Referer": "https://felix.pago",
        "X-OpenRouter-Title": "Doc Preso"
      },
      body: JSON.stringify({
        model: settings.model,
        max_tokens: 16384,
        stream: true,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage }
        ]
      })
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenRouter API error (${response.status}): ${err}`);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") return;
        try {
          const event = JSON.parse(data);
          const content = event.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch {
        }
      }
    }
  }
  var IncrementalSlideParser = class {
    buffer = "";
    slides = [];
    depth = 0;
    inString = false;
    escaped = false;
    objectStart = -1;
    inArray = false;
    addChunk(chunk) {
      const newSlides = [];
      for (const ch of chunk) {
        this.buffer += ch;
        if (this.escaped) {
          this.escaped = false;
          continue;
        }
        if (ch === "\\" && this.inString) {
          this.escaped = true;
          continue;
        }
        if (ch === '"') {
          this.inString = !this.inString;
          continue;
        }
        if (this.inString) continue;
        if (ch === "[" && !this.inArray) {
          this.inArray = true;
          continue;
        }
        if (ch === "{") {
          if (this.depth === 0) this.objectStart = this.buffer.length - 1;
          this.depth++;
        } else if (ch === "}") {
          this.depth--;
          if (this.depth === 0 && this.objectStart >= 0) {
            const objStr = this.buffer.slice(this.objectStart);
            try {
              const slide = JSON.parse(objStr);
              newSlides.push(slide);
              this.slides.push(slide);
            } catch {
            }
            this.objectStart = -1;
          }
        }
      }
      return newSlides;
    }
    getAll() {
      return this.slides;
    }
    getRawBuffer() {
      return this.buffer;
    }
  };
  function parseJsonWithRepair(raw) {
    try {
      return JSON.parse(raw);
    } catch {
    }
    let json = raw.replace(/,\s*([}\]])/g, "$1");
    try {
      return JSON.parse(json);
    } catch {
    }
    json = json.replace(/"([^"]*?)"/g, (_match, content) => {
      const escaped = content.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
      return `"${escaped}"`;
    });
    try {
      return JSON.parse(json);
    } catch {
    }
    json = raw.replace(/,\s*([}\]])/g, "$1");
    json = json.replace(/:\s*"((?:[^"\\]|\\.)*)"/g, (_match, content) => {
      const fixed = content.replace(/(?<!\\)"/g, '\\"');
      return `: "${fixed}"`;
    });
    try {
      return JSON.parse(json);
    } catch {
    }
    json = raw.replace(/,\s*([}\]])/g, "$1");
    let bracketDepth = 0, braceDepth = 0, lastValidEnd = -1;
    for (let i = 0; i < json.length; i++) {
      const ch = json[i];
      if (ch === "[") bracketDepth++;
      else if (ch === "]") {
        bracketDepth--;
        if (bracketDepth === 0) lastValidEnd = i;
      } else if (ch === "{") braceDepth++;
      else if (ch === "}") braceDepth--;
    }
    if (lastValidEnd > 0) {
      try {
        return JSON.parse(json.slice(0, lastValidEnd + 1));
      } catch {
      }
    }
    let repaired = json.trimEnd();
    repaired = repaired.replace(/,\s*"[^"]*$/, "");
    repaired = repaired.replace(/,\s*{[^}]*$/, "");
    repaired = repaired.replace(/:\s*"[^"]*$/, ': ""');
    let openBraces = 0, openBrackets = 0;
    let inStr = false, esc = false;
    for (const ch of repaired) {
      if (esc) {
        esc = false;
        continue;
      }
      if (ch === "\\") {
        esc = true;
        continue;
      }
      if (ch === '"') {
        inStr = !inStr;
        continue;
      }
      if (inStr) continue;
      if (ch === "{") openBraces++;
      else if (ch === "}") openBraces--;
      else if (ch === "[") openBrackets++;
      else if (ch === "]") openBrackets--;
    }
    for (let i = 0; i < openBraces; i++) repaired += "}";
    for (let i = 0; i < openBrackets; i++) repaired += "]";
    try {
      return JSON.parse(repaired);
    } catch (e) {
      throw new Error(`Failed to parse slide JSON: ${e.message}`);
    }
  }
  async function handlePreProcess(page) {
    const content = serializeBlocks(page);
    const userMessage = buildOutlineUserMessage(page.title, content);
    const hash = await hashContent(userMessage);
    const cachedSlides = await getCached(hash);
    if (cachedSlides) return { hash, hasOutline: true };
    const cachedOutline = await getOutline(hash);
    if (cachedOutline) return { hash, hasOutline: true };
    try {
      const settings = await getSettings();
      const cheapModel = settings.provider === "openrouter" ? CHEAP_OPENROUTER_MODEL : CHEAP_ANTHROPIC_MODEL;
      const truncated = userMessage.length > 8e4 ? userMessage.slice(0, 8e4) + "\n\n[Content truncated due to length]" : userMessage;
      const outline = await callApiNonStream(settings, OUTLINE_PROMPT, truncated, cheapModel);
      await setOutline(hash, outline);
      return { hash, hasOutline: true };
    } catch {
      return { hash, hasOutline: false };
    }
  }
  async function handleStreamGenerate(page, forceRefresh, port) {
    const content = serializeBlocks(page);
    const comments = serializeComments(page);
    const fullUserMessage = buildUserMessage(page.title, content, comments);
    const hash = await hashContent(fullUserMessage);
    if (!forceRefresh) {
      const cached = await getCached(hash);
      if (cached) {
        const startMsg2 = { type: "STREAM_START", estimatedTotal: cached.length };
        port.postMessage(startMsg2);
        cached.forEach((slide, i) => {
          const slideMsg = { type: "STREAM_SLIDE", slide, index: i };
          port.postMessage(slideMsg);
        });
        const doneMsg2 = { type: "STREAM_DONE", slides: cached };
        port.postMessage(doneMsg2);
        return;
      }
    }
    evictStaleCache();
    const settings = await getSettings();
    let userMessage;
    const outlineHash = await hashContent(buildOutlineUserMessage(page.title, content));
    const outline = await getOutline(outlineHash);
    if (outline) {
      userMessage = buildFromOutlineMessage(page.title, outline);
      if (comments) {
        userMessage += `

## Document Comments
${comments}`;
      }
    } else {
      userMessage = fullUserMessage;
    }
    const truncated = userMessage.length > 8e4 ? userMessage.slice(0, 8e4) + "\n\n[Content truncated due to length]" : userMessage;
    const headingCount = (content.match(/^#{1,2} /gm) || []).length;
    const estimatedTotal = Math.max(6, Math.min(12, headingCount + 2));
    const startMsg = { type: "STREAM_START", estimatedTotal };
    port.postMessage(startMsg);
    const parser = new IncrementalSlideParser();
    const stream = settings.provider === "openrouter" ? streamOpenRouter(settings, truncated) : streamAnthropic(settings, truncated);
    for await (const chunk of stream) {
      const newSlides = parser.addChunk(chunk);
      for (const slide of newSlides) {
        const slideMsg = {
          type: "STREAM_SLIDE",
          slide,
          index: parser.getAll().length - newSlides.length + newSlides.indexOf(slide)
        };
        try {
          port.postMessage(slideMsg);
        } catch {
          return;
        }
      }
    }
    let slides = parser.getAll();
    if (slides.length === 0) {
      const rawText = parser.getRawBuffer();
      const jsonMatch = rawText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        const errMsg = { type: "STREAM_ERROR", error: "Failed to parse slide data from model response" };
        port.postMessage(errMsg);
        return;
      }
      slides = parseJsonWithRepair(jsonMatch[0]);
      slides.forEach((slide, i) => {
        const slideMsg = { type: "STREAM_SLIDE", slide, index: i };
        try {
          port.postMessage(slideMsg);
        } catch {
        }
      });
    }
    await setCache(hash, slides);
    const doneMsg = { type: "STREAM_DONE", slides };
    try {
      port.postMessage(doneMsg);
    } catch {
    }
  }
  async function handleGenerate(page, forceRefresh = false) {
    const content = serializeBlocks(page);
    const comments = serializeComments(page);
    const fullUserMessage = buildUserMessage(page.title, content, comments);
    const hash = await hashContent(fullUserMessage);
    if (!forceRefresh) {
      const cached = await getCached(hash);
      if (cached) return cached;
    }
    evictStaleCache();
    const settings = await getSettings();
    let userMessage;
    const outlineHash = await hashContent(buildOutlineUserMessage(page.title, content));
    const outline = await getOutline(outlineHash);
    if (outline) {
      userMessage = buildFromOutlineMessage(page.title, outline);
      if (comments) userMessage += `

## Document Comments
${comments}`;
    } else {
      userMessage = fullUserMessage;
    }
    const truncated = userMessage.length > 8e4 ? userMessage.slice(0, 8e4) + "\n\n[Content truncated due to length]" : userMessage;
    const text = await callApiNonStream(settings, SYSTEM_PROMPT, truncated);
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to parse slide data from model response");
    }
    const slides = parseJsonWithRepair(jsonMatch[0]);
    await setCache(hash, slides);
    return slides;
  }
})();
