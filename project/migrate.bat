@echo off
REM Script to run Laravel migrations using PHP 8.3.14 from Wampserver
echo Running migrations with PHP 8.3.14...
C:\wamp64\bin\php\php8.3.14\php.exe artisan migrate
pause

