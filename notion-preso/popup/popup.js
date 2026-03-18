"use strict";
(() => {
  // popup/popup.ts
  var generateBtn = document.getElementById("generate-btn");
  var regenBtn = document.getElementById("regen-btn");
  var optionsBtn = document.getElementById("options-btn");
  var optionsBtn2 = document.getElementById("options-btn-2");
  var statusEl = document.getElementById("status");
  var mainContent = document.getElementById("main-content");
  var notNotion = document.getElementById("not-notion");
  var modelBadge = document.getElementById("model-badge");
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0]?.url || "";
    const isNotion = url.includes("notion.so");
    const isGDocs = url.includes("docs.google.com/document");
    if (!isNotion && !isGDocs) {
      mainContent.style.display = "none";
      notNotion.style.display = "block";
    }
  });
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
      const provider = result.provider || "anthropic";
      let hasKey = false;
      let modelName = "";
      if (provider === "openrouter") {
        hasKey = !!result.openrouterKey;
        modelName = result.openrouterModel || "anthropic/claude-haiku-4.5";
        modelBadge.textContent = `OpenRouter \u2192 ${modelName}`;
      } else {
        hasKey = !!(result.anthropicKey || result.claudeApiKey);
        modelName = result.anthropicModel || result.claudeModel || "claude-sonnet-4-20250514";
        const SHORT = {
          "claude-haiku-4-5-20251001": "Haiku 4.5",
          "claude-sonnet-4-20250514": "Sonnet 4",
          "claude-sonnet-4-5-20250514": "Sonnet 4.5",
          "claude-sonnet-4-6-20250514": "Sonnet 4.6"
        };
        modelBadge.textContent = `Anthropic \u2192 ${SHORT[modelName] || modelName}`;
      }
      if (!hasKey) {
        statusEl.textContent = "Set your API key in settings first";
        statusEl.classList.add("visible", "error");
        generateBtn.disabled = true;
        regenBtn.disabled = true;
        modelBadge.textContent = "No API key configured";
      }
    }
  );
  function triggerPresentation(forceRefresh) {
    generateBtn.disabled = true;
    regenBtn.disabled = true;
    generateBtn.textContent = forceRefresh ? "Regenerating\u2026" : "Generating\u2026";
    statusEl.textContent = "Extracting page content\u2026";
    statusEl.classList.add("visible");
    statusEl.classList.remove("error");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "TRIGGER_EXTRACT", forceRefresh });
        setTimeout(() => window.close(), 500);
      }
    });
  }
  generateBtn.addEventListener("click", () => triggerPresentation(false));
  regenBtn.addEventListener("click", () => triggerPresentation(true));
  var openOptions = () => chrome.runtime.openOptionsPage();
  optionsBtn.addEventListener("click", openOptions);
  optionsBtn2?.addEventListener("click", openOptions);
})();
