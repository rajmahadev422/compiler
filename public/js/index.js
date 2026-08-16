/* ── Monaco Setup ── */
require.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs",
  },
});

let editor;

require(["vs/editor/editor.main"], function () {
  // console.log(monaco.languages.getLanguages());

  editor = monaco.editor.create(document.getElementById("editor"), {
    value: starterCode['cpp'],
    language: 'cpp',
    theme: "vs-dark",
    automaticLayout: true,
    fontSize: 14,
    fontFamily: " Cascadia Code, Fira Code, monospace",
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    lineNumbers: "on",
    renderLineHighlight: "gutter",
    padding: { top: 12 },
    autoIndent: "full",
    tabSize: 2,
    formatOnType: true,
    formatOnPaste: true,
    guides: {
      indentation: true
    },
    nsertSpaces: true,
    scrollBeyondLastLine: false,
    smoothScrolling: true,
    cursorBlinking: "smooth",
    cursorSmoothCaretAnimation: "on",
    quickSuggestions: true,
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: "on",
    snippetSuggestions: "top",
    parameterHints: {
      enabled: true,
    },
  });

  document
    .getElementById("lang-select")
    .addEventListener("change", function () {
      const lang = this.value;
      monaco.editor.setModelLanguage(editor.getModel(), lang);
      editor.setValue(starterCode[lang]);
    });
});

/* ── Execution Mock scripts ── */
document.getElementById("btn-run").addEventListener("click", async () => {
  const input = document.getElementById("custom-input").value;
  const code = editor.getValue();

  document.getElementById('finish').innerText = "";
  socket.emit("run-code", { code, input });

});