@echo off
title Push EduBridge AI to GitHub
set PATH=C:\Users\PUTTA BALA SHANKAR\AppData\Local\github-copilot-git-2.53.0-3\cmd;%PATH%
echo ====================================================================
echo   Pushing EduBridge AI to GitHub Repository:
echo   https://github.com/puttabalashankar629-sketch/hackthon.git
echo ====================================================================
echo.
echo Attempting git push...
git push -u origin main --force
if %errorlevel% neq 0 (
    echo.
    echo --------------------------------------------------------------------
    echo Direct push requires GitHub authentication.
    echo You can generate a token at: https://github.com/settings/tokens
    echo --------------------------------------------------------------------
    set /p GITHUB_PAT="Paste your GitHub Personal Access Token: "
    if defined GITHUB_PAT (
        git push -u https://%GITHUB_PAT%@github.com/puttabalashankar629-sketch/hackthon.git main --force
    )
)
echo.
echo ====================================================================
pause
