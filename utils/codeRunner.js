import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export function codeRunner(folderPath) {
  return new Promise((resolve) => {
    const cppFile = path.join(folderPath, "main.cpp");
    const inputFile = path.join(folderPath, "input.txt");
    const binaryFile = path.join(folderPath, "main.exe");

    console.log("\n========== JOB START ==========");
    console.log("Folder:", folderPath);
    console.log("CPP:", cppFile);
    console.log("INPUT:", inputFile);
    console.log("EXE:", binaryFile);

    console.log("CPP Exists:", fs.existsSync(cppFile));
    console.log("INPUT Exists:", fs.existsSync(inputFile));

    let compile;

    try {
      compile = spawn("g++", [cppFile, "-o", binaryFile]);
    } catch (err) {
      console.log("Compile Spawn Error:", err);

      return resolve({
        output: "",
        error: err.message,
      });
    }

    let compileError = "";

    compile.stdout.on("data", (data) => {
      console.log("COMPILE STDOUT:", data.toString());
    });

    compile.stderr.on("data", (data) => {
      console.log("COMPILE STDERR:", data.toString());
      compileError += data.toString();
    });

    compile.on("error", (err) => {
      console.log("COMPILE PROCESS ERROR:", err);

      resolve({
        output: "",
        error: err.message,
      });
    });

    compile.on("close", (compileCode) => {
      console.log("Compile Exit Code:", compileCode);

      if (compileCode !== 0) {
        return resolve({
          output: "",
          error: compileError || "Compilation Failed",
        });
      }

      console.log("EXE Exists:", fs.existsSync(binaryFile));

      if (!fs.existsSync(binaryFile)) {
        return resolve({
          output: "",
          error: "Executable file was not created",
        });
      }

      let run;

      try {
        run = spawn(binaryFile);
      } catch (err) {
        console.log("RUN SPAWN ERROR:", err);

        return resolve({
          output: "",
          error: err.message,
        });
      }

      let output = "";
      let error = "";

      run.on("error", (err) => {
        console.log("RUNTIME ERROR:", err);

        resolve({
          output: "",
          error: err.message,
        });
      });

      run.stdout.on("data", (data) => {
        const text = data.toString();

        console.log("PROGRAM STDOUT:", text);

        output += text;
      });

      run.stderr.on("data", (data) => {
        const text = data.toString();

        console.log("PROGRAM STDERR:", text);

        error += text;
      });

      if (fs.existsSync(inputFile)) {
        const inputStream = fs.createReadStream(inputFile);

        inputStream.pipe(run.stdin);

        inputStream.on("end", () => {
          console.log("Input stream finished");
          run.stdin.end();
        });

        inputStream.on("error", (err) => {
          console.log("Input Stream Error:", err);
        });
      }

      run.on("close", (runCode) => {
        console.log("Run Exit Code:", runCode);
        console.log("Final Output:", output);
        console.log("Final Error:", error);
        console.log("========== JOB END ==========\n");

        resolve({
          output: output.trim(),
          error: error.trim() || null,
        });
      });
    });
  });
}
