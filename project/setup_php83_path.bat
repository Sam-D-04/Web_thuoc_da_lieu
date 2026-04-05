@echo off
REM Script to add PHP 8.3.14 to Windows PATH
REM Run this script as Administrator

echo ========================================
echo Setup PHP 8.3.14 PATH
echo ========================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script must be run as Administrator!
    echo Right-click and select "Run as administrator"
    pause
    exit /b 1
)

set "PHP_PATH=C:\wamp64\bin\php\php8.3.14"
set "OLD_PHP_PATH=C:\wamp64\bin\php\php7.4.33"

echo Checking if PHP 8.3.14 exists...
if not exist "%PHP_PATH%\php.exe" (
    echo ERROR: PHP 8.3.14 not found at %PHP_PATH%
    pause
    exit /b 1
)

echo PHP 8.3.14 found!
echo.

echo Current PATH:
echo %PATH%
echo.

echo Adding PHP 8.3.14 to System PATH...
for /f "tokens=2*" %%A in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PATH 2^>nul') do set "CURRENT_PATH=%%B"

REM Check if PHP 8.3.14 already in PATH
echo %CURRENT_PATH% | findstr /C:"%PHP_PATH%" >nul
if %errorLevel% equ 0 (
    echo PHP 8.3.14 is already in PATH!
) else (
    REM Remove old PHP 7.4.33 if exists
    set "NEW_PATH=%CURRENT_PATH%"
    set "NEW_PATH=%NEW_PATH:%OLD_PHP_PATH%;=%"
    set "NEW_PATH=%NEW_PATH:%OLD_PHP_PATH%=%"
    
    REM Add PHP 8.3.14 to the beginning
    setx PATH "%PHP_PATH%;%NEW_PATH%" /M
    
    if %errorLevel% equ 0 (
        echo SUCCESS: PHP 8.3.14 added to PATH!
        echo.
        echo Please restart your terminal/IDE for changes to take effect.
    ) else (
        echo ERROR: Failed to update PATH
    )
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Close and reopen your terminal/IDE
echo 2. Run: php -v
echo 3. You should see: PHP 8.3.14
echo.
pause

