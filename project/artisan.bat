@echo off
REM Script to run Laravel artisan commands using PHP 8.3.14 from Wampserver
REM Usage: artisan.bat [command]
REM Example: artisan.bat migrate
REM Example: artisan.bat migrate:status

if "%1"=="" (
    echo Usage: artisan.bat [command]
    echo Example: artisan.bat migrate
    echo Example: artisan.bat migrate:status
    exit /b 1
)

C:\wamp64\bin\php\php8.3.14\php.exe artisan %*

