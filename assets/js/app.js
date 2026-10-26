const shapesGrid = document.getElementById("shapesGrid");
const searchInput = document.getElementById("searchInput");
const filterBtns = document.querySelectorAll(".filter-btn");
const resultsCount = document.getElementById("resultsCount");
const toast = document.getElementById("toast");
const boostToggle = document.getElementById("boostToggle");
const boostText = document.getElementById("boostText");
const ashColorToggle = document.getElementById("ashColorToggle");
const ashColorText = document.getElementById("ashColorText");
const activeOpClassBadge = document.getElementById("activeOpClassBadge");
const activeOpClassText = document.getElementById("activeOpClassText");
const globalOpButtons = document.querySelectorAll("#globalOpOptions .op-btn");
const globalAnimButtons = document.querySelectorAll("#globalAnimOptions .anim-btn");
const activeAnimClassBadge = document.getElementById("activeAnimClassBadge");
const activeAnimClassText = document.getElementById("activeAnimClassText");
const modalAnimButtons = document.querySelectorAll("#modalAnimGroup .modal-anim-btn");
const smartMotionToggle = document.getElementById("smartMotionToggle");
const speedButtons = document.querySelectorAll("#speedOptions .speed-btn");

// Modal elements
const previewModal = document.getElementById("previewModal");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalStage = document.getElementById("modalStage");
const modalShapeNum = document.getElementById("modalShapeNum");
const modalShapeName = document.getElementById("modalShapeName");
const modalCategoryTag = document.getElementById("modalCategoryTag");
const modalShapeDesc = document.getElementById("modalShapeDesc");
const modalClassCode = document.getElementById("modalClassCode");
const modalCopyBtn = document.getElementById("modalCopyBtn");
const modalColorCycle = document.getElementById("modalColorCycle");
const modalColorText = document.getElementById("modalColorText");
const modalOpButtons = document.querySelectorAll("#modalOpGroup .modal-op-btn");

// Modal Standalone CSS Export elements
const modalShapeCssCode = document.getElementById("modalShapeCssCode");
const modalGeneralCssCode = document.getElementById("modalGeneralCssCode");
const modalCodeShapeNum = document.getElementById("modalCodeShapeNum");
const modalCopyShapeCssBtn = document.getElementById("modalCopyShapeCssBtn");
const modalCopyGeneralCssBtn = document.getElementById("modalCopyGeneralCssBtn");
const modalCopyCombinedBtn = document.getElementById("modalCopyCombinedBtn");

// Modal Navigation elements
const modalHeaderPrevBtn = document.getElementById("modalHeaderPrevBtn");
const modalHeaderNextBtn = document.getElementById("modalHeaderNextBtn");
const modalStagePrevBtn = document.getElementById("modalStagePrevBtn");
const modalStageNextBtn = document.getElementById("modalStageNextBtn");
const modalNavCounter = document.getElementById("modalNavCounter");

let activeFilter = "all";
let searchTerm = "";
let currentActiveShape = null;
let currentOpacity = 100; // Default: 100%
let currentAnimation = "none"; // Default: None (Static)
let isSmartMotionActive = false;
let currentSpeed = "normal"; // "slow", "normal", "fast"
let currentFilteredShapes = [...SHAPES_DATA];

// Universal Neutral Ash & Smoke Tone Presets
const ASH_PRESETS = [
  { name: "Slate Ash (Default)", val: "100, 116, 139", hex: "#64748b", cls: "bg-shape-ash" },
  { name: "Pure Smoke (Zero Hue)", val: "115, 115, 115", hex: "#737373", cls: "bg-shape-smoke" },
  { name: "Soft Silver Ash", val: "148, 163, 184", hex: "#94a3b8", cls: "bg-shape-silver" },
  { name: "Deep Charcoal Ash", val: "55, 65, 81", hex: "#374151", cls: "bg-shape-charcoal" },
  { name: "Architectural Graphite", val: "71, 85, 105", hex: "#475569", cls: "bg-shape-graphite" },
  { name: "Neutral Zinc Ash", val: "113, 113, 122", hex: "#71717a", cls: "bg-shape-zinc" },
  { name: "Warm Stone Ash", val: "120, 113, 108", hex: "#78716c", cls: "bg-shape-stone" }
];
let currentAshIndex = 0;

