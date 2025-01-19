@echo off
powershell -Command "Get-Process | Where-Object {$_.MainWindowTitle -like '*go run*'} | Stop-Process -Force"
powershell -Command "Get-Process main | Stop-Process -Force"
timeout /t 2 /nobreak > nul
