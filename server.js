import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { execFile, exec, spawn } from "child_process";
import { error } from "console";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMP_DIR = path.join(__dirname, "temp");

if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR);
}

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Route (optional)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/run-code", async (req, res) => {
  const { code, input } = req.body;

  if(!input || !input.trim()) {
    res.json({error: "Please add input|"});
    return;
  }
  const cppFile = path.join(TEMP_DIR, "main.cpp");
  const binaryFile = path.join(TEMP_DIR, "main");
  const inputFile = path.join(TEMP_DIR, "input.txt");

  fs.writeFileSync(cppFile, code);
  fs.writeFileSync(inputFile, input || "");

  try {
    // 1. compile first (sync style using spawn wrapper)
    const compile = spawn("g++", [cppFile, "-o", binaryFile]);

    let compileError = "";

    compile.stderr.on("data", (data) => {
      compileError += data.toString();
    });

    compile.on("close", (code) => {
      if (code !== 0) {
        return res.json({
          output: "",
          error: compileError || "Compilation Error",
        });
      }

      // 2. run program
      const run = spawn(binaryFile);

      const inputStream = fs.createReadStream(inputFile);

      let output = "";
      let error = "";

      run.stdout.on("data", (data) => {
        output += data.toString();
      });

      run.stderr.on("data", (data) => {
        error += data.toString();
      });

      run.on("close", () => {
        return res.json({
          output: output.trim(),
          error: error || null,
        });
      });

      // send input
      inputStream.pipe(run.stdin);
    });
  } catch (err) {
    res.json({error: err.message})
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