const CATEGORY_SMART_MOTION = {
  "grids": "bg-shape-anim-drift",
  "floors": "bg-shape-anim-tilt",
  "isometric": "bg-shape-anim-float",
  "circles": "bg-shape-anim-spin",
  "tech": "bg-shape-anim-shimmer",
  "glows": "bg-shape-anim-pulse",
  "compositions": "bg-shape-anim-breathe",
  "doodles": "bg-shape-anim-doodle-sway",
  "waves": "bg-shape-anim-wave",
  "circuits": "bg-shape-anim-glitch",
  "hud": "bg-shape-anim-radar",
  "geometry": "bg-shape-anim-spin-reverse",
  "gaming": "bg-shape-anim-conveyor",
  "organic": "bg-shape-anim-wobble",
  "data": "bg-shape-anim-pulse",
  "business": "bg-shape-anim-float",
  "motion": ""
};

const ALL_ANIMATION_CLASSES = [
  "bg-shape-anim-float", "bg-shape-anim-drift", "bg-shape-anim-pan",
  "bg-shape-anim-spin", "bg-shape-anim-spin-reverse", "bg-shape-anim-rotate",
  "bg-shape-anim-pulse", "bg-shape-anim-wave", "bg-shape-anim-tilt",
  "bg-shape-anim-shimmer", "bg-shape-anim-doodle-sway", "bg-shape-anim-radar",
  "bg-shape-anim-scan", "bg-shape-anim-glitch", "bg-shape-anim-bounce",
  "bg-shape-anim-breathe", "bg-shape-anim-wobble", "bg-shape-anim-flash",
  "bg-shape-anim-conveyor", "bg-shape-anim-vortex"
];

function getShapeMotionClass(shapeCat = "") {
  if (isSmartMotionActive) {
    return CATEGORY_SMART_MOTION[shapeCat] || "";
  }
  return currentAnimation !== "none" ? currentAnimation : "";
}

function getActiveShapeClasses(shapeCls, shapeCat = "") {
  let parts = [shapeCls];
  const motion = getShapeMotionClass(shapeCat);
  if (motion) {
    parts.push(motion);
  }
  return parts.join(" ");
}

function getActiveShapeLabel(shapeCls, shapeCat = "") {
  let parts = [`.${shapeCls}`];
  const motion = getShapeMotionClass(shapeCat);
  if (motion) {
    parts.push(`.${motion}`);
  }
  return parts.join(" ");
}

function setPlaybackSpeed(speed, source = "user") {
  currentSpeed = speed;
  speedButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.speed === speed);
  });
  document.body.classList.remove("speed-slow", "speed-normal", "speed-fast");
  document.body.classList.add(`speed-${speed}`);
  const factor = speed === "slow" ? "1.8" : speed === "fast" ? "0.5" : "1";
  document.documentElement.style.setProperty("--bg-anim-dur", factor + "s");

  if (source !== "init") {
    showToast(`Animation Speed: ${speed === "slow" ? "0.5x (Slow/Zen)" : speed === "fast" ? "2x (Hyper)" : "1x (Normal)"}`);
  }
}

function toggleSmartMotion() {
  isSmartMotionActive = !isSmartMotionActive;
  if (smartMotionToggle) {
    smartMotionToggle.classList.toggle("active", isSmartMotionActive);
  }

  if (isSmartMotionActive) {
    globalAnimButtons.forEach(btn => btn.classList.remove("active"));
    if (activeAnimClassText) {
      activeAnimClassText.textContent = "Smart Mode";
    }
    showToast("✨ Smart Motion Active: All 17 categories move naturally!");
  } else {
    setShapeAnimation(currentAnimation, "toggle");
  }

  renderShapes();
  if (currentActiveShape) {
    updateModalDisplay();
  }
}

