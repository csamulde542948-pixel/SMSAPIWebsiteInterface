@echo off
cd /d "%~dp0"
set VITE_API_BASE_URL=http://localhost:8091
npm.cmd run dev -- --host 0.0.0.0
