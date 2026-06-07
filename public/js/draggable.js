
/* ── Horizontal drag scripting untouched ── */
const divider = document.getElementById("divider");
const leftPanel = document.getElementById("left-panel");
const rightPanel = document.getElementById("right-panel");

let hDragging = false;

divider.addEventListener("mousedown", (e) => {
  hDragging = true;
  divider.classList.add("dragging");
  document.body.classList.add("dragging");
  e.preventDefault();
});

document.addEventListener("mousemove", (e) => {
  if (!hDragging) return;
  const total = document.getElementById("root").offsetWidth;
  const divW = divider.offsetWidth;
  let leftW = e.clientX;
  leftW = Math.max(240, Math.min(leftW, total - divW - 300));
  leftPanel.style.width = leftW + "px";
  rightPanel.style.width = total - divW - leftW + "px";
});

document.addEventListener("mouseup", () => {
  if (!hDragging) return;
  hDragging = false;
  divider.classList.remove("dragging");
  document.body.classList.remove("dragging");
});

/* ── Vertical drag scripting untouched ── */
const vDivider = document.getElementById("v-divider");
const editorSection = document.getElementById("editor-section");
const ioSection = document.getElementById("io-section");
const rightPanelEl = document.getElementById("right-panel");

let vDragging = false;

vDivider.addEventListener("mousedown", (e) => {
  vDragging = true;
  vDivider.classList.add("dragging");
  document.body.classList.add("dragging");
  e.preventDefault();
});

document.addEventListener("mousemove", (e) => {
  if (!vDragging) return;
  const toolbarH = document.getElementById("toolbar").offsetHeight;
  const vDivH = vDivider.offsetHeight;
  const panelTop = rightPanelEl.getBoundingClientRect().top;
  const panelH = rightPanelEl.offsetHeight;
  const available = panelH - toolbarH - vDivH;
  const editorH = e.clientY - panelTop - toolbarH;
  const clampedE = Math.max(120, Math.min(editorH, available - 80));
  editorSection.style.flex = "none";
  editorSection.style.height = clampedE + "px";
  ioSection.style.height = available - clampedE + "px";
});

document.addEventListener("mouseup", () => {
  if (!vDragging) return;
  vDragging = false;
  vDivider.classList.remove("dragging");
  document.body.classList.remove("dragging");
});
