
# 🚀 Online Code Compiler

A web-based online code compiler that allows users to write, compile, and execute C++ code in real time using a secure Docker-based execution environment.

<img width="1913" height="906" alt="image" src="https://github.com/user-attachments/assets/398f3b39-43e9-4c6d-98ad-aeca4b0997b4" />

## 📌 Features

- 🧑‍💻 Write and execute C++ code in the browser
- 🐳 Secure code execution using Docker containers
- ⚡ Real-time compilation and output display
- 📥 Support for custom user input
- 🌐 REST API-based backend built with Node.js
- 🎨 Responsive UI built with HTML and Tailwind CSS
- ❌ Proper handling of compilation and runtime errors

## 🛠️ Tech Stack

- **Frontend:** HTML, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Execution Environment:** Docker
- **Language Supported:** C++ (extendable to more languages)

## ⚙️ How It Works

- User writes C++ code in the editor
- Code and input are sent to the backend via REST API
- Backend creates temporary files for code execution
- Docker container compiles and runs the code securely
- Output or errors are returned to the frontend

## 📁 Project Structure

```plaintext
- compiler-project/
│
├── frontend/
│   ├── index.html
│   └── styles.css (Tailwind)
│
├── backend/
│   ├── server.js
│   ├── routes/
│   └── utils/
│
├── temp/ (generated files)
├── Dockerfile
└── README.md
```

## 🔐 Security

- Code execution is isolated inside Docker containers
- No direct access to host system
- Temporary files are auto-generated and cleaned

## 📈 Future Improvements

- Add multi-language support (Python, Java, JS)
- Add authentication and user history
- Add execution time and memory limits
- Add queue system for handling multiple requests

## 👨‍💻 Author

*Built by Mahadev*
