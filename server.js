import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { execFile, exec, spawn } from "child_process";
import { error } from "console";
import http from "http";
import { Server } from "socket.io";
import { createFolder, deleteFolder } from "./utils/create.js";
import queue from "./utils/queue.js";
import { codeRunner } from "./utils/codeRunner.js";
import crypto from 'crypto';

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
app.use(express.static("public"));

// Route (optional)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const server = http.createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {

  console.log('User connected: ', socket.id);

  const id = crypto.randomUUID();
  const folderPath = path.join(TEMP_DIR, id);

  socket.on("run-code", async ({ code, input }) => {
    socket.emit('status', "Submitting...")
    queue.add(async () => {
      try {
        socket.emit("status", "In queue");

        const { isCreated } = await createFolder(folderPath, code, input);

        if (isCreated) return socket.emit("status", error);
        socket.emit("status", "Compiling");

        const { output, error } = await codeRunner(folderPath);


        if (error) socket.emit("status", error);
        else socket.emit("status", output);
      } catch (err) {
        console.log(err);
        socket.emit("status", err.message);
      } finally {
        await deleteFolder(folderPath);
        socket.emit('finished', "\n=============Finished===========");
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
