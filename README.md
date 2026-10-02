# 🎵 AudioVault — Music Database & Web Audio Synthesizer Studio

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Demo-zinc?logo=vercel)](https://audiovault-toadbigode.vercel.app)
[![React 18](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?logo=sqlite)](https://sqlite.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python)](https://python.org/)

> **AudioVault** is an editorial music database and procedural Web Audio synthesizer workspace. It pairs a relational SQLite track registry with a real-time frequency visualizer canvas, interactive SQL query sandbox, and a standalone Python CLI database manager.

---

## ✨ Features

- **📊 High-Density Track Data Grid**: Sort by BPM, Year, Title, Artist with instant column filtering and favorite marking.
- **⚡ In-Browser SQL Sandbox**: Execute queries (`SELECT`, `GROUP BY`, `ORDER BY`) with sub-millisecond execution timing.
- **🎛️ Procedural Web Audio Engine**: Zero-bandwidth synthetic audio playback with real-time `<canvas>` frequency bars analyzer.
- **💾 Dual Architecture (Web + Python CLI)**:
  - React 18 / TypeScript SPA deployed on Vercel.
  - Standalone `banco_de_dados.py` SQLite CLI script for local terminal operations.
- **📤 Export Capabilities**: 1-Click SQLite `.sql` schema & data dump generation.

---

## 🚀 Live Demo

Experience AudioVault directly in your browser:
👉 **[https://audiovault-toadbigode.vercel.app](https://audiovault-toadbigode.vercel.app)**

---

## 💻 Local Development

### Web Studio (React + Vite)
```bash
# Clone the repository
git clone https://github.com/davinascimento2/banco-de-dados-de-musica.git

# Navigate into directory
cd banco-de-dados-de-musica

# Install dependencies
npm install

# Start development server
npm run dev
```

### Python SQLite CLI
```bash
python banco_de_dados.py
```

---

## 👤 Author

Developed by **[Davi Nascimento](https://github.com/davinascimento2)**
Portfolio: [career-command-center-toadbigode.vercel.app](https://career-command-center-toadbigode.vercel.app)