function setShapeAnimation(animClass, source = "user") {
  if (source === "user" && isSmartMotionActive) {
    isSmartMotionActive = false;
    if (smartMotionToggle) smartMotionToggle.classList.remove("active");
  }
  currentAnimation = animClass;

  // Update global buttons active state
  globalAnimButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.anim === animClass);
  });

  // Update modal buttons active state
  modalAnimButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.anim === animClass);
  });

  // Update animation badge text
  if (activeAnimClassText) {
    activeAnimClassText.textContent = animClass === "none" ? "None (Static)" : `.${animClass}`;
  }

  // Update all preview canvases on cards
  document.querySelectorAll(".preview-stage-viewport").forEach(viewport => {
    ALL_ANIMATION_CLASSES.forEach(c => viewport.classList.remove(c));
    if (animClass !== "none") {
      viewport.classList.add(animClass);
    }
  });

  // Update card copy button labels
  document.querySelectorAll(".shape-card").forEach(card => {
    const cls = card.dataset.shapeClass;
    const cat = card.dataset.shapeCat || "";
    if (cls) {
      const copySpan = card.querySelector(".copy-cls-text");
      if (copySpan) {
        copySpan.textContent = getActiveShapeLabel(cls, cat);
      }
    }
  });

  // Update modal display if open
  if (currentActiveShape) {
    updateModalDisplay();
  }

  if (source !== "init") {
    const label = animClass === "none" ? "Static (No Motion)" : `.${animClass}`;
    showToast(`Animation: ${label}`);
  }
}

function setShapeOpacity(percent, source = "user") {
  currentOpacity = percent;

  // Update CSS custom property on root so all shapes render with this opacity
  const dec = percent / 100;
  document.documentElement.style.setProperty("--bg-shape-opacity", dec.toString());

  // Update global buttons active state
  globalOpButtons.forEach(btn => {
    btn.classList.toggle("active", parseInt(btn.dataset.opacity) === percent);
  });

  // Update modal buttons active state
  modalOpButtons.forEach(btn => {
    btn.classList.toggle("active", parseInt(btn.dataset.op) === percent);
  });

  // Update opacity badge text
  if (activeOpClassText) {
    activeOpClassText.textContent = `${percent}%`;
  }

  // If modal is open, update modal stage and dynamic CSS code
  if (currentActiveShape) {
    updateModalDisplay();
  }

  // Update visible copy button labels on all rendered cards
  document.querySelectorAll(".shape-card").forEach(card => {
    const cls = card.dataset.shapeClass;
    const cat = card.dataset.shapeCat || "";
    if (cls) {
      const copySpan = card.querySelector(".copy-cls-text");
      if (copySpan) {
        copySpan.textContent = getActiveShapeLabel(cls, cat);
      }
    }
  });

  if (source !== "init") {
    showToast(`Opacity set to ${percent}% (updated in Particular CSS)`);
  }
}

