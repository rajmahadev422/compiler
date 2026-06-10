/* ── Monaco Setup ── */
require.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs",
  },
});

const starterCode = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

#define ll long long

void solve() {

}
int main() {
    int t;
    cin>>t;

    while(t--) solve();
    return 0;
}`,
  java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // your code here
    }
}`,
  python: `def two_sum(nums: list[int], target: int) -> list[int]:
    # your code here
    pass
`,
  javascript: `console.log("Running");`,
};

let editor;

require(["vs/editor/editor.main"], function () {
  // console.log(monaco.languages.getLanguages());

  editor = monaco.editor.create(document.getElementById("editor"), {
    value: starterCode.cpp,
    language: "cpp",
    theme: "vs-dark",
    automaticLayout: true,
    fontSize: 14,
    fontFamily: "'JetBrains Mono', monospace",
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    lineNumbers: "on",
    renderLineHighlight: "gutter",
    padding: { top: 12 },
    tabSize: 2,
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
  const out = document.getElementById("output-box");
  const code = editor.getValue();

  socket.emit("run-code", { code, input });

  out.className =
    "flex-1 bg-[#0d0d1a] border border-zinc-800 rounded-xl p-3 font-['JetBrains_Mono',monospace] text-xs text-purple-400 outline-hidden overflow-y-auto whitespace-pre select-text";
  out.textContent = "⏳ Submitting…";
});

document.getElementById("btn-submit").addEventListener("click", async () => {
  const input = document.getElementById("custom-input").value;
  const out = document.getElementById("output-box");
  const code = editor.getValue();

  socket.emit("run-code", { code, input });

  out.className =
    "flex-1 bg-[#0d0d1a] border border-zinc-800 rounded-xl p-3 font-['JetBrains_Mono',monospace] text-xs text-purple-400 outline-hidden overflow-y-auto whitespace-pre select-text";
  out.textContent = "⏳ Submitting…";
});

function loadQuestion(question) {
  const questionEle = document.getElementById("left-panel");
  questionEle.innerHTML = `
<div id="left-scroll">

        <div class="flex items-center gap-2.5">
          ${question.tags
            .map(
              (
                tag,
              ) => `<span class="text-green-400 capitalize border border-green-600/50 px-3 py-0.5 rounded-full text-xs font-semibold tracking-wider select-none">
            ${tag}
            </span>`,
            )
            .join("")}
        </div>

        <h1 class="text-2xl font-extrabold text-white m-0 mb-3.5 tracking-tight select-text">
          1. ${question.title}
        </h1>

        <p class="text-zinc-400 text-sm leading-relaxed m-0 mb-5 select-text">${question.story}</p>

        ${question.examples
          .map(
            (
              exm,
              i,
            ) => `<div class="bg-[#0d0d1a] border border-zinc-800/80 rounded-xl p-4 mb-4 select-text">
          <div class="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5 select-none">Example ${i + 1}</div>
          <pre class="font-['JetBrains_Mono',monospace] text-xs text-zinc-400 m-0 leading-relaxed whitespace-pre-wrap">
Input:  ${exm.input}
Output: ${exm.output}
${exm.reason ? `Reason: ${exm.reason}` : ""}
          </pre>
        </div>`,
          )
          .join("")}

        <div class="bg-[#0d0d1a] border border-zinc-800/80 rounded-xl p-4 mb-4 select-text">
          <div class="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5 select-none">Constraints
          </div>
          <pre class="font-['JetBrains_Mono',monospace] text-xs text-zinc-400 m-0 leading-relaxed list-none">
${question.constraint.length !== 0 ? question.constraint.map((cons) => cons).join("\n") : ""}
        </pre>
        </div>

      </div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  loadQuestion(problem);
});
