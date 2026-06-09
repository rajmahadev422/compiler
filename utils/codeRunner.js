import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export function codeRunner(folderPath) {
  return new Promise((resolve) => {
    const cppFile = path.join(folderPath, "main.cpp");
    const inputFile = path.join(folderPath, "input.txt");
    const binaryFile = path.join(folderPath, "main.exe");

    const compile = spawn("g++", [cppFile, "-o", binaryFile]);

    let compileError = "";

    compile.stderr.on("data", (data) => {
      compileError += data.toString();
    });

    compile.on("close", (code) => {
      if (code !== 0) {
        return resolve({
          output: "",
          error: compileError,
        });
      }

      let run;

      try {
        run = spawn(binaryFile);
      } catch (err) {
        return resolve({
          output: "",
          error: err.message,
        });
      }

      run.on("error", (err) => {
        resolve({
          output: "",
          error: err.message,
        });
      });

      let output = "";
      let error = "";

      run.stdout.on("data", (data) => {
        output += data.toString();
      });

      run.stderr.on("data", (data) => {
        error += data.toString();
      });

      const inputStream = fs.createReadStream(inputFile);
      inputStream.pipe(run.stdin);

      run.on("close", () => {
        resolve({
          output: output.trim(),
          error: error || null,
        });
      });
    });
  });
}