function renderShapes() {
  const filtered = SHAPES_DATA.filter(s => {
    const matchesFilter = (activeFilter === "all") || (s.cat === activeFilter);
    const matchesSearch = !searchTerm ||
      s.name.toLowerCase().includes(searchTerm) ||
      s.cls.toLowerCase().includes(searchTerm) ||
      s.desc.toLowerCase().includes(searchTerm) ||
      s.best.toLowerCase().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  currentFilteredShapes = filtered;
  resultsCount.textContent = `Showing ${filtered.length} of ${SHAPES_DATA.length} shapes`;
  if (previewModal.classList.contains("open") && currentActiveShape) {
    updateModalNavCounter();
  }

  let html = "";
  let lastCategory = null;

  filtered.forEach(s => {
    // In "All" view without active search, render category section dividers
    if (activeFilter === "all" && !searchTerm && s.cat !== lastCategory) {
      lastCategory = s.cat;
      const countInCat = SHAPES_DATA.filter(item => item.cat === s.cat).length;
      html += `
        <div class="category-divider">
          <h2>${CATEGORY_NAMES[s.cat] || s.cat.toUpperCase()}</h2>
          <span class="cat-count-badge">${countInCat} Shapes</span>
        </div>
      `;
    }

    const motionCls = getShapeMotionClass(s.cat);
    const viewportCls = `preview-stage-viewport ${s.cls}${motionCls ? ' ' + motionCls : ''}`;
    const cardLabel = getActiveShapeLabel(s.cls, s.cat);

    html += `
      <div class="shape-card" data-shape-class="${s.cls}" data-shape-cat="${s.cat}">
        <div class="preview-canvas" onclick="openModal('${s.cls}')" title="Click to open full 100% desktop preview">
          <div class="${viewportCls}"></div>
          <span class="watermark-tag">🔍 Live Render</span>
          <span class="expand-hint">Expand Section ↗</span>
        </div>

        <div class="card-body">
          <div class="card-header-row">
            <span class="shape-num">#${s.num}</span>
            <span class="category-tag">${s.cat}</span>
          </div>
          <h3 class="shape-title">${s.name}</h3>
          <p class="shape-desc">${s.desc}</p>
          
          <div class="action-row">
            <button class="copy-btn" onclick="copyCardClass('${s.cls}', this)" title="Click to copy class name for Elementor">
              <span class="copy-cls-text">${cardLabel}</span>
              <span>📋</span>
            </button>
            <button class="preview-modal-btn" onclick="openModal('${s.cls}')" title="Open 100% full section preview">
              <span>Expand</span>
            </button>
          </div>

          <div class="elementor-tip">
            <strong>Best for:</strong> ${s.best}
          </div>
        </div>
      </div>
    `;
  });

  shapesGrid.innerHTML = html;
}

function getActiveShapeList() {
  return (currentFilteredShapes && currentFilteredShapes.length > 0)
    ? currentFilteredShapes
    : SHAPES_DATA;
}

function updateModalNavCounter() {
  if (!modalNavCounter || !currentActiveShape) return;
  const list = getActiveShapeList();
  const idx = list.findIndex(s => s.cls === currentActiveShape.cls);
  if (idx !== -1) {
    modalNavCounter.textContent = `${idx + 1} / ${list.length}`;
  } else {
    const fullIdx = SHAPES_DATA.findIndex(s => s.cls === currentActiveShape.cls);
    modalNavCounter.textContent = `${fullIdx + 1} / ${SHAPES_DATA.length}`;
  }
}

function navigateModal(direction) {
  if (!currentActiveShape) return;
  const list = getActiveShapeList();
  if (list.length === 0) return;

  let currentIndex = list.findIndex(s => s.cls === currentActiveShape.cls);
  if (currentIndex === -1) {
    currentIndex = SHAPES_DATA.findIndex(s => s.cls === currentActiveShape.cls);
    if (currentIndex === -1) currentIndex = 0;
  }

  let newIndex = (currentIndex + direction) % list.length;
  if (newIndex < 0) newIndex += list.length;

  openModal(list[newIndex].cls);
}

function openModal(className) {
  const shape = SHAPES_DATA.find(s => s.cls === className);
  if (!shape) return;
  currentActiveShape = shape;

  modalShapeNum.textContent = `#${shape.num}`;
  modalShapeName.textContent = shape.name;
  if (modalCategoryTag) {
    modalCategoryTag.textContent = shape.cat;
  }
  modalShapeDesc.textContent = `${shape.desc} (Best suited for: ${shape.best})`;

  updateModalNavCounter();
  updateModalDisplay();

  previewModal.classList.add("open");
}

function getDynamicShapeCss(shape) {
  if (!shape) return "";
  const rawRules = (window.SHAPES_RAW_CSS && window.SHAPES_RAW_CSS[shape.cls])
    || (window.SHAPES_CSS && window.SHAPES_CSS[shape.cls])
    || `.${shape.cls}::before { /* CSS */ }`;

  // Strip existing top comment if rawRules starts with /*
  let cleanRules = rawRules;
  if (cleanRules.startsWith("/*")) {
    const endComment = cleanRules.indexOf("*/");
    if (endComment !== -1) {
      cleanRules = cleanRules.slice(endComment + 2).trim();
    }
  }

  // Active classes for top comment (e.g. .bg-shape-grid or .bg-shape-grid .bg-shape-anim-float)
  const activeClasses = getActiveShapeClasses(shape.cls, shape.cat);
  const classPillText = activeClasses.split(" ").map(c => "." + c).join(" ");
  const topComment = `/* Shape #${shape.num} — ${shape.name} (${classPillText}) */`;

  let parts = [topComment];

  // Container Isolation & Anti-Bounce Lock:
  // Enforces relative positioning, strict overflow containment, and layer isolation
  // so the shape can NEVER overflow, cause scrollbar popping, or bounce the section.
  const props = [
    "  position: relative !important;",
    "  overflow: hidden !important;",
    "  isolation: isolate !important;",
    "  -webkit-transform: translateZ(0);",
    "  transform: translateZ(0);"
  ];

  if (currentAshIndex !== 0 && ASH_PRESETS[currentAshIndex]) {
    props.push(`  --bg-shape-color: ${ASH_PRESETS[currentAshIndex].val};`);
  }
  if (currentOpacity !== 100) {
    const dec = (currentOpacity / 100).toFixed(1);
    props.push(`  --bg-shape-opacity: ${dec};`);
  } else {
    props.push("  --bg-shape-opacity: 1;");
  }

  parts.push(`/* Container Isolation & Boundary Lock (Prevents Section Bouncing & Overflow) */\n.${shape.cls} {\n${props.join("\n")}\n}`);

  // Pseudo-element Reset Foundation:
  // Guarantees absolute positioning, -1 z-index, non-blocking pointer events,
  // and 3D backface stability even if the user does NOT load In-General CSS.
  parts.push(`/* Pseudo-Element Reset Foundation */\n.${shape.cls}::before,\n.${shape.cls}::after {\n  content: "";\n  position: absolute;\n  z-index: -1;\n  pointer-events: none;\n  opacity: var(--bg-shape-opacity, 1);\n  transition: opacity 0.2s ease;\n  backface-visibility: hidden;\n  -webkit-backface-visibility: hidden;\n  -webkit-transform: translateZ(0);\n  transform: translateZ(0);\n}`);

  // Pseudo-element rules for the shape
  parts.push(cleanRules);

  // Motion / Animation Customization
  const motionCls = getShapeMotionClass(shape.cat);
  if (motionCls && motionCls !== "none" && window.ANIMATION_DEFINITIONS && window.ANIMATION_DEFINITIONS[motionCls]) {
    parts.push(`/* Motion Style: .${motionCls} */\n${window.ANIMATION_DEFINITIONS[motionCls]}`);
  }

  return parts.join("\n\n");
}

function updateModalDisplay() {
  if (!currentActiveShape) return;
  const motionCls = getShapeMotionClass(currentActiveShape.cat);
  const motionPart = motionCls ? ` ${motionCls}` : "";
  modalStage.className = `modal-preview-stage ${currentActiveShape.cls}${motionPart}`;

  modalClassCode.textContent = getActiveShapeLabel(currentActiveShape.cls, currentActiveShape.cat);

  // Sync modal motion buttons active state
  modalAnimButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.anim === currentAnimation);
  });

  // Sync modal opacity buttons active state
  modalOpButtons.forEach(btn => {
    btn.classList.toggle("active", parseInt(btn.dataset.op, 10) === currentOpacity);
  });

  // Populate Dynamic Standalone Shape CSS & In-General CSS boxes
  if (modalCodeShapeNum) {
    modalCodeShapeNum.textContent = currentActiveShape.num;
  }
  if (modalShapeCssCode) {
    modalShapeCssCode.textContent = getDynamicShapeCss(currentActiveShape);
  }
  if (modalGeneralCssCode) {
    modalGeneralCssCode.textContent = window.IN_GENERAL_CSS || "";
  }
}

