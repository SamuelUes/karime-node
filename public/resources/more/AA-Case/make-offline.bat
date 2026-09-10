@echo off
title Objection.lol Offline Converter
cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo   Node.js is not installed!
    echo ========================================
    echo.
    echo To use this script, please install Node.js:
    echo.
    echo   1. Go to https://nodejs.org
    echo   2. Download the LTS version
    echo   3. Run the installer
    echo   4. Restart this script
    echo.
    echo ========================================
    echo.
    pause
    exit /b 1
)

node make-offline.js
if %errorlevel% neq 0 (
    echo.
    pause
    exit /b 1
)

echo.
set /p CLEANUP="Remove offline conversion scripts? (y/n): "
if /i "%CLEANUP%"=="y" (
    del "%~f0" >nul 2>nul
    del "%~dp0make-offline.js" >nul 2>nul
    del "%~dp0make-offline.command" >nul 2>nul
    del "%~dp0README.txt" >nul 2>nul
    echo [OK] Cleanup complete.
)
echo.
pause
