import { spawn, exec } from "child_process";
import path from "path";
import fs from "fs";

export function codeRunner(folderPath) {
  return new Promise((resolve) => {
    const cppFile = path.join(folderPath, "main.cpp");
    const inputFile = path.join(folderPath, "input.txt");
    const binaryFile = path.join(folderPath, "main.exe");

    let finished = false;

    const safeResolve = (result) => {
      if (finished) return;
      finished = true;
      resolve(result);
    };

    if (!fs.existsSync(cppFile)) {
      return safeResolve({
        output: "",
        error: "Source file not found",
      });
    }

    let compile;

    try {
      compile = spawn("g++", [cppFile, "-o", binaryFile]);
    } catch (err) {
      return safeResolve({
        output: "",
        error: err.message,
      });
    }

    let compileError = "";

      console.log("COMPILE TIMEOUT");

    compile.stdout.on("data", (data) => {
      console.log("COMPILE STDOUT:", data.toString());
    });

    compile.stderr.on("data", (data) => {
      compileError += data.toString();
      console.log("COMPILE STDERR:", data.toString());
    });

    compile.on("error", (err) => {

      safeResolve({
        output: "",
        error: err.message,
      });
    });

    compile.on("close", (code) => {

      console.log("Compile Exit Code:", code);

      if (code !== 0) {
        return safeResolve({
          output: "",
          error: compileError || "Compilation Failed",
        });
      }

      if (!fs.existsSync(binaryFile)) {
        return safeResolve({
          output: "",
          error: "Executable file not found",
        });
      }

      let run;

      try {
        run = spawn(binaryFile);
      } catch (err) {
        return safeResolve({
          output: "",
          error: err.message,
        });
      }

      let output = "";
      let error = "";

      const MAX_OUTPUT_SIZE = 2 * 1024 * 1024; // 1MB

      const runtimeTimeout = setTimeout(() => {
        console.log("TIME LIMIT EXCEEDED");

        try {
          if (process.platform === "win32") {
            exec(`taskkill /pid ${run.pid} /T /F`);
          } else {
            run.kill("SIGKILL");
          }
        } catch {}

        safeResolve({
          output: "",
          error: "Time Limit Exceeded (3s)",
        });
      }, 3000);

      run.on("error", (err) => {
        clearTimeout(runtimeTimeout);

        safeResolve({
          output: "",
          error: err.message,
        });
      });

      run.stdout.on("data", (data) => {
        output += data.toString();

        if (output.length > MAX_OUTPUT_SIZE) {
          clearTimeout(runtimeTimeout);

          try {
            if (process.platform === "win32") {
              exec(`taskkill /pid ${run.pid} /T /F`);
            } else {
              run.kill("SIGKILL");
            }
          } catch {}

          safeResolve({
            output: "",
            error: "Output Limit Exceeded",
          });
        }
      });

      run.stderr.on("data", (data) => {
        error += data.toString();

        if (error.length > MAX_OUTPUT_SIZE) {
          clearTimeout(runtimeTimeout);

          try {
            if (process.platform === "win32") {
              exec(`taskkill /pid ${run.pid} /T /F`);
            } else {
              run.kill("SIGKILL");
            }
          } catch {}

          safeResolve({
            output: "",
            error: "Error Output Limit Exceeded",
          });
        }
      });

      if (fs.existsSync(inputFile)) {
        const inputStream = fs.createReadStream(inputFile);

        inputStream.pipe(run.stdin);

        inputStream.on("end", () => {
          run.stdin.end();
        });

        inputStream.on("error", (err) => {
          console.log("Input Stream Error:", err);
        });
      } else {
        run.stdin.end();
      }

      run.on("close", (code, signal) => {
        clearTimeout(runtimeTimeout);

        safeResolve({
          output: output.trim(),
          error: error.trim() || null,
        });
      });
    });
  });
}