function closeModal() {
  previewModal.classList.remove("open");
}

modalCloseBtn.addEventListener("click", closeModal);
if (modalStagePrevBtn) modalStagePrevBtn.addEventListener("click", (e) => { e.stopPropagation(); navigateModal(-1); });
if (modalStageNextBtn) modalStageNextBtn.addEventListener("click", (e) => { e.stopPropagation(); navigateModal(1); });
if (modalHeaderPrevBtn) modalHeaderPrevBtn.addEventListener("click", (e) => { e.stopPropagation(); navigateModal(-1); });
if (modalHeaderNextBtn) modalHeaderNextBtn.addEventListener("click", (e) => { e.stopPropagation(); navigateModal(1); });

previewModal.addEventListener("click", (e) => {
  if (e.target === previewModal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (!previewModal.classList.contains("open")) return;
  if (e.key === "Escape") {
    closeModal();
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    navigateModal(-1);
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    navigateModal(1);
  }
});

function copyCardClass(shapeCls, btn) {
  const shape = SHAPES_DATA.find(s => s.cls === shapeCls);
  const cat = shape ? shape.cat : "";
  const classToCopy = getActiveShapeClasses(shapeCls, cat);
  copyTextToClipboard(classToCopy, btn, `Copied: ${classToCopy}`);
}

modalCopyBtn.addEventListener("click", () => {
  if (currentActiveShape) {
    const classToCopy = getActiveShapeClasses(currentActiveShape.cls, currentActiveShape.cat);
    copyTextToClipboard(classToCopy, modalCopyBtn, `Copied: ${classToCopy}`);
  }
});

// Standalone CSS Export Copy Handlers
if (modalCopyShapeCssBtn) {
  modalCopyShapeCssBtn.addEventListener("click", () => {
    if (modalShapeCssCode && currentActiveShape) {
      const code = modalShapeCssCode.textContent;
      copyButtonSnippet(code, modalCopyShapeCssBtn, `Copied Shape #${currentActiveShape.num} CSS!`);
    }
  });
}

if (modalCopyGeneralCssBtn) {
  modalCopyGeneralCssBtn.addEventListener("click", () => {
    if (modalGeneralCssCode) {
      const code = modalGeneralCssCode.textContent;
      copyButtonSnippet(code, modalCopyGeneralCssBtn, "Copied In-General Base CSS!");
    }
  });
}

if (modalCopyCombinedBtn) {
  modalCopyCombinedBtn.addEventListener("click", () => {
    if (currentActiveShape) {
      const genCss = window.IN_GENERAL_CSS || "";
      const shapeCss = getDynamicShapeCss(currentActiveShape);
      const combined = `${genCss}\n\n${shapeCss}`;
      copyButtonSnippet(combined, modalCopyCombinedBtn, `Copied Combined CSS (Base + Shape #${currentActiveShape.num})!`);
    }
  });
}

function copyButtonSnippet(text, btn, toastMsg) {
  navigator.clipboard.writeText(text).then(() => {
    btn.classList.add("copied");
    const origHtml = btn.innerHTML;
    btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>Copied!</span>`;
    showToast(toastMsg || "Copied to clipboard!");
    setTimeout(() => {
      btn.classList.remove("copied");
      btn.innerHTML = origHtml;
    }, 2000);
  });
}

if (activeOpClassBadge) {
  activeOpClassBadge.addEventListener("click", () => {
    const val = currentOpacity === 100 ? "1" : (currentOpacity / 100).toFixed(1);
    const codeSnippet = `--bg-shape-opacity: ${val};`;
    navigator.clipboard.writeText(codeSnippet).then(() => {
      showToast(`Copied ${codeSnippet} to clipboard!`);
    });
  });
}

function cycleAshTone() {
  currentAshIndex = (currentAshIndex + 1) % ASH_PRESETS.length;
  const col = ASH_PRESETS[currentAshIndex];
  document.documentElement.style.setProperty("--bg-shape-color", col.val);

  const label = `Ash: ${col.name}`;
  if (ashColorText) ashColorText.textContent = label;
  if (modalColorText) modalColorText.textContent = label;

  if (currentActiveShape) {
    updateModalDisplay();
  }

  showToast(`Switched shape tone to ${col.name}!`);
}

if (ashColorToggle) {
  ashColorToggle.addEventListener("click", cycleAshTone);
}
if (modalColorCycle) {
  modalColorCycle.addEventListener("click", cycleAshTone);
}

// Opacity button event listeners
globalOpButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const op = parseInt(btn.dataset.opacity, 10);
    setShapeOpacity(op);
  });
});

modalOpButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const op = parseInt(btn.dataset.op, 10);
    setShapeOpacity(op);
  });
});

// Global Animation Button Event Listeners
globalAnimButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const anim = btn.dataset.anim || "none";
    setShapeAnimation(anim);
  });
});

// Modal Animation Button Event Listeners
modalAnimButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const anim = btn.dataset.anim || "none";
    setShapeAnimation(anim);
  });
});

// Smart Motion Toggle Event Listener
if (smartMotionToggle) {
  smartMotionToggle.addEventListener("click", toggleSmartMotion);
}

// Speed Control Buttons
speedButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const speed = btn.dataset.speed || "normal";
    setPlaybackSpeed(speed);
  });
});

// Animation Badge Click to Copy
if (activeAnimClassBadge) {
  activeAnimClassBadge.addEventListener("click", () => {
    const animCls = currentAnimation === "none" ? "bg-shape-anim-float" : currentAnimation;
    navigator.clipboard.writeText(animCls).then(() => {
      showToast(`Copied .${animCls} to clipboard!`);
    });
  });
}

function copyTextToClipboard(text, btn, toastMsg) {
  navigator.clipboard.writeText(text).then(() => {
    btn.classList.add("copied");
    const origHtml = btn.innerHTML;
    btn.innerHTML = `<span>Copied: ${text}</span> <span>✓</span>`;
    showToast(toastMsg || `Copied ${text} to clipboard!`);
    setTimeout(() => {
      btn.classList.remove("copied");
      btn.innerHTML = origHtml;
    }, 2000);
  });
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

searchInput.addEventListener("input", (e) => {
  searchTerm = e.target.value.toLowerCase().trim();
  renderShapes();
});

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    renderShapes();
  });
});

// Glow contrast boost toggle
let boostLevel = 1;
boostToggle.addEventListener("click", () => {
  boostLevel = (boostLevel % 3) + 1;
  document.body.setAttribute("data-boost", boostLevel.toString());
  if (boostLevel === 1) {
    boostText.textContent = "Fade: Normal (1x)";
  } else if (boostLevel === 2) {
    boostText.textContent = "Fade: Enhanced (1.5x)";
  } else {
    boostText.textContent = "Fade: High Contrast (2.4x)";
  }
  showToast(`Contrast Mode: ${boostText.textContent}`);
});

// Scroll to Top with Circular Progress Indicator
const scrollTopBtn = document.getElementById("scrollTopBtn");
const scrollProgressCircle = document.getElementById("scrollProgressCircle");
const CIRCLE_CIRCUMFERENCE = 125.66; // 2 * PI * 20

function handleWindowScroll() {
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

  if (scrollTopBtn) {
    if (scrollY > 300) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  }

  if (scrollProgressCircle && docHeight > 0) {
    const progress = Math.min(Math.max(scrollY / docHeight, 0), 1);
    const offset = CIRCLE_CIRCUMFERENCE - (progress * CIRCLE_CIRCUMFERENCE);
    scrollProgressCircle.style.strokeDashoffset = offset;
  }
}

if (scrollTopBtn) {
  window.addEventListener("scroll", handleWindowScroll, { passive: true });
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Initial Setup
setShapeOpacity(100, "init");
renderShapes();
handleWindowScroll();
